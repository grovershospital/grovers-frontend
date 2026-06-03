import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import LabResultStatusPill from "../../components/admin/LabResultStatusPill";
import LabResultDetailModal from "../../components/admin/LabResultDetailModal";
import Pagination from "../../components/admin/Pagination";
import {
    fetchCrossPatientLabResults,
    type AdminCrossPatientLabResult,
    type AdminLabResultStatus,
    type CrossPatientLabFilters,
} from "../../data/admin";

const PAGE_SIZE = 10;

const STATUS_OPTIONS: ReadonlyArray<AdminLabResultStatus> = [
    "Pending",
    "Ready to view",
];

export default function AdminLabResults() {
    const [searchParams] = useSearchParams();
    const initialStatus = searchParams.get("status");

    const [filters, setFilters] = useState<CrossPatientLabFilters>(() => ({
        search: "",
        status: initialStatus === "pending" ? "Pending" : "all",
    }));
    const [page, setPage] = useState(1);
    const [results, setResults] = useState<AdminCrossPatientLabResult[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const [detailResultId, setDetailResultId] = useState<string | null>(null);

    useEffect(() => {
        setPage(1);
    }, [filters]);

    useEffect(() => {
        let alive = true;
        setLoading(true);
        fetchCrossPatientLabResults(filters, page, PAGE_SIZE)
            .then((res) => {
                if (!alive) return;
                setResults(res.entries);
                setTotal(res.total);
            })
            .finally(() => {
                if (alive) setLoading(false);
            });
        return () => {
            alive = false;
        };
    }, [filters, page]);

    function handleStatusChanged(
        resultId: string,
        newStatus: AdminLabResultStatus,
    ) {
        setResults((list) =>
            list.map((r) => (r.id === resultId ? { ...r, status: newStatus } : r)),
        );
    }

    function update<K extends keyof CrossPatientLabFilters>(
        key: K,
        value: CrossPatientLabFilters[K],
    ) {
        setFilters((f) => ({ ...f, [key]: value }));
    }

    return (
        <>
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-brand-red sm:text-4xl">
                    Lab Results
                </h1>
                <p className="mt-3 max-w-prose text-brand-ink">
                    All lab results across patients, sorted by most recently uploaded.
                    Use this view to triage Pending results and mark them Ready once
                    components are entered.
                </p>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
                <div className="relative">
                    <Search
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                        strokeWidth={2}
                    />
                    <input
                        type="search"
                        placeholder="Search by patient name…"
                        value={filters.search ?? ""}
                        onChange={(e) => update("search", e.target.value)}
                        className="w-full rounded-full border border-neutral-300 bg-white py-2 pl-10 pr-4 text-sm text-brand-ink placeholder:text-neutral-400 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                </div>

                <select
                    value={filters.status ?? "all"}
                    onChange={(e) =>
                        update(
                            "status",
                            e.target.value as AdminLabResultStatus | "all",
                        )
                    }
                    className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                >
                    <option value="all">All statuses</option>
                    {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <p className="text-sm text-neutral-500">Loading…</p>
            ) : results.length === 0 ? (
                <p className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
                    No lab results match the current filters.
                </p>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
                    <table className="w-full min-w-[900px] border-collapse">
                        <thead className="bg-neutral-50">
                        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            <th className="px-4 py-3">Uploaded</th>
                            <th className="px-4 py-3">Patient</th>
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Components</th>
                            <th className="px-4 py-3">Files</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {results.map((r) => (
                            <tr
                                key={r.id}
                                onClick={() => setDetailResultId(r.id)}
                                className="cursor-pointer border-t border-neutral-100 text-sm hover:bg-neutral-50"
                            >
                                <td className="px-4 py-3 text-xs text-neutral-500">
                                    {r.uploadedAtDisplay}
                                </td>
                                <td className="px-4 py-3">
                                    <p className="font-semibold text-brand-ink">
                                        {r.patientName}
                                    </p>
                                    <Link
                                        to={`/admin/patients/${r.patientId}/lab-results`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-xs text-brand-red underline underline-offset-2 hover:no-underline"
                                    >
                                        View all results →
                                    </Link>
                                </td>
                                <td className="px-4 py-3 text-brand-ink">
                                    {r.title}
                                </td>
                                <td className="px-4 py-3 text-brand-ink">
                                    {r.componentCount}
                                </td>
                                <td className="px-4 py-3 text-brand-ink">
                                    {r.fileCount}
                                </td>
                                <td className="px-4 py-3">
                                    <LabResultStatusPill status={r.status} />
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

            <LabResultDetailModal
                open={detailResultId !== null}
                onClose={() => setDetailResultId(null)}
                resultId={detailResultId}
                onStatusChanged={handleStatusChanged}
            />
        </>
    );
}