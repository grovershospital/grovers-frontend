import {useState} from "react";
import type {FormEvent} from "react";
import {updateContactDetails, type PortalProfile} from "../../data/portal";
import {toast} from "sonner";

type Props = {
    profile: PortalProfile;
    onUpdated: (updated: PortalProfile) => void;
};

export default function ContactDetailsForm({profile, onUpdated}: Props) {
    const [email, setEmail] = useState(profile.email);
    const [phone, setPhone] = useState(profile.phone);
    const [whatsapp, setWhatsapp] = useState(profile.whatsapp);

    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);
        try {
            const updated = await updateContactDetails({email, phone, whatsapp});
            onUpdated(updated);
            toast.success("Contact saved.");
        } catch {
            toast.error("Could not save your changes. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="mb-12">
            <h2 className="mb-2 text-2xl font-bold text-brand-ink">Contact Details</h2>
            <p className="mb-6 max-w-prose text-sm text-brand-ink">
                These are the contact details we use to reach you for appointments, results and
                notifications. Keep them up to date to ensure you never miss an important update.
            </p>

            <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
                <Row label="Email address:" htmlFor="contact-email">
                    <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                </Row>

                <Row label="Phone Number:" htmlFor="contact-phone">
                    <input
                        id="contact-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                </Row>

                <Row label="Whatsapp:" htmlFor="contact-whatsapp">
                    <input
                        id="contact-whatsapp"
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                </Row>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center justify-center rounded-full bg-brand-red px-10 py-3 text-sm cursor-pointer font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red disabled:opacity-60"
                    >
                        {submitting ? "Saving…" : "Save Changes"}
                    </button>
                </div>
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