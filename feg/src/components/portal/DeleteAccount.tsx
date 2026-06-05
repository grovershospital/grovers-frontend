import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Clock } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import {
    cancelAccountDeletion,
    fetchAccountDeletionStatus,
    requestAccountDeletion,
    type AccountDeletionStatus,
} from "../../data/portal";

export default function DeleteAccount() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [status, setStatus] = useState<AccountDeletionStatus | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    function loadStatus() {
        fetchAccountDeletionStatus()
            .then(setStatus)
            .catch(() =>
                setLoadError("Could not load deletion status. Please refresh."),
            );
    }

    useEffect(() => {
        loadStatus();
    }, []);

    if (loadError) {
        return (
            <>
                <Hero />
                <p className="text-sm text-brand-red">{loadError}</p>
            </>
        );
    }

    if (!status) {
        return (
            <>
                <Hero />
                <p className="text-sm text-neutral-500">Loading…</p>
            </>
        );
    }

    return (
        <>
            <Hero />
            {status.pending ? (
                <PendingDeletion status={status} onCancelled={loadStatus} />
            ) : (
                <RequestDeletion
                    onRequested={() => {
                        // Brief pause so the user sees the success message,
                        // then log out and bounce to login.
                        setTimeout(() => {
                            logout();
                            navigate("/patient-portal/login", { replace: true });
                        }, 2500);
                    }}
                />
            )}
        </>
    );
}

function Hero() {
    return (
        <div className="mb-12">
            <h1 className="text-3xl font-bold text-brand-red sm:text-4xl">
                Delete Account
            </h1>
            <p className="mt-3 max-w-prose text-brand-ink">
                Deleting your account will permanently remove your Patient Portal access
                and all associated account data. This action cannot be undone after the
                grace period ends. Your clinical records will be retained by Grover's
                Hospital in accordance with Nigerian healthcare regulations.
            </p>
        </div>
    );
}

// ─── Request deletion ────────────────────────────────────────

function RequestDeletion({ onRequested }: { onRequested: () => void }) {
    const [password, setPassword] = useState("");
    const [reason, setReason] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [requested, setRequested] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await requestAccountDeletion(password, reason || undefined);
            setRequested(true);
            onRequested();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Could not submit your request. Please check your password.",
            );
            setSubmitting(false);
        }
    }

    if (requested) {
        return (
            <div className="rounded-2xl border border-brand-green/30 bg-brand-green/5 p-6">
                <p className="text-sm font-semibold text-brand-green">
                    Deletion request submitted.
                </p>
                <p className="mt-2 text-sm text-brand-ink">
                    Your account will be permanently deleted in 30 days. You can cancel
                    this request at any time before then by logging in and visiting this
                    page. Signing you out now…
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
            <div className="grid items-center gap-2 sm:grid-cols-[max-content_1fr] sm:gap-4">
                <label
                    htmlFor="delete-password"
                    className="text-sm font-bold text-brand-ink"
                >
                    Password:
                </label>
                <input
                    id="delete-password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                />
            </div>

            <div>
                <label
                    htmlFor="delete-reason"
                    className="mb-1.5 block text-sm font-bold text-brand-ink"
                >
                    Reason{" "}
                    <span className="font-normal italic text-neutral-500">(optional)</span>
                </label>
                <textarea
                    id="delete-reason"
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Help us understand why you're leaving."
                    className={inputClass}
                />
            </div>

            <button
                type="submit"
                disabled={submitting || !password}
                className="inline-flex items-center justify-center rounded-full bg-brand-red px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red disabled:opacity-60"
            >
                {submitting ? "Submitting…" : "Request account deletion"}
            </button>

            {error && (
                <p className="text-sm text-brand-red" role="alert">
                    {error}
                </p>
            )}
        </form>
    );
}

// ─── Pending deletion ────────────────────────────────────────

function PendingDeletion({
                             status,
                             onCancelled,
                         }: {
    status: AccountDeletionStatus;
    onCancelled: () => void;
}) {
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await cancelAccountDeletion(password);
            setSuccess(true);
            setPassword("");
            onCancelled();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Could not cancel deletion. Please check your password.",
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start gap-3 rounded-2xl border border-brand-red/30 bg-brand-red/5 p-5">
                <Clock
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-red"
                    strokeWidth={2}
                />
                <div className="text-sm text-brand-ink">
                    <p className="font-semibold">Deletion scheduled</p>
                    <p className="mt-1">
                        Your account is scheduled for permanent deletion on{" "}
                        <strong>{status.deletionDate ?? "—"}</strong>. You can cancel
                        this request anytime before then.
                    </p>
                </div>
            </div>

            <p className="text-sm text-brand-ink">
                Changed your mind? Enter your password below to cancel the deletion
                request and keep your account active.
            </p>

            <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
                <div className="grid items-center gap-2 sm:grid-cols-[max-content_1fr] sm:gap-4">
                    <label
                        htmlFor="cancel-password"
                        className="text-sm font-bold text-brand-ink"
                    >
                        Password:
                    </label>
                    <input
                        id="cancel-password"
                        type="password"
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={inputClass}
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting || !password}
                    className="inline-flex items-center justify-center rounded-full bg-brand-green px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green disabled:opacity-60"
                >
                    {submitting ? "Cancelling…" : "Cancel deletion request"}
                </button>

                {error && (
                    <p className="text-sm text-brand-red" role="alert">
                        <AlertCircle className="mr-1.5 inline h-4 w-4" strokeWidth={2} />
                        {error}
                    </p>
                )}
                {success && (
                    <p className="text-sm text-brand-green" role="status">
                        Your account is no longer scheduled for deletion.
                    </p>
                )}
            </form>
        </div>
    );
}

const inputClass =
    "w-full rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue";