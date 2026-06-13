import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LabResultStatusPill from "../../components/admin/LabResultStatusPill";
import LabResultDetailModal from "../../components/admin/LabResultDetailModal";
import Pagination from "../../components/admin/Pagination";
import {
    fetchCrossPatientLabResults,
    type AdminCrossPatientLabResult,
    type AdminLabResultStatus,
} from "../../data/admin";
import {toast} from "sonner";

const PAGE_SIZE = 10;

export default function AdminLabResults() {
    const [page, setPage] = useState(1);
    const [results, setResults] = useState<AdminCrossPatientLabResult[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const [detailResultId, setDetailResultId] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;
        setLoading(true);
        fetchCrossPatientLabResults(page, PAGE_SIZE)
            .then((res) => {
                if (!alive) return;
                setResults(res.entries);
                setTotal(res.total);
            })
            .catch(() => {
                if (alive) toast.error("Could not fetch results.")
            })
            .finally(() => {
                if (alive) setLoading(false);
            });
        return () => {
            alive = false;
        };
    }, [page]);

    function handleStatusChanged(
        resultId: string,
        newStatus: AdminLabResultStatus,
    ) {
        setResults((list) =>
            list.map((r) => (r.id === resultId ? { ...r, status: newStatus } : r)),
        );
    }

    return (
        <>
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-brand-red sm:text-4xl">
                    Lab Results
                </h1>
                <p className="mt-3 max-w-prose text-brand-ink">
                    All lab results across patients, sorted by most recently uploaded.
                    Use this view to triage Pending results and notify patients once
                    they're ready.
                </p>
            </div>

            {loading ? (
                <p className="text-sm text-neutral-500">Loading…</p>
            ) : results.length === 0 ? (
                <p className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
                    No lab results uploaded yet.
                </p>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
                    <table className="w-full min-w-[800px] border-collapse">
                        <thead className="bg-neutral-50">
                        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            <th className="px-4 py-3">Uploaded</th>
                            <th className="px-4 py-3">Patient</th>
                            <th className="px-4 py-3">Title</th>
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