import {useEffect, useState} from "react";
import {CalendarDays, Clock} from "lucide-react";
import {
    confirmBooking,
    fetchAdminDepartmentSchedule,
    updateAppointmentTime,
    type AdminBookingDetail,
    type AdminDepartmentSchedule,
    type DayOfWeek,
} from "../../data/admin";
import {toast} from "sonner";

// ─── Day helpers ────────────────────────────────────────────

const JS_DAY_TO_ENUM: DayOfWeek[] = [
    "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY",
    "THURSDAY", "FRIDAY", "SATURDAY",
];

const DAY_LABEL: Record<DayOfWeek, string> = {
    MONDAY: "Monday", TUESDAY: "Tuesday", WEDNESDAY: "Wednesday",
    THURSDAY: "Thursday", FRIDAY: "Friday", SATURDAY: "Saturday",
    SUNDAY: "Sunday",
};

function formatTime(t: string): string {
    const [hStr, mStr] = t.split(":");
    let h = parseInt(hStr, 10);
    const suffix = h >= 12 ? "PM" : "AM";
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    return `${h}:${mStr} ${suffix}`;
}

function isTimeInRange(time: string, start: string, end: string): boolean {
    return time >= start && time < end;
}

// ─── Component ──────────────────────────────────────────────

type Mode = "confirm" | "update-time";

type Props = {
    open: boolean;
    onClose: () => void;
    mode: Mode;
    bookingId: string;
    departmentId: string | null;
    preferredDateIso: string;
    currentTime?: string | null;
    onSuccess: (booking: AdminBookingDetail) => void;
};

type ScheduleStatus = "loading" | "error" | "ready";

