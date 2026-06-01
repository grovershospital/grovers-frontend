import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import FormField from "../ui/FormField";

export default function Signup() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        // JS-level validation for things HTML5 can't do.
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (!agreed) {
            setError(
                "You must agree to the Privacy Policy and Terms of Use to continue.",
            );
            return;
        }

        setSubmitting(true);

        // TODO (backend): replace with real signup call
        //   const res = await fetch("/api/auth/signup", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ firstName, lastName, email, phone, password }),
        //   });
        //   if (!res.ok) { /* show error */ }
        //   const { token } = await res.json();
        //   // store token, navigate to portal home or email verification page
        console.log("Signup attempt:", { firstName, lastName, email, phone });
        await new Promise((resolve) => setTimeout(resolve, 600));
        alert(
            "Signup submitted! Backend integration pending — wire this up in handleSubmit.",
        );
        setSubmitting(false);
    }

    return (
        <section
            id="signup"
            className="bg-[#f9f7f0] py-16 sm:py-20 lg:py-24"
            aria-labelledby="signup-heading"
        >
            <div className="mx-auto w-full max-w-lg px-6">
                <h1
                    id="signup-heading"
                    className="text-center text-3xl font-extrabold text-brand-red sm:text-4xl"
                >
                    Create Your Account
                </h1>

                <form onSubmit={handleSubmit} className="mt-10 space-y-5">
                    <FormField
                        label="First Name"
                        id="firstName"
                        value={firstName}
                        onChange={setFirstName}
                        autoComplete="given-name"
                        required
                    />
                    <FormField
                        label="Last Name"
                        id="lastName"
                        value={lastName}
                        onChange={setLastName}
                        autoComplete="family-name"
                        required
                    />
                    <FormField
                        label="Email Address"
                        id="email"
                        type="email"
                        value={email}
                        onChange={setEmail}
                        autoComplete="email"
                        required
                    />
                    <FormField
                        label="Phone Number"
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={setPhone}
                        placeholder="+234..."
                        autoComplete="tel"
                        required
                    />
                    <FormField
                        label="Password"
                        id="password"
                        type="password"
                        value={password}
                        onChange={setPassword}
                        autoComplete="new-password"
                        required
                        minLength={8}
                    />
                    <FormField
                        label="Confirm Password"
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        autoComplete="new-password"
                        required
                        minLength={8}
                    />

                    {/* Terms checkbox — native input styled minimally. Custom checkbox */}
                    {/* designs are possible with peer-checked pseudoclasses, but the */}
                    {/* native one is accessible by default and matches the design. */}
                    <label className="flex items-start gap-2 pt-2 text-xs leading-relaxed text-brand-ink">
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-brand-green"
                            required
                        />
                        <span>
              By creating an account you agree to our{" "}
                            <Link
                                to="/privacy"
                                className="underline underline-offset-2 hover:text-brand-blue"
                            >
                Privacy Policy
              </Link>{" "}
                            and{" "}
                            <Link
                                to="/terms"
                                className="underline underline-offset-2 hover:text-brand-blue"
                            >
                Terms of Use
              </Link>
              .
            </span>
                    </label>

                    {/* Validation error message — appears above the submit button */}
                    {/* when a JS-level check (password match, agreement) fails. */}
                    {error && (
                        <p
                            role="alert"
                            className="text-center text-sm font-medium text-brand-red"
                        >
                            {error}
                        </p>
                    )}

                    <div className="flex flex-col items-center pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex w-full max-w-sm items-center justify-center rounded-full bg-brand-green px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
                        >
                            {submitting ? "Creating account..." : "Sign Up"}
                        </button>

                        <p className="mt-4 text-xs text-brand-ink">
                            Already have an account?{" "}
                            <Link
                                to="/patient-portal/login"
                                className="underline underline-offset-2 hover:text-brand-blue"
                            >
                                Log-in here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </section>
    );
}