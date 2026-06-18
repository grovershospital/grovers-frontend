import {useNavigate} from "react-router-dom";
import BookingStatusPill from "./BookingStatusPill";
import {Skeleton} from "../../ui/Skeleton";
import type {AdminBookingSummary} from "../../data/admin";

type Status = "loading" | "error" | "ready";

type Props = {
    bookings: AdminBookingSummary[];
    status: Status;
    onRetry?: () => void;
};

export default function BookingsTable({bookings, status, onRetry}: Props) {
    const navigate = useNavigate();

    if (status === "loading") {
        return <BookingsTableSkeleton/>;
    }

    if (status === "error") {
        return (
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center">
                <p className="text-sm text-brand-ink">Couldn't load bookings.</p>
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
        );
    }

    if (bookings.length === 0) {
        return (
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
                No bookings match the current filters.
            </div>
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
                            {b.preferredDate}
                        </td>
                        <td className="px-4 py-3">
                            <BookingStatusPill status={b.status}/>
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

// Skeleton lives inside the same rounded-2xl border wrapper as the real
// table — frame stays identical during loading so there's no jump on swap-in.
function BookingsTableSkeleton() {
    const rows = 5;
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
                {Array.from({length: rows}).map((_, i) => (
                    <tr key={i} className="border-t border-neutral-100 text-sm">
                        <td className="px-4 py-3">
                            <Skeleton className="h-4 w-16"/>
                        </td>
                        <td className="px-4 py-3">
                            <Skeleton className="h-4 w-36"/>
                        </td>
                        <td className="px-4 py-3">
                            <Skeleton className="h-4 w-28"/>
                        </td>
                        <td className="px-4 py-3">
                            <Skeleton className="h-4 w-20"/>
                        </td>
                        <td className="px-4 py-3">
                            <Skeleton className="h-4 w-24"/>
                        </td>
                        <td className="px-4 py-3">
                            <Skeleton className="h-6 w-20 rounded-full"/>
                        </td>
                        <td className="px-4 py-3">
                            <Skeleton className="h-4 w-24"/>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}