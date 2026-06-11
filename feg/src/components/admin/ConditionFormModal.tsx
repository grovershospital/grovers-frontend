import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Modal from "../../ui/Modal";
import type {
    AdminCondition,
    ChronicConditionStatus,
    ConditionInput,
} from "../../data/admin";

type Props = {
    open: boolean;
    onClose: () => void;
    condition: AdminCondition | null;
    onSubmit: (input: ConditionInput) => Promise<void>;
};

const STATUSES: ReadonlyArray<ChronicConditionStatus> = [
    "Active",
    "Managed",
    "In remission",
];

const EMPTY: ConditionInput = {
    name: "",
    diagnosedDateIso: "",
    status: "Active",
    managingDoctorText: "",
    notes: "",
};

export default function ConditionFormModal({
                                               open,
                                               onClose,
                                               condition,
                                               onSubmit,
                                           }: Props) {
    const [form, setForm] = useState<ConditionInput>(EMPTY);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setForm(
                condition
                    ? {
                        name: condition.name,
                        diagnosedDateIso: condition.diagnosedDate,
                        status: condition.status,
                        managingDoctorText: condition.managingDoctorText,
                        notes: condition.notes,
                    }
                    : EMPTY,
            );
            setError(null);
        }
    }, [open, condition]);

    function update<K extends keyof ConditionInput>(
        key: K,
        value: ConditionInput[K],
    ) {
        setForm((f) => ({ ...f, [key]: value }));
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        if (!form.name.trim()) {
            setError("Condition name is required.");
            return;
        }

        setSubmitting(true);
        try {
            await onSubmit(form);
            onClose();
        } catch {
            setError("Could not save the condition. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={condition ? "Edit condition" : "Add condition"}
            locked={submitting}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="Name" htmlFor="cond-name" required>
                    <input
                        id="cond-name"
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        className={inputClass}
                    />
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Diagnosed" htmlFor="cond-diagnosed">
                        <input
                            id="cond-diagnosed"
                            type="date"
                            value={form.diagnosedDateIso}
                            onChange={(e) =>
                                update("diagnosedDateIso", e.target.value)
                            }
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Status" htmlFor="cond-status">
                        <select
                            id="cond-status"
                            value={form.status}
                            onChange={(e) =>
                                update(
                                    "status",
                                    e.target.value as ChronicConditionStatus,
                                )
                            }
                            className={inputClass}
                        >
                            {STATUSES.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </Field>
                </div>

                <Field label="Managing doctor" htmlFor="cond-doctor">
                    <input
                        id="cond-doctor"
                        type="text"
                        placeholder="Doctor's name (free text for now)"
                        value={form.managingDoctorText}
                        onChange={(e) =>
                            update("managingDoctorText", e.target.value)
                        }
                        className={inputClass}
                    />
                </Field>

                <Field label="Notes" htmlFor="cond-notes">
                    <textarea
                        id="cond-notes"
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
                            : condition
                                ? "Save changes"
                                : "Add condition"}
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