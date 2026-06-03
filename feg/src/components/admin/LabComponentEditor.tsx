import { useState } from "react";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import {
    addLabComponent,
    deleteLabComponent,
    updateLabComponent,
    type AdminLabComponent,
    type AdminLabComponentFlag,
    type LabComponentInput,
} from "../../data/admin";

type Props = {
    resultId: string;
    components: AdminLabComponent[];
    onChange: (components: AdminLabComponent[]) => void;
};

const FLAGS: ReadonlyArray<AdminLabComponentFlag> = [
    "Normal",
    "High",
    "Low",
    "Critical low",
    "Critical high",
    "Abnormal",
];

const FLAG_TONE: Record<AdminLabComponentFlag, string> = {
    Normal: "bg-brand-green/10 text-brand-green",
    High: "bg-amber-100 text-amber-700",
    Low: "bg-amber-100 text-amber-700",
    "Critical low": "bg-brand-red/10 text-brand-red",
    "Critical high": "bg-brand-red/10 text-brand-red",
    Abnormal: "bg-brand-red/10 text-brand-red",
};

const EMPTY_INPUT: LabComponentInput = {
    name: "",
    value: "",
    unit: "",
    referenceRange: "",
    flag: "Normal",
};

export default function LabComponentEditor({
                                               resultId,
                                               components,
                                               onChange,
                                           }: Props) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editDraft, setEditDraft] = useState<LabComponentInput>(EMPTY_INPUT);
    const [newDraft, setNewDraft] = useState<LabComponentInput>(EMPTY_INPUT);
    const [adding, setAdding] = useState(false);
    const [busy, setBusy] = useState(false);

    function startEdit(c: AdminLabComponent) {
        setEditingId(c.id);
        setEditDraft({
            name: c.name,
            value: c.value,
            unit: c.unit,
            referenceRange: c.referenceRange,
            flag: c.flag,
        });
    }

    function cancelEdit() {
        setEditingId(null);
    }

    async function saveEdit() {
        if (!editingId) return;
        setBusy(true);
        try {
            const updated = await updateLabComponent(editingId, editDraft);
            onChange(components.map((c) => (c.id === updated.id ? updated : c)));
            setEditingId(null);
        } finally {
            setBusy(false);
        }
    }

    async function removeComponent(c: AdminLabComponent) {
        if (!window.confirm(`Remove "${c.name}"?`)) return;
        const prev = components;
        onChange(components.filter((x) => x.id !== c.id));
        try {
            await deleteLabComponent(c.id);
        } catch {
            onChange(prev);
            window.alert("Could not remove the component. Please try again.");
        }
    }

    async function addNew() {
        if (!newDraft.name.trim()) return;
        setBusy(true);
        try {
            const created = await addLabComponent(resultId, newDraft);
            onChange([...components, created]);
            setNewDraft(EMPTY_INPUT);
            setAdding(false);
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="space-y-3">
            {components.length === 0 && !adding && (
                <p className="text-sm text-neutral-500">
                    No components recorded yet. Add the first row below.
                </p>
            )}

            {components.length > 0 && (
                <div className="overflow-x-auto rounded-2xl border border-neutral-200">
                    <table className="w-full min-w-[700px] border-collapse">
                        <thead className="bg-neutral-50">
                        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            <th className="px-3 py-2">Name</th>
                            <th className="px-3 py-2">Value</th>
                            <th className="px-3 py-2">Unit</th>
                            <th className="px-3 py-2">Reference</th>
                            <th className="px-3 py-2">Flag</th>
                            <th className="px-3 py-2" />
                        </tr>
                        </thead>
                        <tbody>
                        {components.map((c) =>
                            editingId === c.id ? (
                                <EditingRow
                                    key={c.id}
                                    draft={editDraft}
                                    onDraftChange={setEditDraft}
                                    onSave={saveEdit}
                                    onCancel={cancelEdit}
                                    busy={busy}
                                />
                            ) : (
                                <tr key={c.id} className="border-t border-neutral-100 text-sm">
                                    <td className="px-3 py-2 font-semibold text-brand-ink">
                                        {c.name}
                                    </td>
                                    <td className="px-3 py-2 text-brand-ink">{c.value}</td>
                                    <td className="px-3 py-2 text-brand-ink">{c.unit}</td>
                                    <td className="px-3 py-2 text-brand-ink">
                                        {c.referenceRange || "—"}
                                    </td>
                                    <td className="px-3 py-2">
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${FLAG_TONE[c.flag]}`}
                                            >
                                                {c.flag}
                                            </span>
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="flex justify-end gap-1">
                                            <button
                                                type="button"
                                                onClick={() => startEdit(c)}
                                                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-brand-ink"
                                                aria-label={`Edit ${c.name}`}
                                            >
                                                <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeComponent(c)}
                                                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-neutral-500 hover:bg-brand-red/10 hover:text-brand-red"
                                                aria-label={`Delete ${c.name}`}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ),
                        )}

                        {adding && (
                            <EditingRow
                                draft={newDraft}
                                onDraftChange={setNewDraft}
                                onSave={addNew}
                                onCancel={() => {
                                    setAdding(false);
                                    setNewDraft(EMPTY_INPUT);
                                }}
                                busy={busy}
                            />
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            {!adding && (
                <button
                    type="button"
                    onClick={() => setAdding(true)}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-1.5 text-sm font-semibold text-brand-ink hover:bg-neutral-100"
                >
                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                    Add component
                </button>
            )}
        </div>
    );
}

type EditingRowProps = {
    draft: LabComponentInput;
    onDraftChange: (draft: LabComponentInput) => void;
    onSave: () => void;
    onCancel: () => void;
    busy: boolean;
};

function EditingRow({ draft, onDraftChange, onSave, onCancel, busy }: EditingRowProps) {
    function update<K extends keyof LabComponentInput>(
        key: K,
        value: LabComponentInput[K],
    ) {
        onDraftChange({ ...draft, [key]: value });
    }

    return (
        <tr className="border-t border-neutral-100 bg-neutral-50 text-sm">
            <td className="px-3 py-2">
                <input
                    type="text"
                    autoFocus
                    placeholder="Name"
                    value={draft.name}
                    onChange={(e) => update("name", e.target.value)}
                    className={inlineInputClass}
                />
            </td>
            <td className="px-3 py-2">
                <input
                    type="text"
                    placeholder="Value"
                    value={draft.value}
                    onChange={(e) => update("value", e.target.value)}
                    className={inlineInputClass}
                />
            </td>
            <td className="px-3 py-2">
                <input
                    type="text"
                    placeholder="Unit"
                    value={draft.unit}
                    onChange={(e) => update("unit", e.target.value)}
                    className={inlineInputClass}
                />
            </td>
            <td className="px-3 py-2">
                <input
                    type="text"
                    placeholder="Range"
                    value={draft.referenceRange}
                    onChange={(e) => update("referenceRange", e.target.value)}
                    className={inlineInputClass}
                />
            </td>
            <td className="px-3 py-2">
                <select
                    value={draft.flag}
                    onChange={(e) =>
                        update("flag", e.target.value as AdminLabComponentFlag)
                    }
                    className={inlineInputClass}
                >
                    {FLAGS.map((f) => (
                        <option key={f} value={f}>
                            {f}
                        </option>
                    ))}
                </select>
            </td>
            <td className="px-3 py-2">
                <div className="flex justify-end gap-1">
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={busy}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-green text-white hover:bg-brand-blue disabled:opacity-60"
                        aria-label="Save"
                    >
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={busy}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-neutral-200 text-brand-ink hover:bg-neutral-300 disabled:opacity-60"
                        aria-label="Cancel"
                    >
                        <X className="h-3.5 w-3.5" strokeWidth={3} />
                    </button>
                </div>
            </td>
        </tr>
    );
}

const inlineInputClass =
    "w-full rounded-lg border border-neutral-300 bg-white px-2 py-1 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue";