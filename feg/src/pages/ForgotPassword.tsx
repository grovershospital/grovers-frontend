import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import FormField from "../ui/FormField";
import { api } from "../lib/api";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post("/auth/forgot-password", { email }, { skipAuth: true });
        } catch {
            // Intentional: we don't reveal whether the email exists.
            // Backend may or may not 404 on unknown email; we treat both the
            // same as "we've processed your request" to avoid user enumeration.
        }
        setSubmitting(false);
        setSubmitted(true);
    }

    if (submitted) {
        return (
            <section className="bg-[#f9f7f0] py-16 sm:py-20 lg:py-24">
                <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-brand-red sm:text-4xl">
                        Check your email
                    </h1>
                    <p className="mt-3 text-sm text-brand-ink">
                        If an account exists for that email address, you'll receive a
                        password reset link shortly. The link will be valid for the
                        next hour.
                    </p>
                    <p className="mt-6 text-sm text-brand-ink">
                        Didn't receive it? Check your spam folder, or{" "}
                        <button
                            type="button"
                            onClick={() => setSubmitted(false)}
                            className="font-semibold underline underline-offset-2 hover:no-underline"
                        >
                            try a different email
                        </button>
                        .
                    </p>
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

    return (
        <section className="bg-[#f9f7f0] py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-brand-red sm:text-4xl">
                        Reset your password
                    </h1>
                    <p className="mt-3 text-sm text-brand-ink">
                        Enter your email and we'll send you a link to set a new
                        password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <FormField
                        id="fp-email"
                        label="Email address"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={setEmail}
                    />

                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex w-full items-center justify-center rounded-full bg-brand-green px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green disabled:opacity-60"
                    >
                        {submitting ? "Sending…" : "Send reset link"}
                    </button>
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