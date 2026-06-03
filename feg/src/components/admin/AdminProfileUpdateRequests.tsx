import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProfileUpdateStatusPill from "../../components/admin/ProfileUpdateStatusPill";
import ProfileUpdateDetailModal from "../../components/admin/ProfileUpdateDetailModal";
import Pagination from "../../components/admin/Pagination";
import {
    fetchProfileUpdateRequests,
    PROFILE_FIELD_LABEL,
    type ProfileUpdateFilters,
    type ProfileUpdateRequest,
    type ProfileUpdateStatus,
} from "../../data/admin";

const PAGE_SIZE = 10;

const STATUS_OPTIONS: ReadonlyArray<ProfileUpdateStatus> = [
    "Pending",
    "Approved",
    "Rejected",
];

export default function AdminProfileUpdateRequests() {
    const [searchParams] = useSearchParams();
    const initialStatus = searchParams.get("status");

    const [filters, setFilters] = useState<ProfileUpdateFilters>(() => {
        // Default to Pending — that's the actionable bucket. Override via ?status=all.
        if (initialStatus === "all") return { status: "all" };
        if (initialStatus === "approved") return { status: "Approved" };
        if (initialStatus === "rejected") return { status: "Rejected" };
        return { status: "Pending" };
    });

    const [page, setPage] = useState(1);
    const [requests, setRequests] = useState<ProfileUpdateRequest[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const [detailId, setDetailId] = useState<string | null>(null);

    useEffect(() => {
        setPage(1);
    }, [filters]);

    useEffect(() => {
        let alive = true;
        setLoading(true);
        fetchProfileUpdateRequests(filters, page, PAGE_SIZE)
            .then((res) => {
                if (!alive) return;
                setRequests(res.entries);
                setTotal(res.total);
            })
            .finally(() => {
                if (alive) setLoading(false);
            });
        return () => {
            alive = false;
        };
    }, [filters, page]);

    function handleDecided(updated: ProfileUpdateRequest) {
        // If we're filtering by Pending, the now-decided request drops out of
        // the list. Refresh from server to stay consistent with pagination.
        if (filters.status === "Pending") {
            setRequests((list) => list.filter((r) => r.id !== updated.id));
            setTotal((t) => Math.max(0, t - 1));
        } else {
            setRequests((list) =>
                list.map((r) => (r.id === updated.id ? updated : r)),
            );
        }
    }

    return (
        <>
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-brand-red sm:text-4xl">
                    Profile Update Requests
                </h1>
                <p className="mt-3 max-w-prose text-brand-ink">
                    Patients submit health profile changes here for review. Approve
                    applies the change to their record automatically; reject sends an
                    explanation back to the patient.
                </p>
            </div>

            <div className="mb-8">
                <select
                    value={filters.status ?? "Pending"}
                    onChange={(e) =>
                        setFilters({
                            status: e.target.value as ProfileUpdateStatus | "all",
                        })
                    }
                    className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                >
                    {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                    <option value="all">All</option>
                </select>
            </div>

            {loading ? (
                <p className="text-sm text-neutral-500">Loading…</p>
            ) : requests.length === 0 ? (
                <p className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
                    {filters.status === "Pending"
                        ? "No pending requests. Nice and tidy."
                        : "No requests match the current filter."}
                </p>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
                    <table className="w-full min-w-[800px] border-collapse">
                        <thead className="bg-neutral-50">
                        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            <th className="px-4 py-3">Submitted</th>
                            <th className="px-4 py-3">Patient</th>
                            <th className="px-4 py-3">Field</th>
                            <th className="px-4 py-3">Change</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {requests.map((r) => (
                            <tr
                                key={r.id}
                                onClick={() => setDetailId(r.id)}
                                className="cursor-pointer border-t border-neutral-100 text-sm hover:bg-neutral-50"
                            >
                                <td className="px-4 py-3 text-xs text-neutral-500">
                                    {r.submittedAtDisplay}
                                </td>
                                <td className="px-4 py-3 font-semibold text-brand-ink">
                                    {r.patientName}
                                </td>
                                <td className="px-4 py-3 text-brand-ink">
                                    {PROFILE_FIELD_LABEL[r.field]}
                                </td>
                                <td className="px-4 py-3 text-brand-ink">
                                    {r.field === "OTHER" ? (
                                        <span className="italic text-neutral-500">
                                                See request
                                            </span>
                                    ) : (
                                        <span className="line-clamp-1">
                                                {r.currentValue || "—"} →{" "}
                                            {r.proposedValue}
                                            </span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <ProfileUpdateStatusPill status={r.status} />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Pagination
                page={page}
                total={total}
                pageSize={PAGE_SIZE}
                onChange={setPage}
            />

            <ProfileUpdateDetailModal
                open={detailId !== null}
                onClose={() => setDetailId(null)}
                requestId={detailId}
                onDecided={handleDecided}
            />
        </>
    );
}