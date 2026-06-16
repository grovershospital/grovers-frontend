import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import FormField from "../ui/FormField";
import { api, ApiError } from "../lib/api";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token") ?? "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Bail early if there's no token — the user landed here without one.
    useEffect(() => {
        if (!token) {
            setError(
                "This reset link is invalid or incomplete. Please request a new one from the sign-in page.",
            );
        }
    }, [token]);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setSubmitting(true);
        try {
            await api.post(
                "/auth/reset-password",
                { token, newPassword },
                { skipAuth: true },
            );
            toast.success("Password reset. Please sign in with your new password.");
            navigate("/patient-portal/login", { replace: true });
        } catch (err) {
            if (err instanceof ApiError) {
                // Token expired/invalid will typically be 400 or 410.
                setError(
                    err.message ||
                    "This reset link is invalid or has expired. Please request a new one.",
                );
            } else {
                setError("Could not reset your password. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="bg-[#f9f7f0] py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-brand-red sm:text-4xl">
                        Set a new password
                    </h1>
                    <p className="mt-3 text-sm text-brand-ink">
                        Choose a strong password. You'll use it to sign in next time.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <FormField
                        id="rp-new-password"
                        label="New password"
                        type="password"
                        required
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={setNewPassword}
                    />

                    <FormField
                        id="rp-confirm-password"
                        label="Confirm new password"
                        type="password"
                        required
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                    />

                    <p className="text-xs text-neutral-500">
                        At least 8 characters. Mix letters, numbers, and symbols for a
                        stronger password.
                    </p>

                    <button
                        type="submit"
                        disabled={submitting || !token}
                        className="inline-flex w-full items-center justify-center rounded-full bg-brand-green px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green disabled:opacity-60"
                    >
                        {submitting ? "Saving…" : "Set new password"}
                    </button>

                    {error && (
                        <p className="text-sm text-brand-red" role="alert">
                            {error}
                        </p>
                    )}
                </form>

                <p className="mt-8">
                    <Link
                        to="/patient-portal/login"
                        className="text-sm text-brand-ink underline underline-offset-2 hover:no-underline"
                    >
                        ← Back to sign in
                    </Link>
                </p>
            </div>
        </section>
    );
}