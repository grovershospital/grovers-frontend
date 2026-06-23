import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import type {FormEvent} from "react";
import {CalendarDays, ChevronDown, X} from "lucide-react";
import {
    bookAppointment,
    cancelAppointment,
    fetchDepartments,
    fetchDepartmentSchedule,
    fetchPublicPackages,
    type Appointment,
    type BookingType,
    type DayOfWeek,
    type Department,
    type DepartmentSchedule,
    type PublicPackage,
} from "../../data/portal";
import {toast} from "sonner";

export type BookAppointmentFormHandle = {
    prefillAndFocus: (departmentName: string) => void;
    prefillForReschedule: (a: Appointment) => void;
};

type Props = {
    onCreated?: () => void;
};

// ─── Day-of-week helpers ─────────────────────────────────────

const JS_DAY_TO_ENUM: DayOfWeek[] = [
    "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY",
    "THURSDAY", "FRIDAY", "SATURDAY",
];

const DAY_LABEL: Record<DayOfWeek, string> = {
    MONDAY: "Mon", TUESDAY: "Tue", WEDNESDAY: "Wed", THURSDAY: "Thu",
    FRIDAY: "Fri", SATURDAY: "Sat", SUNDAY: "Sun",
};

const DAY_FULL: Record<DayOfWeek, string> = {
    MONDAY: "Mondays", TUESDAY: "Tuesdays", WEDNESDAY: "Wednesdays",
    THURSDAY: "Thursdays", FRIDAY: "Fridays", SATURDAY: "Saturdays",
    SUNDAY: "Sundays",
};

function formatTime(t: string): string {
    // "08:00" → "8:00 AM", "14:30" → "2:30 PM"
    const [hStr, mStr] = t.split(":");
    let h = parseInt(hStr, 10);
    const suffix = h >= 12 ? "PM" : "AM";
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    return `${h}:${mStr} ${suffix}`;
}

function tomorrowIso(): string {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
}

function validateDateAgainstSchedule(
    dateStr: string,
    schedule: DepartmentSchedule[],
): string | null {
    if (!dateStr || schedule.length === 0) return null;
    const d = new Date(dateStr + "T00:00:00");
    const dayEnum = JS_DAY_TO_ENUM[d.getDay()];
    const match = schedule.find((s) => s.dayOfWeek === dayEnum);
    if (!match) {
        const available = schedule.map((s) => DAY_LABEL[s.dayOfWeek]).join(", ");
        return `This department isn't open on ${DAY_FULL[dayEnum]}. Available days: ${available}`;
    }
    return null;
}

// ─── Component ───────────────────────────────────────────────

