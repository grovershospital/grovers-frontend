import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import FormField from "../ui/FormField";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);

        // TODO (backend): replace with real auth call
        //   const res = await fetch("/api/auth/login", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ email, password }),
        //   });
        //   if (!res.ok) { /* show error */ }
        //   const { token } = await res.json();
        //   // store token, navigate to portal home
        console.log("Login attempt:", { email });
        await new Promise((resolve) => setTimeout(resolve, 600));
        alert(
            "Login submitted! Backend integration pending — wire this up in handleSubmit.",
        );
        setSubmitting(false);
    }

    return (
        <section
            id="login"
            className="bg-[#f9f7f0] py-16 sm:py-20 lg:py-24"
            aria-labelledby="login-heading"
        >
            <div className="mx-auto w-full max-w-lg px-6">
                <h1
                    id="login-heading"
                    className="text-center text-3xl font-extrabold text-brand-red sm:text-4xl"
                >
                    Welcome Back!
                </h1>

                <form onSubmit={handleSubmit} className="mt-10 space-y-6" noValidate={false}>
                    <FormField
                        label="Email Address"
                        id="email"
                        type="email"
                        value={email}
                        onChange={setEmail}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                    />

                    <div>
                        <FormField
                            label="Password"
                            id="password"
                            type="password"
                            value={password}
                            onChange={setPassword}
                            autoComplete="current-password"
                            required
                            minLength={8}
                        />
                        <Link
                            to="/patient-portal/forgot-password"
                            className="mt-2 inline-block text-xs text-brand-red underline underline-offset-2 hover:text-brand-red/80"
                        >
                            Forgot your password?
                        </Link>
                    </div>

                    {/* Submit button — inline because the existing Button component */}
                    {/* renders as <Link>/<a>, not <button type="submit">. Same green */}
                    {/* pill styling as Button variant="green" for visual consistency. */}
                    <div className="flex flex-col items-center pt-6">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex w-full max-w-sm items-center justify-center rounded-full bg-brand-green px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
                        >
                            {submitting ? "Logging in..." : "Login"}
                        </button>

                        <p className="mt-4 text-xs text-brand-ink">
                            Don't have an account?{" "}
                            <Link
                                to="/patient-portal/signup"
                                className="underline underline-offset-2 hover:text-brand-blue"
                            >
                                Signup here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </section>
    );
}