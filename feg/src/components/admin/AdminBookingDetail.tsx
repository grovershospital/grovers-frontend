import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import BookingStatusPill from "../../components/admin/BookingStatusPill";
import BookingPatientCard from "../../components/admin/BookingPatientCard";
import BookingDetailsCard from "../../components/admin/BookingDetailsCard";
import BookingNotesCard from "../../components/admin/BookingNotesCard";
import BookingActivityCard from "../../components/admin/BookingActivityCard";
import BookingStatusActions from "../../components/admin/BookingStatusActions";
import {
    fetchAdminBookingActivity,
    fetchAdminBookingDetail,
    updateBookingNotes,
    updateBookingStatus,
    type AdminBookingActivity,
    type AdminBookingDetail,
    type AdminBookingStatus,
} from "../../data/admin";

export default function AdminBookingDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [booking, setBooking] = useState<AdminBookingDetail | null>(null);
    const [activity, setActivity] = useState<AdminBookingActivity[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        let alive = true;

        fetchAdminBookingDetail(id)
            .then((data) => {
                if (alive) setBooking(data);
            })
            .catch(() => {
                if (alive) setError("Could not load this booking.");
            });

        fetchAdminBookingActivity(id).then((data) => {
            if (alive) setActivity(data);
        });

        return () => {
            alive = false;
        };
    }, [id]);

    async function handleStatusAction(newStatus: AdminBookingStatus, adminNotes: string) {
        if (!booking) return;
        try {
            const result = await updateBookingStatus(booking.id, {
                status: newStatus,
                adminNotes: adminNotes || undefined,
            });
            setBooking(result.booking);

            // Visits integration not wired yet — result.visitId is undefined.
            // Once it lands, COMPLETED flips will deep-link straight into the
            // visit edit form. Until then the admin reaches the new visit
            // stub via the patient's Visits tab.
            if (newStatus === "Completed" && result.visitId) {
                navigate(`/admin/visits/${result.visitId}/edit`);
            }
        } catch {
            window.alert("Could not update the booking status. Please try again.");
        }
    }

    async function handleSaveNotes(notes: string) {
        if (!booking) return;
        const updated = await updateBookingNotes(booking.id, notes);
        setBooking(updated);
    }

    if (error) {
        return (
            <>
                <BackLink />
                <p className="text-sm text-brand-red">{error}</p>
            </>
        );
    }

    if (!booking) {
        return (
            <>
                <BackLink />
                <p className="text-sm text-neutral-500">Loading…</p>
            </>
        );
    }

    return (
        <>
            <BackLink />

            <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                        Booking #{booking.shortId}
                    </p>
                    <h1 className="mt-1 text-3xl font-bold text-brand-ink sm:text-4xl">
                        {booking.patientName}
                    </h1>
                    <p className="mt-1 text-sm text-neutral-500">
                        {booking.type} · {booking.department}
                    </p>
                </div>
                <BookingStatusPill status={booking.status} size="md" />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
                <div className="space-y-6">
                    <BookingPatientCard booking={booking} />
                    <BookingDetailsCard booking={booking} />
                    <BookingNotesCard
                        adminNotes={booking.adminNotes}
                        onSave={handleSaveNotes}
                    />
                    <BookingActivityCard activity={activity} />
                </div>

                <div>
                    <div className="lg:sticky lg:top-20">
                        <BookingStatusActions
                            currentStatus={booking.status}
                            onAction={handleStatusAction}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

function BackLink() {
    return (
        <Link
            to="/admin/bookings"
            className="mb-6 inline-flex items-center gap-1 text-sm text-brand-ink hover:text-brand-blue"
        >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            All bookings
        </Link>
    );
}