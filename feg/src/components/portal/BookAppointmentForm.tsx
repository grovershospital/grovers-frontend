import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import type { FormEvent } from "react";
import { X } from "lucide-react";
import {
    bookAppointment,
    cancelAppointment,
    fetchDepartments,
    fetchPublicPackages,
    type Appointment,
    type BookingType,
    type Department,
    type PublicPackage,
} from "../../data/portal";
import { toast } from "sonner";

export type BookAppointmentFormHandle = {
    /** Pre-fills department + scrolls the form into view. Used by the Rebook flow on past appointments. */
    prefillAndFocus: (departmentName: string) => void;
    /** Switches the form into reschedule mode for the given appointment. */
    prefillForReschedule: (a: Appointment) => void;
};

type Props = {
    onCreated?: () => void;
};

function tomorrowIso(): string {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
}

const BookAppointmentForm = forwardRef<BookAppointmentFormHandle, Props>(
    function BookAppointmentForm({ onCreated }, ref) {
        const formWrapperRef = useRef<HTMLDivElement>(null);
        const departmentRef = useRef<HTMLSelectElement>(null);

        const [bookingType, setBookingType] = useState<BookingType>("CONSULTATION");
        const [departmentId, setDepartmentId] = useState("");
        const [packageId, setPackageId] = useState("");
        const [packageTierId, setPackageTierId] = useState("");
        const [date, setDate] = useState("");
        const [notes, setNotes] = useState("");

        const [departments, setDepartments] = useState<Department[] | null>(null);
        const [departmentsError, setDepartmentsError] = useState<string | null>(null);

        const [packages, setPackages] = useState<PublicPackage[] | null>(null);
        const [packagesError, setPackagesError] = useState<string | null>(null);

        const [submitting, setSubmitting] = useState(false);
        const [rescheduleOf, setRescheduleOf] = useState<Appointment | null>(null);

        // Load departments + packages on mount. Both are cached at the data
        // layer so subsequent navigations are free.
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

            fetchPublicPackages()
                .then((list) => {
                    if (alive) setPackages(list);
                })
                .catch(() => {
                    if (alive)
                        setPackagesError(
                            "Could not load packages. Please refresh the page.",
                        );
                });

            return () => {
                alive = false;
            };
        }, []);

        // Reset tier when the chosen package changes — tiers belong to a
        // specific package, so a stale tierId from a different package would
        // be wrong.
        useEffect(() => {
            setPackageTierId("");
        }, [packageId]);

        function scrollAndFocus() {
            formWrapperRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
            setTimeout(() => departmentRef.current?.focus(), 400);
        }

        function exitRescheduleMode() {
            setRescheduleOf(null);
            setDepartmentId("");
            setPackageId("");
            setPackageTierId("");
            setDate("");
            setNotes("");
        }

        useImperativeHandle(ref, () => ({
            prefillAndFocus: (departmentName: string) => {
                setRescheduleOf(null);
                setBookingType("CONSULTATION");
                if (departments) {
                    const match = departments.find(
                        (d) => d.name.toLowerCase() === departmentName.toLowerCase(),
                    );
                    if (match) setDepartmentId(match.id);
                }
                scrollAndFocus();
            },

            prefillForReschedule: (a: Appointment) => {
                setBookingType("CONSULTATION");
                setRescheduleOf(a);
                if (a.departmentId) setDepartmentId(a.departmentId);
                setDate(a.preferredDateIso);
                setNotes(a.notes);
                scrollAndFocus();
            },
        }));

        const selectedPackage = packages?.find((p) => p.id === packageId) ?? null;

        async function handleSubmit(e: FormEvent<HTMLFormElement>) {
            e.preventDefault();

            if (bookingType === "CONSULTATION" && !departmentId) {
                toast.error("Please choose a department.");
                return;
            }
            if (bookingType === "PACKAGE" && !packageId) {
                toast.error("Please choose a package.");
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
                    departmentId: bookingType === "CONSULTATION" ? departmentId : undefined,
                    packageId: bookingType === "PACKAGE" ? packageId : undefined,
                    packageTierId:
                        bookingType === "PACKAGE" && packageTierId
                            ? packageTierId
                            : undefined,
                    preferredDate: date,
                    notes: notes || undefined,
                });

                if (rescheduleOf) {
                    try {
                        await cancelAppointment(rescheduleOf.id);
                        toast.success("Appointment rescheduled.");
                    } catch {
                        toast.warning(
                            "New booking created, but we couldn't cancel the old one. Please cancel it manually from the upcoming list.",
                        );
                    }
                } else {
                    toast.success("Booking submitted. We'll confirm shortly.");
                }

                exitRescheduleMode();
                onCreated?.();
                formWrapperRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
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

        const isReschedule = rescheduleOf !== null;
        const submitLabel = isReschedule
            ? submitting
                ? "Rescheduling…"
                : "Reschedule appointment"
            : submitting
                ? "Submitting…"
                : "Request Appointment";
        const headingText = isReschedule
            ? "Reschedule Appointment"
            : "Book an Appointment";

        return (
            <section ref={formWrapperRef}>
                <h2 className="mb-6 text-2xl font-bold text-brand-ink">
                    {headingText}
                </h2>

                {isReschedule && rescheduleOf && (
                    <div className="mb-6 flex max-w-md items-start justify-between gap-3 rounded-2xl border border-brand-blue/30 bg-brand-blue/5 p-4 text-sm text-brand-ink">
                        <div>
                            <p className="font-semibold">
                                Rescheduling your {rescheduleOf.department}{" "}
                                appointment on {rescheduleOf.date}.
                            </p>
                            <p className="mt-1 text-xs text-neutral-600">
                                We'll create a new booking on your chosen date and
                                cancel the old one in one step.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={exitRescheduleMode}
                            className="flex-shrink-0 text-neutral-500 hover:text-brand-ink"
                            aria-label="Cancel rescheduling"
                        >
                            <X className="h-4 w-4" strokeWidth={2} />
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="max-w-md space-y-5">
                    {!isReschedule && (
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
                    )}

                    {bookingType === "CONSULTATION" && (
                        <div>
                            <label
                                htmlFor="appt-department"
                                className="mb-1.5 block text-sm font-semibold text-brand-ink"
                            >
                                Department
                            </label>
                            {departmentsError ? (
                                <p className="text-sm text-brand-red">
                                    {departmentsError}
                                </p>
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
                    )}

                    {bookingType === "PACKAGE" && (
                        <>
                            <div>
                                <label
                                    htmlFor="appt-package"
                                    className="mb-1.5 block text-sm font-semibold text-brand-ink"
                                >
                                    Package
                                </label>
                                {packagesError ? (
                                    <p className="text-sm text-brand-red">
                                        {packagesError}
                                    </p>
                                ) : !packages ? (
                                    <p className="text-sm text-neutral-500">
                                        Loading packages…
                                    </p>
                                ) : packages.length === 0 ? (
                                    <p className="text-sm text-neutral-500">
                                        No packages available at the moment.
                                    </p>
                                ) : (
                                    <select
                                        id="appt-package"
                                        required
                                        value={packageId}
                                        onChange={(e) => setPackageId(e.target.value)}
                                        className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                                    >
                                        <option value="" disabled>
                                            Select a package
                                        </option>
                                        {packages.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {selectedPackage && selectedPackage.tiers.length > 0 && (
                                <div>
                                    <label
                                        htmlFor="appt-tier"
                                        className="mb-1.5 block text-sm font-semibold text-brand-ink"
                                    >
                                        Tier{" "}
                                        <span className="font-normal italic text-neutral-500">
                                            (optional)
                                        </span>
                                    </label>
                                    <select
                                        id="appt-tier"
                                        value={packageTierId}
                                        onChange={(e) => setPackageTierId(e.target.value)}
                                        className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                                    >
                                        <option value="">
                                            We'll discuss the right tier with you
                                        </option>
                                        {selectedPackage.tiers.map((t) => (
                                            <option key={t.id} value={t.id}>
                                                {t.name}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="mt-1 text-xs text-neutral-500">
                                        Not sure? Leave this blank and the hospital
                                        will help you pick the right tier when they
                                        get in touch.
                                    </p>
                                </div>
                            )}
                        </>
                    )}

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
                            The hospital will confirm the exact time when your booking
                            is reviewed.
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
                            disabled={submitting}
                            className="inline-flex cursor-pointer items-center justify-center rounded-full bg-brand-red px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red disabled:opacity-60"
                        >
                            {submitLabel}
                        </button>
                    </div>
                </form>
            </section>
        );
    },
);

export default BookAppointmentForm;