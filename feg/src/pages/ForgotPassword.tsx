import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import FormField from "../ui/FormField";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [sent, setSent] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);

        // TODO (backend): replace with real reset-link request
        //   const res = await fetch("/api/auth/forgot-password", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ email }),
        //   });
        //   if (!res.ok) { /* show error — but be careful: the response should */
        //                  /* not reveal whether the email is registered, to avoid */
        //                  /* user enumeration. Always show the same success state */
        //                  /* whether the email exists or not. */ }
        console.log("Password reset requested for:", email);
        await new Promise((resolve) => setTimeout(resolve, 600));
        setSent(true);
        setSubmitting(false);
    }

    return (
        <section
            id="forgot-password"
            className="bg-[#f9f7f0] py-16 sm:py-20 lg:py-24"
            aria-labelledby="forgot-password-heading"
        >
            <div className="mx-auto w-full max-w-lg px-6">
                <h1
                    id="forgot-password-heading"
                    className="text-center text-3xl font-extrabold text-brand-red sm:text-4xl"
                >
                    Reset Your Password
                </h1>
                <p className="mx-auto mt-5 max-w-md text-center text-sm leading-relaxed text-brand-ink sm:text-base">
                    Enter the email address associated with your account and we will
                    send you a link to reset your password.
                </p>

                {sent ? (
                    // Success state — shows after submission so the user has clear
                    // confirmation. Always shown regardless of whether the email exists,
                    // to avoid leaking which addresses are registered.
                    <div
                        role="status"
                        className="mt-10 rounded-lg border border-brand-green/40 bg-brand-green/5 p-6 text-center"
                    >
                        <p className="text-sm font-medium text-brand-ink sm:text-base">
                            If an account exists for{" "}
                            <span className="font-bold">{email}</span>, a password reset link
                            has been sent. Please check your inbox.
                        </p>
                        <Link
                            to="/patient-portal/login"
                            className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-brand-ink underline underline-offset-2 hover:text-brand-blue"
                        >
                            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                            Back to Log In
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-10 space-y-8">
                        <FormField
                            label="Email Address"
                            id="email"
                            type="email"
                            value={email}
                            onChange={setEmail}
                            placeholder="testname@testemail.com"
                            autoComplete="email"
                            required
                        />

                        {/* Submit + back link inline, centered. flex-wrap stacks them on */}
                        {/* narrow screens where the button + link can't fit side-by-side. */}
                        <div className="flex flex-wrap items-center justify-center gap-6 pt-8">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex items-center justify-center rounded-full bg-brand-green px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
                            >
                                {submitting ? "Sending..." : "Send Reset Link"}
                            </button>

                            <Link
                                to="/patient-portal/login"
                                className="inline-flex items-center gap-2 text-sm font-bold text-brand-ink hover:text-brand-blue"
                            >
                                <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                                Back to Log In
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
}