import {useState} from "react";
import type {FormEvent} from "react";
import {useNavigate} from "react-router-dom";
import {deleteAccount} from "../../data/portal";

export default function DeleteAccount() {
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await deleteAccount(password);
            // TODO (backend): clear auth state here too once auth is wired up.
            navigate("/");
        } catch {
            setError(
                "Could not delete your account. Please check your password and try again.",
            );
            setSubmitting(false);
        }
    }

    return (
        <>
            <div className="mb-12">
                <h1 className="text-3xl font-bold text-brand-red sm:text-4xl">Delete Account</h1>
                <p className="mt-3 max-w-prose text-brand-ink">
                    Deleting your account will permanently remove your Patient Portal access and
                    all associated account data. This action cannot be undone. Your clinical
                    records will be retained by Grover's Hospital in accordance with Nigerian
                    healthcare regulations.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
                <div className="grid items-center gap-2 sm:grid-cols-[max-content_1fr] sm:gap-4">
                    <label htmlFor="delete-password" className="text-sm font-bold text-brand-ink">
                        Password:
                    </label>
                    <input
                        id="delete-password"
                        type="password"
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting || !password}
                    className="inline-flex items-center justify-center rounded-full bg-brand-red px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red disabled:opacity-60"
                >
                    {submitting ? "Deleting…" : "Delete my account"}
                </button>

                {error && (
                    <p className="text-sm text-brand-red" role="alert">
                        {error}
                    </p>
                )}
            </form>
        </>
    );
}