const BookAppointmentForm = forwardRef<BookAppointmentFormHandle, Props>(
    function BookAppointmentForm({onCreated}, ref) {
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

        const [schedule, setSchedule] = useState<DepartmentSchedule[]>([]);
        const [scheduleLoading, setScheduleLoading] = useState(false);
        const [scheduleError, setScheduleError] = useState<string | null>(null);
        const [dateError, setDateError] = useState<string | null>(null);

        const [submitting, setSubmitting] = useState(false);
        const [rescheduleOf, setRescheduleOf] = useState<Appointment | null>(null);

        // Load departments + packages on mount.
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

        // Fetch schedule when department changes.
        useEffect(() => {
            if (bookingType !== "CONSULTATION" || !departmentId) {
                setSchedule([]);
                setScheduleError(null);
                setDateError(null);
                return;
            }
            let alive = true;
            setScheduleLoading(true);
            setScheduleError(null);
            setDateError(null);
            fetchDepartmentSchedule(departmentId)
                .then((data) => {
                    if (!alive) return;
                    setSchedule(data);
                    // Re-validate currently selected date against new schedule
                    if (date) {
                        setDateError(validateDateAgainstSchedule(date, data));
                    }
                })
                .catch(() => {
                    if (alive)
                        setScheduleError("Could not load department schedule.");
                })
                .finally(() => {
                    if (alive) setScheduleLoading(false);
                });
            return () => {
                alive = false;
            };
        }, [bookingType, departmentId]);

        // Reset tier when the chosen package changes.
        useEffect(() => {
            setPackageTierId("");
        }, [packageId]);

        // Validate date whenever it changes.
        function handleDateChange(newDate: string) {
            setDate(newDate);
            if (bookingType === "CONSULTATION" && schedule.length > 0) {
                setDateError(validateDateAgainstSchedule(newDate, schedule));
            } else {
                setDateError(null);
            }
        }

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
            setSchedule([]);
            setDateError(null);
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
            // Validate date against schedule for consultations
            if (bookingType === "CONSULTATION" && schedule.length > 0) {
                const error = validateDateAgainstSchedule(date, schedule);
                if (error) {
                    setDateError(error);
                    toast.error("Please pick a date when the department is open.");
                    return;
                }
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
                            <X className="h-4 w-4" strokeWidth={2}/>
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
                                <div className="relative">
                                    <select
                                        id="appt-department"
                                        ref={departmentRef}
                                        required
                                        value={departmentId}
                                        onChange={(e) => setDepartmentId(e.target.value)}
                                        className="w-full appearance-none cursor-pointer rounded-lg border border-neutral-300 bg-white py-2.5 pl-4 pr-10 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
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
                                    <ChevronDown
                                        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
                                        strokeWidth={2}
                                    />
                                </div>
                            )}

                            {/* Department schedule display */}
                            {departmentId && (
                                <ScheduleInfo
                                    schedule={schedule}
                                    loading={scheduleLoading}
                                    error={scheduleError}
                                />
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
                                    <div className="relative">
                                        <select
                                            id="appt-package"
                                            required
                                            value={packageId}
                                            onChange={(e) => setPackageId(e.target.value)}
                                            className="w-full appearance-none cursor-pointer rounded-lg border border-neutral-300 bg-white py-2.5 pl-4 pr-10 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
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
                                        <ChevronDown
                                            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
                                            strokeWidth={2}
                                        />
                                    </div>
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
                                    <div className="relative">
                                        <select
                                            id="appt-tier"
                                            value={packageTierId}
                                            onChange={(e) => setPackageTierId(e.target.value)}
                                            className="w-full appearance-none cursor-pointer rounded-lg border border-neutral-300 bg-white py-2.5 pl-4 pr-10 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
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
                                        <ChevronDown
                                            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
                                            strokeWidth={2}
                                        />
                                    </div>
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
                            onChange={(e) => handleDateChange(e.target.value)}
                            className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-brand-ink focus:outline-none focus:ring-1 ${
                                dateError
                                    ? "border-brand-red focus:border-brand-red focus:ring-brand-red"
                                    : "border-neutral-300 focus:border-brand-blue focus:ring-brand-blue"
                            }`}
                        />
                        {dateError ? (
                            <p className="mt-1 text-xs text-brand-red" role="alert">
                                {dateError}
                            </p>
                        ) : (
                            <p className="mt-1 text-xs text-neutral-500">
                                The hospital will confirm the exact time when your booking
                                is reviewed.
                            </p>
                        )}
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
                            disabled={submitting || !!dateError}
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

// ─── Schedule display ────────────────────────────────────────

function ScheduleInfo({
                          schedule,
                          loading,
                          error,
                      }: {
    schedule: DepartmentSchedule[];
    loading: boolean;
    error: string | null;
}) {
    if (loading) {
        return (
            <p className="mt-2 text-xs text-neutral-500">
                Loading schedule…
            </p>
        );
    }

    if (error) {
        return (
            <p className="mt-2 text-xs text-brand-red">{error}</p>
        );
    }

    if (schedule.length === 0) {
        return (
            <p className="mt-2 text-xs text-neutral-500">
                No schedule information available for this department.
            </p>
        );
    }

    return (
        <div className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-brand-ink">
                <CalendarDays className="h-3.5 w-3.5" strokeWidth={2.5}/>
                Available days
            </div>
            <div className="grid grid-cols-1 gap-1 text-xs text-brand-ink/80 sm:grid-cols-2">
                {schedule.map((s) => (
                    <div key={s.dayOfWeek} className="flex justify-between gap-2 sm:justify-start sm:gap-4">
                        <span className="font-medium w-10">
                            {DAY_LABEL[s.dayOfWeek]}
                        </span>
                        <span className="text-neutral-600">
                            {formatTime(s.startTime)} – {formatTime(s.endTime)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}