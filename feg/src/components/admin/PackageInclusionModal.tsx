import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Modal from "../../ui/Modal";
import type {
    AdminPackageInclusion,
    PackageInclusionInput,
} from "../../data/admin";
import {toast} from "sonner";

type Props = {
    open: boolean;
    onClose: () => void;
    inclusion: AdminPackageInclusion | null;
    onSubmit: (input: PackageInclusionInput) => Promise<void>;
    defaultDisplayOrder: number;
};

const EMPTY: PackageInclusionInput = {
    label: "",
    description: "",
    displayOrder: 1,
};

export default function PackageInclusionModal({
                                                  open,
                                                  onClose,
                                                  inclusion,
                                                  onSubmit,
                                                  defaultDisplayOrder,
                                              }: Props) {
    const [form, setForm] = useState<PackageInclusionInput>(EMPTY);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            setForm(
                inclusion
                    ? {
                        label: inclusion.label,
                        description: inclusion.description,
                        displayOrder: inclusion.displayOrder,
                    }
                    : { ...EMPTY, displayOrder: defaultDisplayOrder },
            );
        }
    }, [open, inclusion, defaultDisplayOrder]);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!form.label.trim()) {
            toast.error("Inclusion label is required.");
            return;
        }
        setSubmitting(true);
        try {
            await onSubmit(form);
            onClose();
        } catch {
            toast.error("Could not save the inclusion. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={inclusion ? "Edit inclusion" : "Add inclusion"}
            locked={submitting}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="Label" htmlFor="inc-label" required>
                    <input
                        id="inc-label"
                        type="text"
                        required
                        placeholder="e.g. FBS, Glycated Haemoglobin HBA1c"
                        value={form.label}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, label: e.target.value }))
                        }
                        className={inputClass}
                    />
                </Field>

                <Field label="Description" htmlFor="inc-description">
                    <textarea
                        id="inc-description"
                        rows={3}
                        placeholder="Optional context for what this test or service covers."
                        value={form.description}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, description: e.target.value }))
                        }
                        className={inputClass}
                    />
                </Field>

                <Field label="Display order" htmlFor="inc-order">
                    <input
                        id="inc-order"
                        type="number"
                        min="0"
                        value={form.displayOrder}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                displayOrder: Number(e.target.value),
                            }))
                        }
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
                        {submitting
                            ? "Saving…"
                            : inclusion
                                ? "Save changes"
                                : "Add inclusion"}
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