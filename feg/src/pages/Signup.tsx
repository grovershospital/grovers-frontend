import { useState } from "react";
import type { FormEvent } from "react";
import { Link} from "react-router-dom";
import FormField from "../ui/FormField";
import { api, ApiError, tokenStore } from "../lib/api";
import { decodeJwtPayload } from "../lib/jwt";

type SignupResponse = {
    accessToken: string;
    refreshToken: string;
};

export default function Signup() {

    // We don't have a `setUser` exposed from the context (intentionally — login flows
    // through the context's loginPatient method). For signup → auto-login, we hit the
    // signup endpoint directly and then trigger a fresh login via the same flow.

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (!acceptedTerms) {
            setError("Please accept the terms to continue.");
            return;
        }

        setSubmitting(true);
        try {
            const data = await api.post<SignupResponse>(
                "/auth/register",
                {
                    firstName,
                    lastName,
                    email,
                    phone,
                    dateOfBirth,
                    password,
                },
                { skipAuth: true },
            );

            // Auto-login with the tokens the signup endpoint returned.
            const payload = decodeJwtPayload(data.accessToken);
            if (payload?.role !== "PATIENT") {
                // Wrong role somehow — bail out and let user sign in manually.
                throw new Error("Unexpected token role. Please sign in.");
            }
            tokenStore.set(data.accessToken, data.refreshToken);
            // Force a fresh read of the token in AuthContext by triggering a route
            // change. Cleanest path is reload — alternative is exposing a manual
            // hydrate method on the context.
            window.location.replace("/patient-portal/dashboard");
        } catch (err) {
            if (err instanceof ApiError && err.status === 409) {
                setError("An account with this email already exists.");
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Could not create your account. Please try again.");
            }
            setSubmitting(false);
        }
    }

    return (
        <section className="bg-[#f9f7f0] py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-brand-red sm:text-4xl">
                        Create your account
                    </h1>
                    <p className="mt-3 text-sm text-brand-ink">
                        Sign up to book appointments, view results and message our team.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <FormField
                            id="su-first"
                            label="First name"
                            type="text"
                            required
                            autoComplete="given-name"
                            value={firstName}
                            onChange={setFirstName}
                        />
                        <FormField
                            id="su-last"
                            label="Last name"
                            type="text"
                            required
                            autoComplete="family-name"
                            value={lastName}
                            onChange={ setLastName}
                        />
                    </div>

                    <FormField
                        id="su-email"
                        label="Email address"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={setEmail}
                    />

                    <FormField
                        id="su-phone"
                        label="Phone number"
                        type="tel"
                        required
                        autoComplete="tel"
                        value={phone}
                        onChange={setPhone}
                    />

                    <FormField
                        id="su-dob"
                        label="Date of birth"
                        type="date"
                        required
                        autoComplete="bday"
                        value={dateOfBirth}
                        onChange={ setDateOfBirth}
                    />

                    <FormField
                        id="su-password"
                        label="Password"
                        type="password"
                        required
                        autoComplete="new-password"
                        value={password}
                        onChange={setPassword}
                    />

                    <FormField
                        id="su-confirm"
                        label="Confirm password"
                        type="password"
                        required
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={ setConfirmPassword}
                    />

                    <label className="flex items-start gap-3 text-sm">
                        <input
                            type="checkbox"
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                            className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-brand-red focus:ring-brand-blue"
                            required
                        />
                        <span className="text-brand-ink">
                            I accept the{" "}
                            <Link
                                to="/terms"
                                className="font-semibold underline underline-offset-2 hover:no-underline"
                            >
                                terms of use
                            </Link>{" "}
                            and{" "}
                            <Link
                                to="/privacy"
                                className="font-semibold underline underline-offset-2 hover:no-underline"
                            >
                                privacy policy
                            </Link>
                            .
                        </span>
                    </label>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex w-full items-center cursor-pointer justify-center rounded-full bg-brand-green px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green disabled:opacity-60"
                    >
                        {submitting ? "Creating account…" : "Create account"}
                    </button>

                    {error && (
                        <p className="text-sm text-brand-red" role="alert">
                            {error}
                        </p>
                    )}
                </form>

                <p className="mt-8 text-sm text-brand-ink">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-semibold underline underline-offset-2 hover:no-underline"
                    >
                        Sign in →
                    </Link>
                </p>
            </div>
        </section>
    );
}