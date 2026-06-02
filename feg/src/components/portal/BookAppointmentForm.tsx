import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import type { FormEvent } from "react";
import { bookAppointment, DEPARTMENTS } from "../../data/portal";

export type BookAppointmentFormHandle = {
    /** Pre-fills department + scrolls the form into view. */
    prefillAndFocus: (department: string) => void;
};

const BookAppointmentForm = forwardRef<BookAppointmentFormHandle>(function BookAppointmentForm(
    _props,
    ref,
) {
    const formWrapperRef = useRef<HTMLDivElement>(null);
    const departmentRef = useRef<HTMLSelectElement>(null);

    const [department, setDepartment] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [reason, setReason] = useState("");
    const [notes, setNotes] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
        prefillAndFocus: (d: string) => {
            setDepartment(d);
            formWrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            // Give scroll a moment, then drop focus on the department select.
            setTimeout(() => departmentRef.current?.focus(), 400);
        },
    }));

    // Clear success state once the user starts editing again.
    useEffect(() => {
        if (success) setSuccess(false);
    }, [department, date, time, reason, notes]); // eslint-disable-line react-hooks/exhaustive-deps

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await bookAppointment({
                department,
                date,
                time,
                reason: reason || undefined,
                notes: notes || undefined,
            });
            setSuccess(true);
            setDepartment("");
            setDate("");
            setTime("");
            setReason("");
            setNotes("");
        } catch {
            setError("Could not submit your request. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section ref={formWrapperRef}>
            <h2 className="mb-6 text-2xl font-bold text-brand-ink">Book an Appointment</h2>

            <form onSubmit={handleSubmit} className="max-w-md space-y-5">
                <div>
                    <label
                        htmlFor="appt-department"
                        className="mb-1.5 block text-sm font-semibold text-brand-ink"
                    >
                        Select department
                    </label>
                    <select
                        id="appt-department"
                        ref={departmentRef}
                        required
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    >
                        <option value="" disabled>
                            Select a department
                        </option>
                        {DEPARTMENTS.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="appt-date"
                        className="mb-1.5 block text-sm font-semibold text-brand-ink"
                    >
                        Date
                    </label>
                    <input
                        id="appt-date"
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                </div>

                <div>
                    <label
                        htmlFor="appt-time"
                        className="mb-1.5 block text-sm font-semibold text-brand-ink"
                    >
                        Time
                    </label>
                    {/* TODO (backend): replace with a slot-picker driven by */}
                    {/* GET /api/appointments/slots?department=&date= */}
                    <input
                        id="appt-time"
                        type="time"
                        required
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                </div>

                <div>
                    <label
                        htmlFor="appt-reason"
                        className="mb-1.5 block text-sm font-semibold text-brand-ink"
                    >
                        Reason for Visit{" "}
                        <span className="font-normal italic text-neutral-500">(optional)</span>
                    </label>
                    <input
                        id="appt-reason"
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="I want to see a doctor for my health"
                        className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                </div>

                <div>
                    <label
                        htmlFor="appt-notes"
                        className="mb-1.5 block text-sm font-semibold text-brand-ink"
                    >
                        Additional Notes{" "}
                        <span className="font-normal italic text-neutral-500">(optional)</span>
                    </label>
                    <textarea
                        id="appt-notes"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Anything else we should know"
                        className="w-full resize-y rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center justify-center rounded-full bg-brand-red px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red disabled:opacity-60"
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
                        Your appointment request has been submitted. You'll receive a confirmation
                        soon.
                    </p>
                )}
            </form>
        </section>
    );
});

export default BookAppointmentForm;