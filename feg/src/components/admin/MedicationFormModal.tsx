import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Modal from "../../ui/Modal";
import type { AdminMedication, MedicationInput } from "../../data/admin";

type Props = {
    open: boolean;
    onClose: () => void;
    /** Pass an existing medication to edit, or null for add. */
    medication: AdminMedication | null;
    onSubmit: (input: MedicationInput) => Promise<void>;
};

const EMPTY: MedicationInput = {
    name: "",
    dosage: "",
    frequency: "",
    startDateIso: "",
    endDateIso: "",
    isActive: true,
    prescribedByText: "",
    notes: "",
};

export default function MedicationFormModal({
                                                open,
                                                onClose,
                                                medication,
                                                onSubmit,
                                            }: Props) {
    const [form, setForm] = useState<MedicationInput>(EMPTY);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setForm(
                medication
                    ? {
                        name: medication.name,
                        dosage: medication.dosage,
                        frequency: medication.frequency,
                        startDateIso: medication.startDateIso,
                        endDateIso: medication.endDateIso,
                        isActive: medication.isActive,
                        prescribedByText: medication.prescribedByText,
                        notes: medication.notes,
                    }
                    : EMPTY,
            );
            setError(null);
        }
    }, [open, medication]);

    function update<K extends keyof MedicationInput>(
        key: K,
        value: MedicationInput[K],
    ) {
        setForm((f) => ({ ...f, [key]: value }));
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        if (!form.name.trim()) {
            setError("Medication name is required.");
            return;
        }
        if (!form.startDateIso) {
            setError("Start date is required.");
            return;
        }
        if (form.endDateIso && form.endDateIso < form.startDateIso) {
            setError("End date can't be before the start date.");
            return;
        }

        setSubmitting(true);
        try {
            await onSubmit(form);
            onClose();
        } catch {
            setError("Could not save the medication. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={medication ? "Edit medication" : "Add medication"}
            locked={submitting}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="Name" htmlFor="med-name" required>
                    <input
                        id="med-name"
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        className={inputClass}
                    />
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Dosage" htmlFor="med-dosage">
                        <input
                            id="med-dosage"
                            type="text"
                            placeholder="e.g. 10mg"
                            value={form.dosage}
                            onChange={(e) => update("dosage", e.target.value)}
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Frequency" htmlFor="med-frequency">
                        <input
                            id="med-frequency"
                            type="text"
                            placeholder="e.g. Twice daily"
                            value={form.frequency}
                            onChange={(e) => update("frequency", e.target.value)}
                            className={inputClass}
                        />
                    </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Start date" htmlFor="med-start" required>
                        <input
                            id="med-start"
                            type="date"
                            required
                            value={form.startDateIso}
                            onChange={(e) => update("startDateIso", e.target.value)}
                            className={inputClass}
                        />
                    </Field>

                    <Field label="End date" htmlFor="med-end">
                        <input
                            id="med-end"
                            type="date"
                            value={form.endDateIso}
                            onChange={(e) => update("endDateIso", e.target.value)}
                            className={inputClass}
                        />
                    </Field>
                </div>

                <label className="flex items-center gap-2 text-sm text-brand-ink">
                    <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(e) => update("isActive", e.target.checked)}
                        className="h-4 w-4 rounded border-neutral-300 text-brand-red focus:ring-brand-blue"
                    />
                    Active — patient is currently taking this medication
                </label>

                <Field label="Prescribed by" htmlFor="med-prescribed">
                    <input
                        id="med-prescribed"
                        type="text"
                        placeholder="Doctor's name (free text for now)"
                        value={form.prescribedByText}
                        onChange={(e) =>
                            update("prescribedByText", e.target.value)
                        }
                        className={inputClass}
                    />
                </Field>

                <Field label="Notes" htmlFor="med-notes">
                    <textarea
                        id="med-notes"
                        rows={3}
                        value={form.notes}
                        onChange={(e) => update("notes", e.target.value)}
                        className={inputClass}
                    />
                </Field>

                {error && (
                    <p className="text-sm text-brand-red" role="alert">
                        {error}
                    </p>
                )}

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
                        {submitting
                            ? "Saving…"
                            : medication
                                ? "Save changes"
                                : "Add medication"}
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