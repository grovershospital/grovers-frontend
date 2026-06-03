import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FeedbackFilters from "../../components/admin/FeedbackFilters";
import FeedbackTable from "../../components/admin/FeedbackTable";
import Pagination from "../../components/admin/Pagination";
import {
    fetchAdminFeedback,
    markFeedbackActioned,
    type AdminFeedbackEntry,
    type AdminFeedbackFilters,
} from "../../data/admin";

const PAGE_SIZE = 10;

export default function AdminFeedback() {
    const [searchParams] = useSearchParams();

    // Read initial filter from query string (?status=new from dashboard stat card).
    // We only honor the status param on first render — after that filters live in state.
    const initialStatus = searchParams.get("status");
    const [filters, setFilters] = useState<AdminFeedbackFilters>(() => ({
        type: "all",
        status: initialStatus === "new" ? "New" : "all",
        contactMethod: "all",
        search: "",
    }));

    const [page, setPage] = useState(1);
    const [entries, setEntries] = useState<AdminFeedbackEntry[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    // Reset to page 1 whenever filters change so we don't end up on an
    // out-of-range page.
    useEffect(() => {
        setPage(1);
    }, [filters]);

    useEffect(() => {
        let alive = true;
        setLoading(true);
        fetchAdminFeedback(filters, page, PAGE_SIZE)
            .then((res) => {
                if (!alive) return;
                setEntries(res.entries);
                setTotal(res.total);
            })
            .finally(() => {
                if (alive) setLoading(false);
            });
        return () => {
            alive = false;
        };
    }, [filters, page]);

    async function handleMarkActioned(id: string) {
        // Optimistic update — flip status locally, revert on failure.
        const prev = entries;
        setEntries((list) =>
            list.map((f) => (f.id === id ? { ...f, status: "Actioned" } : f)),
        );
        try {
            await markFeedbackActioned(id);
        } catch {
            setEntries(prev);
            window.alert("Could not mark this feedback as actioned. Please try again.");
        }
    }

    return (
        <>
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-brand-red sm:text-4xl">Feedback</h1>
                <p className="mt-3 max-w-prose text-brand-ink">
                    Read patient feedback, see who requested a response and mark items as
                    actioned once your team has followed up.
                </p>
            </div>

            <FeedbackFilters filters={filters} onChange={setFilters} />

            <FeedbackTable
                entries={entries}
                loading={loading}
                onMarkActioned={handleMarkActioned}
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