import {Skeleton} from "../../ui/Skeleton";
import type {LabResult, LabResultStatus} from "../../data/portal";

type Status = "loading" | "error" | "ready";

type Props = {
    results: ReadonlyArray<LabResult>;
    status: Status;
    onView: (id: string) => void;
    onDownload: (id: string) => void;
    onRetry?: () => void;
};

const STATUS_TONE: Record<LabResultStatus, string> = {
    "Ready to view": "text-brand-green",
    Pending: "text-brand-red",
};

const STATUS_LABEL: Record<LabResultStatus, string> = {
    "Ready to view": "Ready",
    Pending: "Pending",
};

export default function AllResultsTable({results, status, onView, onDownload, onRetry}: Props) {
    return (
        <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-brand-ink">All Results</h2>

            {status === "loading" && <AllResultsTableSkeleton/>}

            {status === "error" && (
                <div className="rounded-lg border border-dashed border-neutral-300 py-8 text-center">
                    <p className="text-sm text-brand-ink">Couldn't load lab results.</p>
                    {onRetry && (
                        <button
                            type="button"
                            onClick={onRetry}
                            className="mt-3 text-sm text-brand-ink underline underline-offset-2 hover:no-underline"
                        >
                            Try again
                        </button>
                    )}
                </div>
            )}

            {status === "ready" && results.length === 0 && (
                <div className="rounded-lg border border-dashed border-neutral-300 py-12 text-center">
                    <p className="text-sm text-brand-ink/70">No lab results yet.</p>
                </div>
            )}

            {status === "ready" && results.length > 0 && (
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

function AllResultsTableSkeleton() {
    const rows = 4;
    return (
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
                {Array.from({length: rows}).map((_, i) => (
                    <tr key={i} className="align-top text-sm">
                        <td className="py-3 pr-6">
                            <Skeleton className="h-4 w-24"/>
                        </td>
                        <td className="py-3 pr-6">
                            <Skeleton className="h-4 w-40"/>
                        </td>
                        <td className="py-3 pr-6">
                            <Skeleton className="h-4 w-20"/>
                        </td>
                        <td className="py-3">
                            <div className="flex flex-col gap-1">
                                <Skeleton className="h-4 w-14"/>
                                <Skeleton className="h-4 w-24"/>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}