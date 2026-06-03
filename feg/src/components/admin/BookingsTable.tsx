import { useNavigate } from "react-router-dom";
import BookingStatusPill from "./BookingStatusPill";
import type { AdminBookingSummary } from "../../data/admin";

type Props = {
    bookings: AdminBookingSummary[];
    loading: boolean;
};

export default function BookingsTable({ bookings, loading }: Props) {
    const navigate = useNavigate();

    if (loading) {
        return <p className="text-sm text-neutral-500">Loading…</p>;
    }
    if (bookings.length === 0) {
        return (
            <p className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
                No bookings match the current filters.
            </p>
        );
    }

    return (
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
            <table className="w-full min-w-[800px] border-collapse">
                <thead className="bg-neutral-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Patient</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Preferred</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Booked</th>
                </tr>
                </thead>
                <tbody>
                {bookings.map((b) => (
                    <tr
                        key={b.id}
                        onClick={() => navigate(`/admin/bookings/${b.id}`)}
                        className="cursor-pointer border-t border-neutral-100 text-sm hover:bg-neutral-50"
                    >
                        <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                            #{b.shortId}
                        </td>
                        <td className="px-4 py-3 font-semibold text-brand-ink">
                            {b.patientName}
                        </td>
                        <td className="px-4 py-3 text-brand-ink">{b.department}</td>
                        <td className="px-4 py-3 text-brand-ink">{b.type}</td>
                        <td className="px-4 py-3 text-brand-ink">
                            {b.preferredDate}, {b.preferredTime}
                        </td>
                        <td className="px-4 py-3">
                            <BookingStatusPill status={b.status} />
                        </td>
                        <td className="px-4 py-3 text-xs text-neutral-500">
                            {b.createdAtDisplay}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}