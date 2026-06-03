import { useEffect, useState } from "react";
import AdminStatCards from "../../components/admin/AdminStatCards";
import RecentAppointmentsCard from "../../components/admin/RecentAppointmentsCard";
import RecentFeedbackCard from "../../components/admin/RecentFeedbackCard";
import {
    fetchAdminDashboardSummary,
    fetchRecentAdminAppointments,
    fetchRecentAdminFeedback,
    type AdminAppointmentSummary,
    type AdminDashboardSummary,
    type AdminFeedbackSummary,
} from "../../data/admin";

export default function AdminDashboard() {
    const [summary, setSummary] = useState<AdminDashboardSummary | null>(null);
    const [appointments, setAppointments] = useState<AdminAppointmentSummary[] | null>(null);
    const [feedback, setFeedback] = useState<AdminFeedbackSummary[] | null>(null);

    useEffect(() => {
        let alive = true;

        fetchAdminDashboardSummary().then((data) => {
            if (alive) setSummary(data);
        });
        fetchRecentAdminAppointments().then((data) => {
            if (alive) setAppointments(data);
        });
        fetchRecentAdminFeedback().then((data) => {
            if (alive) setFeedback(data);
        });

        return () => {
            alive = false;
        };
    }, []);

    return (
        <>
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-brand-red sm:text-4xl">Dashboard</h1>
                <p className="mt-3 max-w-prose text-brand-ink">
                    Quick overview of what needs your attention across the hospital.
                </p>
            </div>

            <div className="mb-10">
                <AdminStatCards summary={summary} />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <RecentAppointmentsCard appointments={appointments} />
                <RecentFeedbackCard feedback={feedback} />
            </div>
        </>
    );
}