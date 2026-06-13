import { useEffect, useState } from "react";

type Props = {
    adminNotes: string;
    onSave: (notes: string) => Promise<void>;
};

export default function BookingNotesCard({ adminNotes, onSave }: Props) {
    const [value, setValue] = useState(adminNotes);
    const [saving, setSaving] = useState(false);

    // Re-sync if the parent updates adminNotes (e.g. after a status action
    // also wrote a note via the status endpoint).
    useEffect(() => {
        setValue(adminNotes);
    }, [adminNotes]);

    const dirty = value !== adminNotes;

    async function handleSave() {
        setSaving(true);
        try {
            await onSave(value);
        } catch {
            // Error toast surfaced by parent's onSave catch.
        } finally {
            setSaving(false);
        }
    }

    return (
        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold text-brand-ink">Admin Notes</h2>
            </div>

            <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={5}
                placeholder="Internal notes about this booking — visible to admins only."
                className="block w-full resize-y rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-brand-ink placeholder:text-neutral-400 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
            />

            <div className="mt-4 flex justify-end">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={!dirty || saving}
                    className="inline-flex items-center rounded-md bg-brand-blue px-4 py-2 text-sm font-semibold text-white hover:bg-brand-blue/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {saving ? "Saving…" : "Save notes"}
                </button>
            </div>
        </section>
    );
}