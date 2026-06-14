import {useState} from "react";
import type {FormEvent} from "react";
import {updatePassword} from "../../data/portal";
import {toast} from "sonner";

export default function ChangePasswordForm() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (newPassword.length < 8) {
            setError("New password must be at least 8 characters.");
            return;
        }
        if (!/\d/.test(newPassword)) {
            setError("New password must include at least one number.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("New password and confirmation do not match.");
            return;
        }

        setSubmitting(true);
        try {
            await updatePassword({currentPassword, newPassword});
            toast.success("Password changed")
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch {
            toast.error("Could not update your password. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="mb-12">
            <h2 className="mb-2 text-2xl font-bold text-brand-ink">Change Password</h2>
            <p className="mb-6 max-w-prose text-sm text-brand-ink">
                Your password must be at least 8 characters and include at least one number.
            </p>

            <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
                <Row label="Current Password:" htmlFor="pw-current">
                    <input
                        id="pw-current"
                        type="password"
                        required
                        autoComplete="current-password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full rounded-md border-1 border-neutral-300 bg-white px-4 py-2 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                </Row>

                <Row label="New Password:" htmlFor="pw-new">
                    <input
                        id="pw-new"
                        type="password"
                        required
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full rounded-md border-1 border-neutral-300 bg-white px-4 py-2 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                </Row>

                <Row label="Confirm Password:" htmlFor="pw-confirm">
                    <input
                        id="pw-confirm"
                        type="password"
                        required
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                </Row>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center justify-center cursor-pointer rounded-full bg-brand-red px-10 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red disabled:opacity-60"
                    >
                        {submitting ? "Updating…" : "Update Password"}
                    </button>
                </div>

                {error && (
                    <p className="text-sm text-brand-red" role="alert">
                        {error}
                    </p>
                )}
                {success && (
                    <p className="text-sm text-brand-green" role="status">
                        Your password has been updated.
                    </p>
                )}
            </form>
        </section>
    );
}

function Row({
                 label,
                 htmlFor,
                 children,
             }: {
    label: string;
    htmlFor: string;
    children: React.ReactNode;
}) {
    return (
        <div className="grid items-center gap-2 sm:grid-cols-[max-content_1fr] sm:gap-4">
            <label htmlFor={htmlFor} className="text-sm font-bold text-brand-ink">
                {label}
            </label>
            {children}
        </div>
    );
}