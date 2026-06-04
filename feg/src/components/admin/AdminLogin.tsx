import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormField from "../../ui/FormField";
import { useAuth } from "../../contexts/AuthContext";
import { ApiError } from "../../lib/api";

type LocationState = { from?: string } | null;

export default function AdminLogin() {
    const navigate = useNavigate();
    const location = useLocation();
    const { loginAdmin } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await loginAdmin(email, password);
            const state = location.state as LocationState;
            const redirectTo = state?.from ?? "/admin/dashboard";
            navigate(redirectTo, { replace: true });
        } catch (err) {
            if (err instanceof ApiError && err.status === 401) {
                setError("Incorrect email or password.");
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Could not sign in. Please try again.");
            }
            setSubmitting(false);
        }
    }

    return (
        <section className="bg-[#f9f7f0] py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-brand-red sm:text-4xl">Admin Login</h1>
                    <p className="mt-3 text-sm text-brand-ink">
                        Sign in to access the Grover's Hospital admin dashboard.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <FormField
                        id="admin-email"
                        label="Email address"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={setEmail}
                    />

                    <FormField
                        id="admin-password"
                        label="Password"
                        type="password"
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={setPassword}
                    />

                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex w-full items-center justify-center rounded-full bg-brand-ink px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink disabled:opacity-60"
                    >
                        {submitting ? "Signing in…" : "Sign in"}
                    </button>

                    {error && (
                        <p className="text-sm text-brand-red" role="alert">
                            {error}
                        </p>
                    )}
                </form>

                <p className="mt-8 text-sm text-brand-ink">
                    Not an admin?{" "}
                    <Link
                        to="/patient-portal/login"
                        className="font-semibold underline underline-offset-2 hover:no-underline"
                    >
                        Patient login →
                    </Link>
                </p>
            </div>
        </section>
    );
}