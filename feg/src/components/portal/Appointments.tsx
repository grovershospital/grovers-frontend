import { useEffect, useRef, useState } from "react";
import AppointmentsHero from "../../components/portal/AppointmentsHero";
import AppointmentsTable from "../../components/portal/AppointmentsTable";
import BookAppointmentForm, {
    type BookAppointmentFormHandle,
} from "../../components/portal/BookAppointmentForm";
import {
    cancelAppointment,
    fetchUpcomingAppointments,
    fetchPastAppointments,
    type Appointment,
} from "../../data/portal";
import {toast} from "sonner";

export default function Appointments() {
    const [upcoming, setUpcoming] = useState<ReadonlyArray<Appointment>>([]);
    const [past, setPast] = useState<ReadonlyArray<Appointment>>([]);
    const [loadingUpcoming, setLoadingUpcoming] = useState(true);
    const [loadingPast, setLoadingPast] = useState(true);

    const formRef = useRef<BookAppointmentFormHandle>(null);

    useEffect(() => {
        let alive = true;

        fetchUpcomingAppointments()
            .then((data) => {
                if (alive) setUpcoming(data);
            })
            .finally(() => {
                if (alive) setLoadingUpcoming(false);
            });

        fetchPastAppointments()
            .then((data) => {
                if (alive) setPast(data);
            })
            .finally(() => {
                if (alive) setLoadingPast(false);
            });

        return () => {
            alive = false;
        };
    }, []);

    function handleReschedule(a: Appointment) {
        // TODO: open reschedule modal / inline date-time picker
        console.log("reschedule", a);
    }

    function loadUpcoming() {
        setLoadingUpcoming(true);
        return fetchUpcomingAppointments()
            .then((data) => setUpcoming(data))
            .finally(() => setLoadingUpcoming(false));
    }

    useEffect(() => {
        let alive = true;

        fetchUpcomingAppointments()
            .then((data) => {
                if (alive) setUpcoming(data);
            })
            .finally(() => {
                if (alive) setLoadingUpcoming(false);
            });

        fetchPastAppointments()
            .then((data) => {
                if (alive) setPast(data);
            })
            .finally(() => {
                if (alive) setLoadingPast(false);
            });

        return () => {
            alive = false;
        };
    }, []);

    async function handleCancel(a: Appointment) {
        const ok = window.confirm(
            `Cancel your ${a.department} appointment on ${a.date}?`,
        );
        if (!ok) return;

        // Optimistic removal — restore on failure.
        const prev = upcoming;
        setUpcoming((list) => list.filter((x) => x.id !== a.id));
        try {
            await cancelAppointment(a.id);
            toast.success("Appointment cancelled");
        } catch {
            setUpcoming(prev);
            toast.error("Could not cancel. Please try again.");
        }
    }

    function handleRebook(a: Appointment) {
        formRef.current?.prefillAndFocus(a.department);
    }

    return (
        <>
            <AppointmentsHero />

            <AppointmentsTable
                title="Upcoming Appointments"
                appointments={upcoming}
                loading={loadingUpcoming}
                action={{
                    kind: "upcoming",
                    onReschedule: handleReschedule,
                    onCancel: handleCancel,
                }}
            />

            <AppointmentsTable
                title="Past Appointments"
                appointments={past}
                loading={loadingPast}
                action={{ kind: "past", onRebook: handleRebook }}
            />

            <BookAppointmentForm ref={formRef} onCreated={loadUpcoming}/>
        </>
    );
}