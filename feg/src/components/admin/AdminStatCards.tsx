import { Calendar, FlaskConical, MessageSquare, FileText } from "lucide-react";
import StatCard from "./StatCard";
import type { AdminDashboardSummary } from "../../data/admin";

type Props = {
    summary: AdminDashboardSummary | null;
};

export default function AdminStatCards({ summary }: Props) {
    if (!summary) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-32 animate-pulse rounded-2xl border border-neutral-200 bg-white"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
                label="Pending Appointments"
                count={summary.pendingAppointments}
                to="/admin/appointments?status=pending"
                tone="red"
                icon={<Calendar className="h-8 w-8" strokeWidth={1.5} />}
            />
            <StatCard
                label="Pending Lab Results"
                count={summary.pendingLabResults}
                to="/admin/lab-results?status=pending"
                tone="green"
                icon={<FlaskConical className="h-8 w-8" strokeWidth={1.5} />}
            />
            <StatCard
                label="Unread Feedback"
                count={summary.unreadFeedback}
                to="/admin/feedback?status=new"
                tone="red"
                icon={<MessageSquare className="h-8 w-8" strokeWidth={1.5} />}
            />
            <StatCard
                label="Article Drafts"
                count={summary.articleDrafts}
                to="/admin/articles?status=draft"
                tone="blue"
                icon={<FileText className="h-8 w-8" strokeWidth={1.5} />}
            />
        </div>
    );
}