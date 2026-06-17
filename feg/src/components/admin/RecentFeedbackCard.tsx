import { Link } from "react-router-dom";
import type {
    AdminFeedbackStatus,
    AdminFeedbackSummary,
    AdminFeedbackType,
} from "../../data/admin";

type Props = {
    feedback: AdminFeedbackSummary[] | null;
};

const TYPE_TONE: Record<AdminFeedbackType, string> = {
    Compliment: "bg-brand-green/10 text-brand-green",
    Complaint: "bg-brand-red/10 text-brand-red",
    Suggestion: "bg-brand-blue/10 text-brand-blue",
    "General feedback": "bg-neutral-100 text-neutral-600",
};

const STATUS_TONE: Record<AdminFeedbackStatus, string> = {
    Pending: "text-brand-red font-semibold",
    "Under review": "text-brand-blue font-semibold",
    Reviewed: "text-neutral-500",
    "Response sent": "text-brand-green font-semibold",
};

export default function RecentFeedbackCard({ feedback }: Props) {
    return (
        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-brand-ink">Recent Feedback</h2>
                <Link
                    to="/admin/feedback"
                    className="text-sm text-brand-red underline underline-offset-2 hover:no-underline"
                >
                    View all
                </Link>
            </div>

            {!feedback ? (
                <p className="text-sm text-neutral-500">Loading…</p>
            ) : feedback.length === 0 ? (
                <p className="text-sm text-neutral-500">No recent feedback.</p>
            ) : (
                <ul className="space-y-4">
                    {feedback.map((f) => (
                        <li
                            key={f.id}
                            className="border-t border-neutral-100 pt-4 first:border-t-0 first:pt-0"
                        >
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span
                                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TYPE_TONE[f.type]}`}
                                >
                                    {f.type}
                                </span>
                                <span className="text-sm font-semibold text-brand-ink">
                                    {f.patientName}
                                </span>
                                <span className="text-xs text-neutral-500">· {f.createdAt}</span>
                                <span className={`ml-auto text-xs ${STATUS_TONE[f.status]}`}>
                                    {f.status}
                                </span>
                            </div>
                            <p className="text-sm text-brand-ink">{f.excerpt}</p>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}