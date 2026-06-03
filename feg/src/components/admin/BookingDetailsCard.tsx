import type { AdminBookingDetail } from "../../data/admin";

type Props = {
    booking: AdminBookingDetail;
};

export default function BookingDetailsCard({ booking }: Props) {
    return (
        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-base font-bold text-brand-ink">Appointment Details</h2>

            <dl className="grid grid-cols-1 gap-y-3 text-sm sm:grid-cols-[max-content_1fr] sm:gap-x-6">
                <Row label="Department" value={booking.department} />
                <Row label="Type" value={booking.type} />
                <Row
                    label="Preferred slot"
                    value={`${booking.preferredDate} at ${booking.preferredTime}`}
                />
                <Row label="Booked" value={booking.createdAtDisplay} />
                {booking.reason && <Row label="Reason" value={booking.reason} />}
                {booking.additionalNotes && (
                    <Row label="Notes" value={booking.additionalNotes} />
                )}
            </dl>
        </section>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="contents">
            <dt className="font-semibold text-neutral-500">{label}</dt>
            <dd className="text-brand-ink">{value}</dd>
        </div>
    );
}