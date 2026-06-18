import {useCallback, useEffect, useRef, useState} from "react";
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

type Status = "loading" | "error" | "ready";

export default function Appointments() {
    const [upcoming, setUpcoming] = useState<ReadonlyArray<Appointment>>([]);
    const [past, setPast] = useState<ReadonlyArray<Appointment>>([]);
    const [upcomingStatus, setUpcomingStatus] = useState<Status>("loading");
    const [pastStatus, setPastStatus] = useState<Status>("loading");

    const formRef = useRef<BookAppointmentFormHandle>(null);

    // Upcoming and past are fetched independently — if one fails, the other
    // still loads. Each has its own retry. This is also reused by onCreated
    // after booking to refresh the upcoming list.
    const loadUpcoming = useCallback(async () => {
        setUpcomingStatus("loading");
        try {
            const data = await fetchUpcomingAppointments();
            setUpcoming(data);
            setUpcomingStatus("ready");
        } catch {
            setUpcomingStatus("error");
        }
    }, []);

    const loadPast = useCallback(async () => {
        setPastStatus("loading");
        try {
            const data = await fetchPastAppointments();
            setPast(data);
            setPastStatus("ready");
        } catch {
            setPastStatus("error");
        }
    }, []);

    useEffect(() => {
        void loadUpcoming();
        void loadPast();
    }, [loadUpcoming, loadPast]);

    function handleReschedule(a: Appointment) {
        formRef.current?.prefillForReschedule(a);
    }

    async function handleCancel(a: Appointment) {
        const ok = window.confirm(
            `Cancel your ${a.department} appointment on ${a.date}?`,
        );
        if (!ok) return;

        const prev = upcoming;
        setUpcoming((list) => list.filter((x) => x.id !== a.id));
        try {
            await cancelAppointment(a.id);
            toast.success("Appointment cancelled.");
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
            <AppointmentsHero/>

            <AppointmentsTable
                title="Upcoming Appointments"
                appointments={upcoming}
                status={upcomingStatus}
                onRetry={loadUpcoming}
                action={{
                    kind: "upcoming",
                    onReschedule: handleReschedule,
                    onCancel: handleCancel,
                }}
            />

            <AppointmentsTable
                title="Past Appointments"
                appointments={past}
                status={pastStatus}
                onRetry={loadPast}
                action={{kind: "past", onRebook: handleRebook}}
            />

            <BookAppointmentForm ref={formRef} onCreated={loadUpcoming}/>
        </>
    );
}