import { useState } from "react";
import type { FormEvent } from "react";
import { Star } from "lucide-react";
import {
    CONTACT_METHODS,
    DEPARTMENTS,
    FEEDBACK_TYPES,
    submitFeedback,
    type ContactMethod,
    type FeedbackType,
} from "../../data/portal";

const MAX_MESSAGE_LENGTH = 500;

export default function FeedbackForm() {
    const [type, setType] = useState<FeedbackType | "">("");
    const [message, setMessage] = useState("");
    const [department, setDepartment] = useState("");
    const [wantsResponse, setWantsResponse] = useState<"" | "yes" | "no">("");
    const [contactMethod, setContactMethod] = useState<ContactMethod>("None");
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const displayRating = hoverRating || rating;

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!type || !department || !wantsResponse) {
            setError("Please fill out all required fields.");
            return;
        }
        if (rating === 0) {
            setError("Please rate your experience.");
            return;
        }

        setSubmitting(true);
        try {
            await submitFeedback({
                type,
                message,
                department,
                wantsResponse: wantsResponse === "yes",
                contactMethod,
                rating,
            });
            setSuccess(true);
            setType("");
            setMessage("");
            setDepartment("");
            setWantsResponse("");
            setContactMethod("None");
            setRating(0);
        } catch {
            setError("Could not submit your feedback. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section>
            <h2 className="mb-2 text-2xl font-bold text-brand-ink">Share Your Experience</h2>
            <p className="mb-8 max-w-prose text-sm text-brand-ink">
                Whether your visit went exceptionally well or there is something we could have
                done better, we want to hear about it. All feedback is reviewed by our management
                team.
            </p>

            <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
                <div>
                    <label
                        htmlFor="fb-type"
                        className="mb-2 block text-sm font-semibold text-brand-ink"
                    >
                        Type of feedback
                    </label>
                    <select
                        id="fb-type"
                        required
                        value={type}
                        onChange={(e) => setType(e.target.value as FeedbackType)}
                        className="w-full rounded-full border border-neutral-300 bg-white px-4 py-2.5 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    >
                        <option value="" disabled>
                            Select a type
                        </option>
                        {FEEDBACK_TYPES.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="fb-message"
                        className="mb-2 block text-sm font-semibold text-brand-ink"
                    >
                        Your Feedback
                    </label>
                    <textarea
                        id="fb-message"
                        required
                        maxLength={MAX_MESSAGE_LENGTH}
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us what's on your mind"
                        className="w-full resize-y rounded-2xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                    <p className="mt-1 text-xs text-neutral-500">
                        {message.length} / {MAX_MESSAGE_LENGTH} characters
                    </p>
                </div>

                <div>
                    <label
                        htmlFor="fb-department"
                        className="mb-2 block text-sm font-semibold text-brand-ink"
                    >
                        Department
                    </label>
                    <select
                        id="fb-department"
                        required
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full rounded-full border border-neutral-300 bg-white px-4 py-2.5 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    >
                        <option value="" disabled>
                            Select a department
                        </option>
                        {DEPARTMENTS.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="fb-response"
                        className="mb-2 block text-sm font-semibold text-brand-ink"
                    >
                        Would you like a response from our team?
                    </label>
                    <select
                        id="fb-response"
                        required
                        value={wantsResponse}
                        onChange={(e) => setWantsResponse(e.target.value as "yes" | "no")}
                        className="w-full rounded-full border border-neutral-300 bg-white px-4 py-2.5 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    >
                        <option value="" disabled>
                            Choose one
                        </option>
                        <option value="yes">Yes, please contact me</option>
                        <option value="no">No, this is anonymous</option>
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="fb-contact"
                        className="mb-2 block text-sm font-semibold text-brand-ink"
                    >
                        How would you like to be contacted?
                    </label>
                    <select
                        id="fb-contact"
                        value={contactMethod}
                        onChange={(e) => setContactMethod(e.target.value as ContactMethod)}
                        disabled={wantsResponse !== "yes"}
                        className="w-full rounded-full border border-neutral-300 bg-white px-4 py-2.5 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400"
                    >
                        {CONTACT_METHODS.map((m) => (
                            <option key={m} value={m}>
                                {m}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <p className="mb-2 text-sm font-semibold text-brand-ink">
                        How would you rate your experience?
                    </p>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((n) => (
                            <button
                                key={n}
                                type="button"
                                onClick={() => setRating(n)}
                                onMouseEnter={() => setHoverRating(n)}
                                onMouseLeave={() => setHoverRating(0)}
                                className={`transition-colors ${
                                    n <= displayRating ? "text-amber-400" : "text-neutral-300"
                                }`}
                                aria-label={`Rate ${n} star${n === 1 ? "" : "s"}`}
                            >
                                <Star
                                    className="h-10 w-10"
                                    fill={n <= displayRating ? "currentColor" : "none"}
                                    strokeWidth={1.5}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center justify-center rounded-full bg-brand-red px-10 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red disabled:opacity-60"
                    >
                        {submitting ? "Submitting…" : "Submit Feedback"}
                    </button>
                </div>

                {error && (
                    <p className="text-sm text-brand-red" role="alert">
                        {error}
                    </p>
                )}
                {success && (
                    <p className="text-sm text-brand-green" role="status">
                        Thank you for your feedback. Our management team will review it.
                    </p>
                )}
            </form>
        </section>
    );
}