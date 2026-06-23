import type {AdminBookingDetail} from "../../data/admin";

type Props = {
    booking: AdminBookingDetail;
};

function formatTime(t: string): string {
    const [hStr, mStr] = t.split(":");
    let h = parseInt(hStr, 10);
    const suffix = h >= 12 ? "PM" : "AM";
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    return `${h}:${mStr} ${suffix}`;
}

export default function BookingDetailsCard({booking}: Props) {
    return (
        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-base font-bold text-brand-ink">Appointment Details</h2>

            <dl className="grid grid-cols-1 gap-y-3 text-sm sm:grid-cols-[max-content_1fr] sm:gap-x-6">
                <Row label="Department" value={booking.department}/>
                <Row label="Type" value={booking.type}/>
                <Row label="Preferred date" value={booking.preferredDate}/>
                {booking.appointmentTime && (
                    <Row
                        label="Confirmed time"
                        value={formatTime(booking.appointmentTime)}
                        highlight
                    />
                )}
                <Row label="Booked" value={booking.createdAtDisplay}/>
                {booking.patientNotes && (
                    <Row label="Patient notes" value={booking.patientNotes}/>
                )}
            </dl>
        </section>
    );
}

function Row({label, value, highlight}: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className="contents">
            <dt className="font-semibold text-neutral-500">{label}</dt>
            <dd className={highlight ? "font-semibold text-brand-green" : "text-brand-ink"}>
                {value}
            </dd>
        </div>
    );
}