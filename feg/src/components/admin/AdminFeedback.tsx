import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FeedbackFilters from "../../components/admin/FeedbackFilters";
import FeedbackTable from "../../components/admin/FeedbackTable";
import Pagination from "../../components/admin/Pagination";
import {
    fetchAdminFeedback,
    fetchAdminFeedbackDetail,
    markFeedbackRead,
    updateFeedbackStatus,
    type AdminFeedbackEntry,
    type AdminFeedbackFilters,
    type AdminFeedbackStatus,
} from "../../data/admin";
import {toast} from 'sonner';

const PAGE_SIZE = 10;

export default function AdminFeedback() {
    const [searchParams] = useSearchParams();
    const initialReadState = searchParams.get("status") === "new" ? "unread" : "all";

    const [filters, setFilters] = useState<AdminFeedbackFilters>(() => ({
        type: "all",
        status: "all",
        readState: initialReadState,
        search: "",
    }));

    const [page, setPage] = useState(1);
    const [entries, setEntries] = useState<AdminFeedbackEntry[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        setPage(1);
    }, [filters]);

    useEffect(() => {
        let alive = true;
        setLoading(true);
        setLoadError(null);
        fetchAdminFeedback(filters, page, PAGE_SIZE)
            .then((res) => {
                if (!alive) return;
                setEntries(res.entries);
                setTotal(res.total);
            })
            .catch(() => {
                if (alive) toast.error("Could not load feedbacks.")
            })
            .finally(() => {
                if (alive) setLoading(false);
            });
        return () => {
            alive = false;
        };
    }, [filters, page]);

    async function handleOpen(id: string): Promise<AdminFeedbackEntry> {
        const detail = await fetchAdminFeedbackDetail(id);

        // Mark as read in the background. We optimistically flip the row's
        // isRead state in the list so the UI reflects the change immediately.
        const wasRead = entries.find((e) => e.id === id)?.isRead;
        if (!wasRead) {
            setEntries((list) =>
                list.map((e) => (e.id === id ? { ...e, isRead: true } : e)),
            );
            markFeedbackRead(id).catch(() => {
                // Revert if the call fails.
                setEntries((list) =>
                    list.map((e) => (e.id === id ? { ...e, isRead: false } : e)),
                );
            });
        }

        return detail;
    }

    async function handleUpdateStatus(
        id: string,
        status: AdminFeedbackStatus,
        notes: string,
    ): Promise<void> {
        try {
            const updated = await updateFeedbackStatus(id, status, notes);
            setEntries((list) =>
                list.map((e) =>
                    e.id === id
                        ? {
                            ...e,
                            status: updated.status,
                            adminInternalNotes: updated.adminInternalNotes,
                        }
                        : e,
                ),
            );
        } catch {
            toast.error("Could not update the feedback. Please try again.");
            throw new Error("save failed");
        }
    }

    return (
        <>
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-brand-red sm:text-4xl">
                    Feedback
                </h1>
                <p className="mt-3 max-w-prose text-brand-ink">
                    Patient feedback submitted through the portal. Walk each item
                    through the workflow as your team reviews and responds.
                </p>
            </div>

            <FeedbackFilters filters={filters} onChange={setFilters} />

            {loadError && (
                <p className={'mb-4 text-sm text-brand-red'}>
                    {loadError}
                </p>
            )}

            <FeedbackTable
                entries={entries}
                loading={loading}
                onOpen={handleOpen}
                onUpdateStatus={handleUpdateStatus}
            />

            <Pagination
                page={page}
                total={total}
                pageSize={PAGE_SIZE}
                onChange={setPage}
            />
        </>
    );
}