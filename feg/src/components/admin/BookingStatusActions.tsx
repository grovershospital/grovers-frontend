import { useState } from "react";
import BookingStatusPill from "./BookingStatusPill";
import type { AdminBookingStatus } from "../../data/admin";

type Props = {
    currentStatus: AdminBookingStatus;
    onAction: (newStatus: AdminBookingStatus, adminNotes: string) => Promise<void>;
};

type Transition = {
    target: AdminBookingStatus;
    label: string;
    tone: "primary" | "secondary" | "danger";
};

const TRANSITIONS: Record<AdminBookingStatus, Transition[]> = {
    Pending: [
        { target: "Confirmed", label: "Confirm booking", tone: "primary" },
        { target: "Cancelled", label: "Cancel booking", tone: "danger" },
    ],
    Confirmed: [
        { target: "Completed", label: "Mark as Completed", tone: "primary" },
        { target: "Cancelled", label: "Cancel booking", tone: "danger" },
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

export default function BookingStatusActions({ currentStatus, onAction }: Props) {
    const transitions = TRANSITIONS[currentStatus];
    const [adminNotes, setAdminNotes] = useState("");
    const [submitting, setSubmitting] = useState<AdminBookingStatus | null>(null);

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
                <BookingStatusPill status={currentStatus} size="md" />
            </div>

            {transitions.length === 0 ? (
                <p className="text-sm text-neutral-500">
                    This booking is in a final state. No further actions available.
                </p>
            ) : (
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
        </section>
    );
}