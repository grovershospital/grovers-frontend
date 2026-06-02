import { Link } from "react-router-dom";
import type { LabResultDetail, LabResultFlag } from "../../data/portal";

type Props = {
    detail: LabResultDetail | null;
    loading: boolean;
    onDownload: () => void;
};

const FLAG_DISPLAY: Record<LabResultFlag, string> = {
    Normal: "Normal",
    High: "High ↑",
    Low: "Low ↓",
};

export default function ResultDetails({ detail, loading, onDownload }: Props) {
    return (
        <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-brand-ink">Result Details</h2>

            {loading || !detail ? (
                <p className="text-sm text-neutral-500">Loading…</p>
            ) : (
                <>
                    <div className="mb-6 text-sm text-brand-ink">
                        <p>
                            <span className="font-bold">Test: </span>
                            {detail.test}
                        </p>
                        <p>
                            <span className="font-bold">Date: </span>
                            {detail.dateFull}
                        </p>
                    </div>

                    <div className="mb-8 overflow-x-auto">
                        <table className="w-full min-w-[560px] border-collapse">
                            <thead>
                            <tr className="text-left text-sm font-semibold text-brand-ink">
                                <th className="pb-4 pr-6">Test Component</th>
                                <th className="pb-4 pr-6">Your Result</th>
                                <th className="pb-4 pr-6">Reference Range</th>
                                <th className="pb-4">Flag</th>
                            </tr>
                            </thead>
                            <tbody>
                            {detail.components.map((c, i) => (
                                <tr key={i} className="align-top text-sm">
                                    <td className="py-3 pr-6 text-brand-ink">{c.name}</td>
                                    <td className="py-3 pr-6 text-brand-ink">
                                        {c.value} {c.unit}
                                    </td>
                                    <td className="py-3 pr-6 text-brand-ink">
                                        {c.referenceRange}
                                    </td>
                                    <td className="py-3 text-brand-ink">
                                        {FLAG_DISPLAY[c.flag]}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mb-6 text-sm text-brand-ink">
                        <p className="font-bold">Important notice:</p>
                        <p className="mt-2 max-w-prose">
                            These results are provided for your personal reference. Please do not
                            self-diagnose or adjust any medication or treatment based on these
                            results without first consulting your doctor. If you have any questions
                            about your results, book a consultation with your doctor through the
                            Appointments section.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Link
                            to="/patient-portal/appointments"
                            className="inline-flex items-center justify-center rounded-full bg-brand-red px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                        >
                            Book Consultation
                        </Link>
                        <button
                            type="button"
                            onClick={onDownload}
                            className="inline-flex items-center justify-center rounded-full cursor-pointer bg-brand-ink px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink"
                        >
                            Download PDF
                        </button>
                    </div>
                </>
            )}
        </section>
    );
}