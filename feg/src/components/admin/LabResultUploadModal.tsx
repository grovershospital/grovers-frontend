import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Modal from "../../ui/Modal";
import { createAdminLabResult, type LabResultCreateInput } from "../../data/admin";

type Props = {
    open: boolean;
    onClose: () => void;
    patientId: string;
    onCreated: (resultId: string) => void;
};

const EMPTY: LabResultCreateInput = {
    title: "",
    description: "",
    testDate: "",
};

export default function LabResultUploadModal({
                                                 open,
                                                 onClose,
                                                 patientId,
                                                 onCreated,
                                             }: Props) {
    const [form, setForm] = useState<LabResultCreateInput>(EMPTY);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setForm(EMPTY);
            setError(null);
        }
    }, [open]);

    function update<K extends keyof LabResultCreateInput>(
        key: K,
        value: LabResultCreateInput[K],
    ) {
        setForm((f) => ({ ...f, [key]: value }));
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        if (!form.title.trim()) {
            setError("Title is required.");
            return;
        }

        setSubmitting(true);
        try {
            const created = await createAdminLabResult(patientId, form);
            onCreated(created.id);
            onClose();
        } catch {
            setError("Could not create the result. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="New lab result"
            locked={submitting}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-neutral-500">
                    Create the result record first. Add components and attach files in the
                    next step.
                </p>

                <Field label="Title" htmlFor="lr-title" required>
                    <input
                        id="lr-title"
                        type="text"
                        required
                        placeholder="e.g. Annual Wellness Test"
                        value={form.title}
                        onChange={(e) => update("title", e.target.value)}
                        className={inputClass}
                    />
                </Field>

                <Field label="Test date" htmlFor="lr-date">
                    <input
                        id="lr-date"
                        type="text"
                        placeholder="e.g. 12th May 2026"
                        value={form.testDate}
                        onChange={(e) => update("testDate", e.target.value)}
                        className={inputClass}
                    />
                </Field>

                <Field label="Description" htmlFor="lr-description">
                    <textarea
                        id="lr-description"
                        rows={3}
                        placeholder="Brief context about this test."
                        value={form.description}
                        onChange={(e) => update("description", e.target.value)}
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
                        {submitting ? "Creating…" : "Create result"}
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