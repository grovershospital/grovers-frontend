import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    fetchPortalUser,
    fetchUpcomingAppointments,
    fetchRecentLabResults,
    type Appointment,
    type AppointmentStatus,
    type LabResult,
    type LabResultStatus,
    type PortalUser,
} from "../data/portal";

// Status color lookups — listed as full class strings so Tailwind's JIT
// picks them up. Interpolating like `text-${tone}-...` would fail.
const APPT_STATUS_COLOR: Record<AppointmentStatus, string> = {
    Confirmed: "text-brand-green",
    Pending: "text-brand-red",
    Cancelled: "text-brand-red",
};

const LAB_STATUS_COLOR: Record<LabResultStatus, string> = {
    "Ready to view": "text-brand-green",
    Pending: "text-brand-red",
};

// ─── Quick action cards ─────────────────────────────────────

type QuickAction = {
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
    // Button color — kept as class strings rather than tone names so all
    // possible classes are statically visible to Tailwind.
    ctaColor: string;
};

const QUICK_ACTIONS: QuickAction[] = [
    {
        title: "Appointments",
        description: "View upcoming and past appointments or book a new one.",
        ctaLabel: "Manage Appointments",
        ctaHref: "/patient-portal/appointments",
        ctaColor: "bg-brand-green hover:bg-brand-green/85",
    },
    {
        title: "Lab Results",
        description: "View and download your latest laboratory results.",
        ctaLabel: "View Results",
        ctaHref: "/patient-portal/lab-results",
        ctaColor: "bg-brand-red hover:bg-brand-red/85",
    },
    {
        title: "Feedback",
        description: "Share your experience with our team.",
        ctaLabel: "Give Feedback",
        ctaHref: "/patient-portal/feedback",
        ctaColor: "bg-brand-blue hover:bg-brand-blue/85",
    },
    {
        title: "My Profile",
        description:
            "Manage your personal information, contact details and account settings.",
        ctaLabel: "View Profile",
        ctaHref: "/patient-portal/profile",
        ctaColor: "bg-brand-ink hover:bg-brand-ink/85",
    },
];

export default function Dashboard() {
    const [user, setUser] = useState<PortalUser | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [labResults, setLabResults] = useState<LabResult[]>([]);

    useEffect(() => {
        let cancelled = false;
        Promise.all([
            fetchPortalUser(),
            fetchUpcomingAppointments(),
            fetchRecentLabResults(),
        ])
            .then(([u, a, l]) => {
                if (cancelled) return;
                setUser(u);
                setAppointments(a);
                setLabResults(l);
            })
            .catch((err) =>
                console.error("Failed to load dashboard data", err),
            );
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="space-y-12">
            {/* Welcome */}
            <section>
                <h1 className="text-3xl font-extrabold text-brand-red sm:text-4xl">
                    Hi {user ? user.firstName : "..."}!
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-brand-ink sm:text-base">
                    Welcome to your Grover's Hospital patient dashboard. Here you can
                    manage your appointments, view your lab results, access your medical
                    history and share your feedback with our team.
                </p>
            </section>

            {/* Quick action cards — 2x2 grid on sm+, single column on mobile */}
            <section
                aria-label="Quick actions"
                className="grid gap-5 sm:grid-cols-2 sm:gap-6"
            >
                {QUICK_ACTIONS.map((action) => (
                    <div
                        key={action.title}
                        className="flex flex-col rounded-2xl border-2 border-black bg-white p-6 sm:p-8"
                    >
                        <h2 className="text-lg font-extrabold text-brand-ink">
                            {action.title}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-brand-ink/80">
                            {action.description}
                        </p>
                        <div className="mt-6">
                            <Link
                                to={action.ctaHref}
                                className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink ${action.ctaColor}`}
                            >
                                {action.ctaLabel}
                            </Link>
                        </div>
                    </div>
                ))}
            </section>

            {/* Upcoming Appointments */}
            <section aria-labelledby="upcoming-appointments-heading">
                <h2
                    id="upcoming-appointments-heading"
                    className="text-2xl font-extrabold text-brand-ink sm:text-3xl"
                >
                    Upcoming Appointments
                </h2>

                <div className="mt-6 overflow-x-auto">
                    <table className="w-full min-w-[480px] border-collapse text-sm">
                        <thead>
                        <tr className="text-left">
                            <th className="py-3 pr-4 font-extrabold text-brand-ink">
                                Date
                            </th>
                            <th className="py-3 pr-4 font-extrabold text-brand-ink">
                                Time
                            </th>
                            <th className="py-3 pr-4 font-extrabold text-brand-ink">
                                Department
                            </th>
                            <th className="py-3 pr-4 font-extrabold text-brand-ink">
                                Status
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {appointments.map((appt) => (
                            <tr key={appt.id} className="border-t border-neutral-200">
                                <td className="py-4 pr-4 font-bold text-brand-ink">
                                    {appt.date}
                                </td>
                                <td className="py-4 pr-4 text-brand-ink">{appt.time}</td>
                                <td className="py-4 pr-4 font-bold text-brand-ink">
                                    {appt.department}
                                </td>
                                <td
                                    className={`py-4 pr-4 italic ${APPT_STATUS_COLOR[appt.status]}`}
                                >
                                    {appt.status}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                    <Link
                        to="/patient-portal/appointments"
                        className="inline-flex items-center justify-center rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-red/85"
                    >
                        View All Appointments
                    </Link>
                    <Link
                        to="/patient-portal/appointments/new"
                        className="inline-flex items-center justify-center rounded-full bg-brand-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-ink/85"
                    >
                        Book New Appointment
                    </Link>
                </div>
            </section>

            {/* Recent Lab Results */}
            <section aria-labelledby="recent-lab-results-heading">
                <h2
                    id="recent-lab-results-heading"
                    className="text-2xl font-extrabold text-brand-ink sm:text-3xl"
                >
                    Recent Lab Results
                </h2>

                <div className="mt-6 overflow-x-auto">
                    <table className="w-full min-w-[480px] border-collapse text-sm">
                        <thead>
                        <tr className="text-left">
                            <th className="py-3 pr-4 font-extrabold text-brand-ink">
                                Date
                            </th>
                            <th className="py-3 pr-4 font-extrabold text-brand-ink">
                                Test
                            </th>
                            <th className="py-3 pr-4 font-extrabold text-brand-ink">
                                Status
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {labResults.map((lab) => (
                            <tr key={lab.id} className="border-t border-neutral-200">
                                <td className="py-4 pr-4 font-bold text-brand-ink">
                                    {lab.date}
                                </td>
                                <td className="py-4 pr-4 font-bold text-brand-ink">
                                    {lab.test}
                                </td>
                                <td
                                    className={`py-4 pr-4 italic ${LAB_STATUS_COLOR[lab.status]}`}
                                >
                                    {lab.status}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8">
                    <Link
                        to="/patient-portal/lab-results"
                        className="inline-flex items-center justify-center rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-red/85"
                    >
                        View All Results
                    </Link>
                </div>
            </section>
        </div>
    );
}