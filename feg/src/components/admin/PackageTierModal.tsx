import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Modal from "../../ui/Modal";
import type { AdminPackageTier, PackageTierInput } from "../../data/admin";

type Props = {
    open: boolean;
    onClose: () => void;
    tier: AdminPackageTier | null;
    onSubmit: (input: PackageTierInput) => Promise<void>;
    defaultDisplayOrder: number;
};

const EMPTY: PackageTierInput = {
    name: "",
    priceMale: 0,
    priceFemale: 0,
    notes: "",
    displayOrder: 1,
    isActive: true,
};

export default function PackageTierModal({
                                             open,
                                             onClose,
                                             tier,
                                             onSubmit,
                                             defaultDisplayOrder,
                                         }: Props) {
    const [form, setForm] = useState<PackageTierInput>(EMPTY);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setForm(
                tier
                    ? {
                        name: tier.name,
                        priceMale: tier.priceMale,
                        priceFemale: tier.priceFemale,
                        notes: tier.notes,
                        displayOrder: tier.displayOrder,
                        isActive: true,
                    }
                    : { ...EMPTY, displayOrder: defaultDisplayOrder },
            );
            setError(null);
        }
    }, [open, tier, defaultDisplayOrder]);

    function update<K extends keyof PackageTierInput>(
        key: K,
        value: PackageTierInput[K],
    ) {
        setForm((f) => ({ ...f, [key]: value }));
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        if (!form.name.trim()) {
            setError("Tier name is required.");
            return;
        }
        setSubmitting(true);
        try {
            await onSubmit(form);
            onClose();
        } catch {
            setError("Could not save the tier. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={tier ? "Edit tier" : "Add tier"}
            locked={submitting}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="Name" htmlFor="tier-name" required>
                    <input
                        id="tier-name"
                        type="text"
                        required
                        placeholder="e.g. Basic, Standard, Deluxe"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        className={inputClass}
                    />
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Price (Male)" htmlFor="tier-price-m" required>
                        <input
                            id="tier-price-m"
                            type="number"
                            min="0"
                            step="100"
                            required
                            value={form.priceMale}
                            onChange={(e) =>
                                update("priceMale", Number(e.target.value))
                            }
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Price (Female)" htmlFor="tier-price-f" required>
                        <input
                            id="tier-price-f"
                            type="number"
                            min="0"
                            step="100"
                            required
                            value={form.priceFemale}
                            onChange={(e) =>
                                update("priceFemale", Number(e.target.value))
                            }
                            className={inputClass}
                        />
                    </Field>
                </div>

                <Field label="Display order" htmlFor="tier-order">
                    <input
                        id="tier-order"
                        type="number"
                        min="0"
                        value={form.displayOrder}
                        onChange={(e) =>
                            update("displayOrder", Number(e.target.value))
                        }
                        className={inputClass}
                    />
                </Field>

                <Field label="Notes" htmlFor="tier-notes">
                    <textarea
                        id="tier-notes"
                        rows={2}
                        placeholder="Optional sub-line shown beneath the price."
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
                        {submitting ? "Saving…" : tier ? "Save changes" : "Add tier"}
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