export default function ConfirmTimeModal({
                                             open,
                                             onClose,
                                             mode,
                                             bookingId,
                                             departmentId,
                                             preferredDateIso,
                                             currentTime,
                                             onSuccess,
                                         }: Props) {
    const [time, setTime] = useState(currentTime ?? "");
    const [notes, setNotes] = useState("");
    const [timeError, setTimeError] = useState<string | null>(null);

    const [windows, setWindows] = useState<AdminDepartmentSchedule[]>([]);
    const [scheduleStatus, setScheduleStatus] = useState<ScheduleStatus>("loading");
    const [submitting, setSubmitting] = useState(false);

    // Derive day of week from preferred date
    const date = new Date(preferredDateIso + "T00:00:00");
    const dayOfWeek = JS_DAY_TO_ENUM[date.getDay()];

    // Reset state when modal opens
    useEffect(() => {
        if (open) {
            setTime(currentTime ?? "");
            setNotes("");
            setTimeError(null);
        }
    }, [open, currentTime]);

    // Fetch schedule when modal opens
    useEffect(() => {
        if (!open || !departmentId) {
            if (open && !departmentId) {
                // Package booking — no schedule constraint
                setWindows([]);
                setScheduleStatus("ready");
            }
            return;
        }
        let alive = true;
        setScheduleStatus("loading");
        fetchAdminDepartmentSchedule(departmentId)
            .then((data) => {
                if (!alive) return;
                const dayWindows = data.filter((s) => s.dayOfWeek === dayOfWeek);
                setWindows(dayWindows);
                setScheduleStatus("ready");
            })
            .catch(() => {
                if (alive) setScheduleStatus("error");
            });
        return () => {
            alive = false;
        };
    }, [open, departmentId, dayOfWeek]);

    function validateTime(t: string): string | null {
        if (!t) return "Please select a time.";
        if (windows.length === 0) return null; // no schedule constraint (package booking)
        const valid = windows.some((w) => isTimeInRange(t, w.startTime, w.endTime));
        if (!valid) {
            const ranges = windows
                .map((w) => `${formatTime(w.startTime)} – ${formatTime(w.endTime)}`)
                .join(", ");
            return `Time must be within department hours: ${ranges}`;
        }
        return null;
    }

    function handleTimeChange(t: string) {
        setTime(t);
        setTimeError(validateTime(t));
    }

    async function handleSubmit() {
        const err = validateTime(time);
        if (err) {
            setTimeError(err);
            return;
        }

        setSubmitting(true);
        try {
            let updated: AdminBookingDetail;
            if (mode === "confirm") {
                updated = await confirmBooking(bookingId, time, notes || undefined);
                toast.success("Booking confirmed.");
            } else {
                updated = await updateAppointmentTime(bookingId, time, notes || undefined);
                toast.success("Appointment time updated.");
            }
            onSuccess(updated);
            onClose();
        } catch {
            toast.error(
                mode === "confirm"
                    ? "Could not confirm the booking. Please try again."
                    : "Could not update the time. Please try again.",
            );
        } finally {
            setSubmitting(false);
        }
    }

    if (!open) return null;

    const title = mode === "confirm" ? "Confirm Booking" : "Update Appointment Time";
    const submitLabel = mode === "confirm"
        ? submitting ? "Confirming…" : "Confirm booking"
        : submitting ? "Updating…" : "Update time";
    const notesLabel = mode === "confirm" ? "Admin notes (optional)" : "Reason for change (optional)";
    const notesPlaceholder = mode === "confirm"
        ? "Add context for this confirmation…"
        : "e.g. Doctor running late, rescheduled by patient request…";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="w-full max-w-md rounded-2xl bg-white shadow-xl"
                role="dialog"
                aria-label={title}
            >
                <div className="border-b border-neutral-100 px-6 py-4">
                    <h2 className="text-lg font-bold text-brand-ink">{title}</h2>
                    <p className="mt-1 text-xs text-neutral-500">
                        {DAY_LABEL[dayOfWeek]}, {preferredDateIso}
                    </p>
                </div>

                <div className="space-y-5 px-6 py-5">
                    {/* Schedule windows */}
                    {scheduleStatus === "loading" && (
                        <p className="text-xs text-neutral-500">Loading department schedule…</p>
                    )}

                    {scheduleStatus === "error" && (
                        <p className="text-xs text-brand-red">
                            Could not load the schedule. You can still pick a time manually.
                        </p>
                    )}

                    {scheduleStatus === "ready" && windows.length > 0 && (
                        <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
                            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-brand-ink">
                                <CalendarDays className="h-3.5 w-3.5" strokeWidth={2.5}/>
                                Department hours for {DAY_LABEL[dayOfWeek]}
                            </div>
                            <div className="space-y-1">
                                {windows.map((w, i) => (
                                    <p key={i} className="text-xs text-neutral-600">
                                        {formatTime(w.startTime)} – {formatTime(w.endTime)}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}

                    {scheduleStatus === "ready" && windows.length === 0 && departmentId && (
                        <p className="text-xs text-neutral-500">
                            No schedule windows found for {DAY_LABEL[dayOfWeek]}. You can still assign a time.
                        </p>
                    )}

                    {/* Time picker */}
                    <div>
                        <label
                            htmlFor="confirm-time"
                            className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-brand-ink"
                        >
                            <Clock className="h-4 w-4" strokeWidth={2}/>
                            Appointment time
                        </label>
                        <input
                            id="confirm-time"
                            type="time"
                            value={time}
                            onChange={(e) => handleTimeChange(e.target.value)}
                            className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-brand-ink focus:outline-none focus:ring-1 ${
                                timeError
                                    ? "border-brand-red focus:border-brand-red focus:ring-brand-red"
                                    : "border-neutral-300 focus:border-brand-blue focus:ring-brand-blue"
                            }`}
                        />
                        {timeError && (
                            <p className="mt-1 text-xs text-brand-red" role="alert">
                                {timeError}
                            </p>
                        )}
                    </div>

                    {/* Notes / reason */}
                    <div>
                        <label
                            htmlFor="confirm-notes"
                            className="mb-1.5 block text-sm font-semibold text-brand-ink"
                        >
                            {notesLabel}
                        </label>
                        <textarea
                            id="confirm-notes"
                            rows={2}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder={notesPlaceholder}
                            className="w-full resize-y rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 border-t border-neutral-100 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="rounded-full border border-neutral-300 px-5 py-2 text-sm font-semibold text-brand-ink transition-colors hover:bg-neutral-100 disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting || !!timeError || !time}
                        className="rounded-full bg-brand-green px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-blue disabled:opacity-60"
                    >
                        {submitLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}