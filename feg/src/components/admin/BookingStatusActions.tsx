import {useState} from "react";
import BookingStatusPill from "./BookingStatusPill";
import type {AdminBookingStatus} from "../../data/admin";

type Props = {
    currentStatus: AdminBookingStatus;
    onAction: (newStatus: AdminBookingStatus, adminNotes: string) => Promise<void>;
    /** Called when admin clicks "Confirm booking". Parent opens the ConfirmTimeModal. */
    onConfirm?: () => void;
    /** Called when admin clicks "Update appointment time". Parent opens the modal in update mode. */
    onUpdateTime?: () => void;
};

type Transition = {
    target: AdminBookingStatus;
    label: string;
    tone: "primary" | "secondary" | "danger";
};

// Status-change transitions that still use the old one-click flow.
// "Confirm" is excluded — it now opens the time-picker modal instead.
const STATUS_TRANSITIONS: Record<AdminBookingStatus, Transition[]> = {
    Pending: [
        {target: "Cancelled", label: "Cancel booking", tone: "danger"},
    ],
    Confirmed: [
        {target: "Completed", label: "Mark as Completed", tone: "primary"},
        {target: "Cancelled", label: "Cancel booking", tone: "danger"},
    ],
    Completed: [],
    Cancelled: [],
};

const TONE_CLASS: Record<Transition["tone"], string> = {
    primary:
        "bg-brand-green text-white hover:bg-brand-blue focus-visible:outline-brand-green",
    secondary:
        "bg-brand-ink text-white hover:bg-brand-blue focus-visible:outline-brand-ink",
    danger:
        "bg-brand-red text-white hover:bg-brand-blue focus-visible:outline-brand-red",
};

export default function BookingStatusActions({
                                                 currentStatus,
                                                 onAction,
                                                 onConfirm,
                                                 onUpdateTime,
                                             }: Props) {
    const transitions = STATUS_TRANSITIONS[currentStatus];
    const [adminNotes, setAdminNotes] = useState("");
    const [submitting, setSubmitting] = useState<AdminBookingStatus | null>(null);

    const isTerminal = currentStatus === "Completed" || currentStatus === "Cancelled";
    const showConfirm = currentStatus === "Pending" && onConfirm;
    const showUpdateTime = currentStatus === "Confirmed" && onUpdateTime;

    async function handleClick(target: AdminBookingStatus) {
        setSubmitting(target);
        try {
            await onAction(target, adminNotes);
            setAdminNotes("");
        } finally {
            setSubmitting(null);
        }
    }

    return (
        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-base font-bold text-brand-ink">Status</h2>

            <div className="mb-6 flex items-center gap-3">
                <span className="text-xs uppercase tracking-wider text-neutral-500">
                    Current:
                </span>
                <BookingStatusPill status={currentStatus} size="md"/>
            </div>

            {isTerminal ? (
                <p className="text-sm text-neutral-500">
                    This booking is in a final state. No further actions available.
                </p>
            ) : (
                <div className="space-y-4">
                    {/* Confirm button — opens the time-picker modal */}
                    {showConfirm && (
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="inline-flex w-full items-center justify-center rounded-full bg-brand-green px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
                        >
                            Confirm booking
                        </button>
                    )}

                    {/* Update time button — opens the modal in update mode */}
                    {showUpdateTime && (
                        <button
                            type="button"
                            onClick={onUpdateTime}
                            className="inline-flex w-full items-center justify-center rounded-full bg-brand-ink px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink"
                        >
                            Update appointment time
                        </button>
                    )}

                    {/* Divider between modal actions and status-change actions */}
                    {(showConfirm || showUpdateTime) && transitions.length > 0 && (
                        <div className="border-t border-neutral-100 pt-4"/>
                    )}

                    {/* Notes + status-change buttons (cancel, complete) */}
                    {transitions.length > 0 && (
                        <>
                            <label
                                htmlFor="admin-notes"
                                className="mb-2 block text-sm font-semibold text-brand-ink"
                            >
                                Note (optional)
                            </label>
                            <textarea
                                id="admin-notes"
                                rows={3}
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Add context for this status change…"
                                className="mb-4 w-full resize-y rounded-2xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                            />

                            <div className="space-y-2">
                                {transitions.map((t) => (
                                    <button
                                        key={t.target}
                                        type="button"
                                        onClick={() => handleClick(t.target)}
                                        disabled={submitting !== null}
                                        className={`inline-flex w-full items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 ${TONE_CLASS[t.tone]}`}
                                    >
                                        {submitting === t.target ? "Working…" : t.label}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </section>
    );
}