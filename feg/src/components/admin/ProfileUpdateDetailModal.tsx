import { useEffect, useState } from "react";
import { ArrowRight, Info } from "lucide-react";
import Modal from "../../ui/Modal";
import ProfileUpdateStatusPill from "./ProfileUpdateStatusPill";
import {
    approveProfileUpdateRequest,
    fetchProfileUpdateRequest,
    PROFILE_FIELD_LABEL,
    rejectProfileUpdateRequest,
    type ProfileUpdateRequest,
} from "../../data/admin";
import {toast} from "sonner";

type Props = {
    open: boolean;
    onClose: () => void;
    requestId: string | null;
    onDecided: (req: ProfileUpdateRequest) => void;
};

export default function ProfileUpdateDetailModal({
                                                     open,
                                                     onClose,
                                                     requestId,
                                                     onDecided,
                                                 }: Props) {
    const [req, setReq] = useState<ProfileUpdateRequest | null>(null);
    const [response, setResponse] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open && requestId) {
            setReq(null);
            setResponse("");
            setError(null);
            fetchProfileUpdateRequest(requestId)
                .then(setReq)
                .catch(() => setError("Could not load this request."));
        }
    }, [open, requestId]);

    async function handleApprove() {
        if (!req) return;
        setBusy(true);
        setError(null);
        try {
            const updated = await approveProfileUpdateRequest(req.id, response);
            onDecided(updated);
            onClose();
            toast.success("Request approved.")
        } catch {
            toast.error("Could not approve this request. Please try again.");
        } finally {
            setBusy(false);
        }
    }

    async function handleReject() {
        if (!req) return;
        setBusy(true);
        setError(null);
        try {
            const updated = await rejectProfileUpdateRequest(req.id, response);
            onDecided(updated);
            onClose();
            toast.success("Request rejected.")
        } catch {
            toast.error("Could not reject this request. Please try again.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Profile update request"
            locked={busy}
        >
            {!req ? (
                <p className="text-sm text-neutral-500">
                    {error ?? "Loading…"}
                </p>
            ) : (
                <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-neutral-500">
                        <span>
                            From <strong className="text-brand-ink">{req.patientName}</strong>{" "}
                            · {req.submittedAtDisplay}
                        </span>
                        <ProfileUpdateStatusPill status={req.status} />
                    </div>

                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            Field
                        </p>
                        <p className="text-base font-semibold text-brand-ink">
                            {PROFILE_FIELD_LABEL[req.field]}
                        </p>
                    </div>

                    {req.field !== "OTHER" ? (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                    Current
                                </p>
                                <p className="text-sm text-brand-ink">
                                    {req.currentValue || "—"}
                                </p>
                            </div>
                            <ArrowRight
                                className="hidden h-5 w-5 text-neutral-400 sm:block"
                                strokeWidth={2}
                            />
                            <div className="rounded-2xl border border-brand-blue/30 bg-brand-blue/5 p-4">
                                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-blue">
                                    Proposed
                                </p>
                                <p className="text-sm text-brand-ink">
                                    {req.proposedValue}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-brand-blue/30 bg-brand-blue/5 p-4">
                            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-blue">
                                Patient's request
                            </p>
                            <p className="text-sm text-brand-ink">{req.proposedValue}</p>
                        </div>
                    )}

                    {req.patientNote && (
                        <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                Patient's note
                            </p>
                            <p className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm text-brand-ink">
                                {req.patientNote}
                            </p>
                        </div>
                    )}

                    {req.field === "OTHER" && req.status === "Pending" && (
                        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                            <Info
                                className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600"
                                strokeWidth={2}
                            />
                            <p className="text-sm text-brand-ink">
                                "Other" requests can't be auto-applied. Approving marks this
                                handled — make the actual edit on the patient's Health Profile
                                tab.
                            </p>
                        </div>
                    )}

                    {req.status === "Pending" ? (
                        <>
                            <div>
                                <label
                                    htmlFor="admin-response"
                                    className="mb-2 block text-sm font-semibold text-brand-ink"
                                >
                                    Response to patient (optional)
                                </label>
                                <textarea
                                    id="admin-response"
                                    rows={3}
                                    value={response}
                                    onChange={(e) => setResponse(e.target.value)}
                                    placeholder="Visible to the patient with your decision."
                                    className="w-full resize-y rounded-2xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                                />
                            </div>

                            <div className="flex flex-wrap justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleReject}
                                    disabled={busy}
                                    className="inline-flex items-center justify-center rounded-full bg-brand-red px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red disabled:opacity-60"
                                >
                                    {busy ? "Working…" : "Reject"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleApprove}
                                    disabled={busy}
                                    className="inline-flex items-center justify-center rounded-full bg-brand-green px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green disabled:opacity-60"
                                >
                                    {busy ? "Working…" : "Approve"}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                Decision
                            </p>
                            <p className="text-sm text-brand-ink">
                                {req.status} by {req.decidedByName} ·{" "}
                                {req.decidedAtDisplay}
                            </p>
                            {req.adminResponse && (
                                <p className="mt-3 text-sm italic text-neutral-700">
                                    "{req.adminResponse}"
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </Modal>
    );
}