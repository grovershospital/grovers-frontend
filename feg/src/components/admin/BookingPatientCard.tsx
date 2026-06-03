import { Link } from "react-router-dom";
import { Mail, Phone, User } from "lucide-react";
import type { AdminBookingDetail } from "../../data/admin";

type Props = {
    booking: AdminBookingDetail;
};

export default function BookingPatientCard({ booking }: Props) {
    return (
        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold text-brand-ink">Patient</h2>
                <Link
                    to={`/admin/patients/${booking.patientId}`}
                    className="text-xs text-brand-red underline underline-offset-2 hover:no-underline"
                >
                    View full record →
                </Link>
            </div>

            <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-neutral-400" strokeWidth={2} />
                    <span className="font-semibold text-brand-ink">{booking.patientName}</span>
                </div>

                <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-neutral-400" strokeWidth={2} />
                    <a
                        href={`mailto:${booking.patientEmail}`}
                        className="text-brand-ink underline underline-offset-2 hover:no-underline"
                    >
                        {booking.patientEmail}
                    </a>
                </div>

                <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-neutral-400" strokeWidth={2} />
                    <a
                        href={`tel:${booking.patientPhone}`}
                        className="text-brand-ink underline underline-offset-2 hover:no-underline"
                    >
                        {booking.patientPhone}
                    </a>
                </div>
            </div>
        </section>
    );
}