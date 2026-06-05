import type { LabResult, LabResultStatus } from "../../data/portal";

type Props = {
    results: ReadonlyArray<LabResult>;
    loading: boolean;
    onView: (id: string) => void;
    onDownload: (id: string) => void;
};

const STATUS_TONE: Record<LabResultStatus, string> = {
    "Ready to view": "text-brand-green",
    Pending: "text-brand-red",
};

const STATUS_LABEL: Record<LabResultStatus, string> = {
    "Ready to view": "Ready",
    Pending: "Pending",
};

export default function AllResultsTable({ results, loading, onView, onDownload }: Props) {
    return (
        <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-brand-ink">All Results</h2>

            {loading ? (
                <p className="text-sm text-neutral-500">Loading…</p>
            ) : results.length === 0 ? (
                <p className="text-sm text-neutral-500">No lab results yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] border-collapse">
                        <thead>
                        <tr className="text-left text-sm font-semibold text-brand-ink">
                            <th className="pb-4 pr-6">Date</th>
                            <th className="pb-4 pr-6">Test</th>
                            <th className="pb-4 pr-6">Status</th>
                            <th className="pb-4">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {results.map((r) => (
                            <tr key={r.id} className="align-top text-sm">
                                <td className="py-3 pr-6 font-semibold text-brand-ink">
                                    {r.date}
                                </td>
                                <td className="py-3 pr-6 font-semibold text-brand-ink">
                                    {r.test}
                                </td>
                                <td className={`py-3 pr-6 italic ${STATUS_TONE[r.status]}`}>
                                    {STATUS_LABEL[r.status]}
                                </td>
                                <td className="py-3">
                                    <div className="flex flex-col gap-1">
                                        <button
                                            type="button"
                                            onClick={() => onView(r.id)}
                                            disabled={r.status !== "Ready to view"}
                                            className="text-left text-sm text-brand-ink cursor-pointer underline underline-offset-2 hover:no-underline disabled:cursor-not-allowed disabled:text-neutral-400 disabled:no-underline"
                                        >
                                            View
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDownload(r.id)}
                                            disabled={r.status !== "Ready to view"}
                                            className="text-left text-sm text-brand-ink cursor-pointer underline underline-offset-2 hover:no-underline disabled:cursor-not-allowed disabled:text-neutral-400 disabled:no-underline"
                                        >
                                            Download PDF
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}