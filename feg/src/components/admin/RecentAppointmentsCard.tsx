import { Link } from "react-router-dom";
import type {
    AdminAppointmentStatus,
    AdminAppointmentSummary,
} from "../../data/admin";

type Props = {
    appointments: AdminAppointmentSummary[] | null;
};

const STATUS_TONE: Record<AdminAppointmentStatus, string> = {
    Pending: "text-brand-red",
    Confirmed: "text-brand-green",
    Cancelled: "text-brand-red",
    Completed: "text-brand-green",
};

export default function RecentAppointmentsCard({ appointments }: Props) {
    return (
        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-brand-ink">Recent Appointments</h2>
                <Link
                    to="/admin/bookings"
                    className="text-sm text-brand-red underline underline-offset-2 hover:no-underline"
                >
                    View all
                </Link>
            </div>

            {!appointments ? (
                <p className="text-sm text-neutral-500">Loading…</p>
            ) : appointments.length === 0 ? (
                <p className="text-sm text-neutral-500">No recent appointments.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[480px] border-collapse">
                        <thead>
                        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            <th className="pb-3 pr-4">Patient</th>
                            <th className="pb-3 pr-4">Department</th>
                            <th className="pb-3 pr-4">Date</th>
                            <th className="pb-3">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {appointments.map((a) => (
                            <tr key={a.id} className="border-t border-neutral-100 text-sm">
                                <td className="py-3 pr-4 font-semibold text-brand-ink">
                                    {a.patientName}
                                </td>
                                <td className="py-3 pr-4 text-brand-ink">{a.department}</td>
                                <td className="py-3 pr-4 text-brand-ink">
                                    {a.date}, {a.time}
                                </td>
                                <td className={`py-3 italic ${STATUS_TONE[a.status]}`}>
                                    {a.status}
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