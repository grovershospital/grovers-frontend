import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import LabResultStatusPill from "../../../components/admin/LabResultStatusPill";
import LabResultUploadModal from "../../../components/admin/LabResultUploadModal";
import LabResultDetailModal from "../../../components/admin/LabResultDetailModal";
import { useAdminPatient } from "../../../contexts/AdminPatientContext";
import {
    deleteAdminLabResult,
    fetchAdminLabResults,
    type AdminLabResultStatus,
    type AdminLabResultSummary,
} from "../../../data/admin";

export default function LabResultsTab() {
    const patient = useAdminPatient();

    const [results, setResults] = useState<AdminLabResultSummary[]>([]);
    const [loading, setLoading] = useState(true);

    const [uploadOpen, setUploadOpen] = useState(false);
    const [detailResultId, setDetailResultId] = useState<string | null>(null);

    function loadResults() {
        let alive = true;
        setLoading(true);
        fetchAdminLabResults(patient.id)
            .then((data) => {
                if (alive) setResults(data);
            })
            .finally(() => {
                if (alive) setLoading(false);
            });
        return () => {
            alive = false;
        };
    }

    useEffect(() => {
        return loadResults();
    }, [patient.id]);

    function handleCreated(resultId: string) {
        // Refresh list + jump straight into the detail modal for the new result.
        loadResults();
        setDetailResultId(resultId);
    }

    function handleStatusChanged(resultId: string, newStatus: AdminLabResultStatus) {
        setResults((list) =>
            list.map((r) => (r.id === resultId ? { ...r, status: newStatus } : r)),
        );
    }

    async function handleDelete(result: AdminLabResultSummary) {
        if (!window.confirm(`Delete "${result.title}" and all its components?`)) return;
        const prev = results;
        setResults((list) => list.filter((r) => r.id !== result.id));
        try {
            await deleteAdminLabResult(result.id);
        } catch {
            setResults(prev);
            window.alert("Could not delete the result. Please try again.");
        }
    }

    return (
        <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-brand-ink">Lab Results</h2>
                    <p className="mt-1 text-sm text-neutral-500">
                        Internal lab results with structured components and attached files.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setUploadOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                    Upload result
                </button>
            </div>

            {loading ? (
                <p className="text-sm text-neutral-500">Loading…</p>
            ) : results.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
                    No lab results uploaded yet.
                </p>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
                    <table className="w-full min-w-[800px] border-collapse">
                        <thead className="bg-neutral-50">
                        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Uploaded</th>
                            <th className="px-4 py-3">Files</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3" />
                        </tr>
                        </thead>
                        <tbody>
                        {results.map((r) => (
                            <tr
                                key={r.id}
                                onClick={() => setDetailResultId(r.id)}
                                className="cursor-pointer border-t border-neutral-100 text-sm hover:bg-neutral-50"
                            >
                                <td className="px-4 py-3 font-semibold text-brand-ink">
                                    {r.title}
                                </td>
                                <td className="px-4 py-3 text-brand-ink">
                                    {r.testDate || "—"}
                                </td>
                                <td className="px-4 py-3 text-brand-ink">
                                    {r.fileCount}
                                </td>
                                <td className="px-4 py-3">
                                    <LabResultStatusPill status={r.status} />
                                </td>
                                <td className="px-4 py-3">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(r);
                                        }}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-brand-red/10 hover:text-brand-red"
                                        aria-label={`Delete ${r.title}`}
                                    >
                                        <Trash2 className="h-4 w-4" strokeWidth={2} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            <LabResultUploadModal
                open={uploadOpen}
                onClose={() => {
                    setUploadOpen(false);
                }}
                patientId={patient.id}
                onCreated={handleCreated}
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