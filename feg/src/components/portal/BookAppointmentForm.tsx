import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import type { FormEvent } from "react";
import {
    bookAppointment,
    fetchDepartments,
    type BookingType,
    type Department,
} from "../../data/portal";
import {toast} from "sonner";

export type BookAppointmentFormHandle = {
    /** Pre-fills department + scrolls the form into view. */
    prefillAndFocus: (departmentName: string) => void;
};

type Props = {
    onCreated?: () => void;
}

function tomorrowIso(): string {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
}

const BookAppointmentForm = forwardRef<BookAppointmentFormHandle, Props>(function BookAppointmentForm(
    {onCreated},
    ref,
) {
    const formWrapperRef = useRef<HTMLDivElement>(null);
    const departmentRef = useRef<HTMLSelectElement>(null);

    // Static booking inputs.
    const [bookingType, setBookingType] = useState<BookingType>("CONSULTATION");
    const [departmentId, setDepartmentId] = useState("");
    const [date, setDate] = useState("");
    const [notes, setNotes] = useState("");

    // Departments fetched async; null while loading, [] if none available.
    const [departments, setDepartments] = useState<Department[] | null>(null);
    const [departmentsError, setDepartmentsError] = useState<string | null>(null);

    // Submission state.
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load departments on mount.
    useEffect(() => {
        let alive = true;
        fetchDepartments()
            .then((list) => {
                if (alive) setDepartments(list);
            })
            .catch(() => {
                if (alive)
                    setDepartmentsError(
                        "Could not load departments. Please refresh the page.",
                    );
            });
        return () => {
            alive = false;
        };
    }, []);

    // Imperative handle for the rebook flow.
    useImperativeHandle(ref, () => ({
        prefillAndFocus: (departmentName: string) => {
            // If departments haven't loaded yet, we still scroll; the prefill
            // will silently no-op. That's acceptable — rebook flow is fast and
            // departments are cached after first load.
            setBookingType("CONSULTATION");
            if (departments) {
                const match = departments.find(
                    (d) => d.name.toLowerCase() === departmentName.toLowerCase(),
                );
                if (match) setDepartmentId(match.id);
            }
            formWrapperRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
            setTimeout(() => departmentRef.current?.focus(), 400);
        },
    }));

    // Clear success on edits.
    useEffect(() => {
        if (success) setSuccess(false);
    }, [bookingType, departmentId, date, notes]); // eslint-disable-line react-hooks/exhaustive-deps

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        if (bookingType === "PACKAGE") {
            setError(
                "Package bookings aren't available online yet. Please call the front desk.",
            );
            return;
        }

        if (!departmentId) {
            toast.error("Please choose a department.");
            return;
        }
        if (!date) {
            toast.error("Please choose a date.");
            return;
        }

        setSubmitting(true);
        try {
            await bookAppointment({
                bookingType,
                departmentId,
                preferredDate: date,
                notes: notes || undefined,
            });
            toast.success("Booking submitted. We'll confirm shortly.")
            setSuccess(true);
            setDepartmentId("");
            setDate("");
            setNotes("");
            onCreated?.();
            formWrapperRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            })
        } catch (err) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Could not submit your request. Please try again.",
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section ref={formWrapperRef}>
            <h2 className="mb-6 text-2xl font-bold text-brand-ink">Book an Appointment</h2>

            <form onSubmit={handleSubmit} className="max-w-md space-y-5">
                {/* Booking type — radio rather than dropdown to make both
                    options visible. */}
                <fieldset>
                    <legend className="mb-2 block text-sm font-semibold text-brand-ink">
                        Booking type
                    </legend>
                    <div className="space-y-2">
                        <label className="flex items-start gap-3 text-sm">
                            <input
                                type="radio"
                                name="booking-type"
                                value="CONSULTATION"
                                checked={bookingType === "CONSULTATION"}
                                onChange={() => setBookingType("CONSULTATION")}
                                className="mt-1 h-4 w-4 text-brand-red focus:ring-brand-blue"
                            />
                            <span>
                                <span className="font-semibold text-brand-ink">
                                    Consultation
                                </span>
                                <span className="block text-xs text-neutral-500">
                                    See a doctor in a specific department.
                                </span>
                            </span>
                        </label>
                        <label className="flex items-start gap-3 text-sm">
                            <input
                                type="radio"
                                name="booking-type"
                                value="PACKAGE"
                                checked={bookingType === "PACKAGE"}
                                onChange={() => setBookingType("PACKAGE")}
                                className="mt-1 h-4 w-4 text-brand-red focus:ring-brand-blue"
                            />
                            <span>
                                <span className="font-semibold text-brand-ink">
                                    Health package
                                </span>
                                <span className="block text-xs text-neutral-500">
                                    Annual wellness, screening, and other packages.
                                </span>
                            </span>
                        </label>
                    </div>
                </fieldset>

                {/* CONSULTATION branch */}
                {bookingType === "CONSULTATION" && (
                    <>
                        <div>
                            <label
                                htmlFor="appt-department"
                                className="mb-1.5 block text-sm font-semibold text-brand-ink"
                            >
                                Department
                            </label>
                            {departmentsError ? (
                                <p className="text-sm text-brand-red">{departmentsError}</p>
                            ) : !departments ? (
                                <p className="text-sm text-neutral-500">
                                    Loading departments…
                                </p>
                            ) : (
                                <select
                                    id="appt-department"
                                    ref={departmentRef}
                                    required
                                    value={departmentId}
                                    onChange={(e) => setDepartmentId(e.target.value)}
                                    className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                                >
                                    <option value="" disabled>
                                        Select a department
                                    </option>
                                    {departments.map((d) => (
                                        <option key={d.id} value={d.id}>
                                            {d.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </>
                )}

                {/* PACKAGE branch — stubbed until backend ships package endpoints */}
                {bookingType === "PACKAGE" && (
                    <div className="rounded-2xl border border-brand-blue/30 bg-brand-blue/5 p-4 text-sm text-brand-ink">
                        Package bookings will be available shortly. For now, please
                        call the front desk or visit in person to book a screening
                        or wellness package.
                    </div>
                )}

                {/* Date — common to both branches */}
                <div>
                    <label
                        htmlFor="appt-date"
                        className="mb-1.5 block text-sm font-semibold text-brand-ink"
                    >
                        Preferred date
                    </label>
                    <input
                        id="appt-date"
                        type="date"
                        required
                        min={tomorrowIso()}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                    <p className="mt-1 text-xs text-neutral-500">
                        The hospital will confirm the exact time when your booking is
                        reviewed.
                    </p>
                </div>

                <div>
                    <label
                        htmlFor="appt-notes"
                        className="mb-1.5 block text-sm font-semibold text-brand-ink"
                    >
                        Notes{" "}
                        <span className="font-normal italic text-neutral-500">
                            (optional)
                        </span>
                    </label>
                    <textarea
                        id="appt-notes"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Reason for the visit, anything we should know, etc."
                        className="w-full resize-y rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={submitting || bookingType === "PACKAGE"}
                        className="inline-flex items-center cursor-pointer justify-center rounded-full bg-brand-red px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red disabled:opacity-60"
                    >
                        {submitting ? "Submitting…" : "Request Appointment"}
                    </button>
                </div>

                {error && (
                    <p className="text-sm text-brand-red" role="alert">
                        {error}
                    </p>
                )}
                {success && (
                    <p className="text-sm text-brand-green" role="status">
                        Your appointment request has been submitted. The hospital will
                        confirm shortly.
                    </p>
                )}
            </form>
        </section>
    );
});

export default BookAppointmentForm;