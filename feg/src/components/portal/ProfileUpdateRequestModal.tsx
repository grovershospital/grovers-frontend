import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Modal from "../../ui/Modal";
import {
    createProfileUpdateRequest,
    PROFILE_UPDATE_FIELD_LABEL,
    type PortalProfileUpdateRequest,
    type ProfileUpdateField,
} from "../../data/portal";
import {toast} from "sonner";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmitted: (request: PortalProfileUpdateRequest) => void;
};

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const GENOTYPES = ["AA", "AS", "AC", "SS", "SC"];

const FIELDS: ReadonlyArray<ProfileUpdateField> = [
    "BLOOD_GROUP",
    "GENOTYPE",
    "ALLERGIES",
    "OTHER",
];

export default function ProfileUpdateRequestModal({
                                                      open,
                                                      onClose,
                                                      onSubmitted,
                                                  }: Props) {
    const [field, setField] = useState<ProfileUpdateField>("BLOOD_GROUP");
    const [otherDescription, setOtherDescription] = useState("");
    const [proposedValue, setProposedValue] = useState("");
    const [patientNote, setPatientNote] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            setField("BLOOD_GROUP");
            setOtherDescription("");
            setProposedValue("");
            setPatientNote("");
        }
    }, [open]);

    // Reset the proposed value when switching fields, since the input type
    // changes (dropdown vs textarea) and the previous value is rarely valid
    // in the new context.
    useEffect(() => {
        setProposedValue("");
    }, [field]);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!proposedValue.trim()) {
            toast.error("Please enter the new value you're proposing.");
            return;
        }
        if (field === "OTHER" && !otherDescription.trim()) {
            toast.error("Please describe what you'd like to change.");
            return;
        }

        setSubmitting(true);
        try {
            const created = await createProfileUpdateRequest({
                targetField: field,
                otherFieldDescription:
                    field === "OTHER" ? otherDescription : undefined,
                proposedValue,
                patientNote: patientNote || undefined,
            });
            onSubmitted(created);
            onClose();
            toast.success("Request submitted. We'll review it soon.")
        } catch (err) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Could not submit the request. Please try again.",
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Request a change"
            locked={submitting}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-neutral-500">
                    Our team reviews requests to clinical fields before they're applied.
                    You'll get a notification once a decision is made.
                </p>

                <Field label="What would you like to change?" htmlFor="pur-field">
                    <select
                        id="pur-field"
                        value={field}
                        onChange={(e) =>
                            setField(e.target.value as ProfileUpdateField)
                        }
                        className={inputClass}
                    >
                        {FIELDS.map((f) => (
                            <option key={f} value={f}>
                                {PROFILE_UPDATE_FIELD_LABEL[f]}
                            </option>
                        ))}
                    </select>
                </Field>

                {field === "OTHER" && (
                    <Field
                        label="Field description"
                        htmlFor="pur-other-description"
                        required
                    >
                        <input
                            id="pur-other-description"
                            type="text"
                            value={otherDescription}
                            onChange={(e) => setOtherDescription(e.target.value)}
                            placeholder="e.g. Emergency contact phone number"
                            className={inputClass}
                        />
                    </Field>
                )}

                <Field
                    label={
                        field === "OTHER" ? "Change details" : "New value"
                    }
                    htmlFor="pur-proposed"
                    required
                >
                    {field === "BLOOD_GROUP" ? (
                        <select
                            id="pur-proposed"
                            value={proposedValue}
                            onChange={(e) => setProposedValue(e.target.value)}
                            className={inputClass}
                        >
                            <option value="">Choose…</option>
                            {BLOOD_GROUPS.map((g) => (
                                <option key={g} value={g}>
                                    {g}
                                </option>
                            ))}
                        </select>
                    ) : field === "GENOTYPE" ? (
                        <select
                            id="pur-proposed"
                            value={proposedValue}
                            onChange={(e) => setProposedValue(e.target.value)}
                            className={inputClass}
                        >
                            <option value="">Choose…</option>
                            {GENOTYPES.map((g) => (
                                <option key={g} value={g}>
                                    {g}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <textarea
                            id="pur-proposed"
                            rows={field === "OTHER" ? 4 : 3}
                            value={proposedValue}
                            onChange={(e) => setProposedValue(e.target.value)}
                            placeholder={
                                field === "ALLERGIES"
                                    ? "List any known allergies — medications, foods, environmental."
                                    : "Describe the change you're requesting."
                            }
                            className={inputClass}
                        />
                    )}
                </Field>

                <Field label="Note to admin (optional)" htmlFor="pur-note">
                    <textarea
                        id="pur-note"
                        rows={3}
                        value={patientNote}
                        onChange={(e) => setPatientNote(e.target.value)}
                        placeholder="Any context that'll help the admin decide — e.g. a recent test result."
                        className={inputClass}
                    />
                </Field>
                <div className="flex flex-wrap justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-6 py-2 text-sm font-semibold text-brand-ink transition-colors hover:bg-neutral-100 disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center justify-center rounded-full bg-brand-red px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red disabled:opacity-60"
                    >
                        {submitting ? "Submitting…" : "Submit request"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

const inputClass =
    "w-full rounded-2xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue";

function Field({
                   label,
                   htmlFor,
                   required,
                   children,
               }: {
    label: string;
    htmlFor: string;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label
                htmlFor={htmlFor}
                className="mb-1.5 block text-sm font-semibold text-brand-ink"
            >
                {label}
                {required && <span className="ml-1 text-brand-red">*</span>}
            </label>
            {children}
        </div>
    );
}