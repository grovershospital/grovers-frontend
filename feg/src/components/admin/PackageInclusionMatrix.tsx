import { useEffect, useMemo, useState } from "react";
import { Check, HelpCircle, X } from "lucide-react";
import type {
    AdminPackageCell,
    AdminPackageInclusion,
    AdminPackageTier,
    InclusionStatus,
} from "../../data/admin";
import {toast} from "sonner";

type Props = {
    tiers: AdminPackageTier[];
    inclusions: AdminPackageInclusion[];
    initialCells: AdminPackageCell[];
    onSave: (cells: AdminPackageCell[]) => Promise<void>;
};

function cellKey(tierId: string, inclusionId: string): string {
    return `${tierId}::${inclusionId}`;
}

function nextStatus(s: InclusionStatus): InclusionStatus {
    if (s === "INCLUDED") return "EXCLUDED";
    if (s === "EXCLUDED") return "CONDITIONAL";
    return "INCLUDED";
}

export default function PackageInclusionMatrix({
                                                   tiers,
                                                   inclusions,
                                                   initialCells,
                                                   onSave,
                                               }: Props) {
    // Map of "tierId::inclusionId" → cell. Densify so every (tier, inclusion)
    // pair has a value, defaulting to EXCLUDED for missing cells.
    const [cellMap, setCellMap] = useState<Record<string, AdminPackageCell>>({});
    const [originalKey, setOriginalKey] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const next: Record<string, AdminPackageCell> = {};
        for (const t of tiers) {
            for (const i of inclusions) {
                const k = cellKey(t.id, i.id);
                next[k] = {
                    tierId: t.id,
                    inclusionId: i.id,
                    status: "EXCLUDED",
                    note: "",
                };
            }
        }
        for (const c of initialCells) {
            const k = cellKey(c.tierId, c.inclusionId);
            if (k in next) next[k] = c;
        }
        setCellMap(next);
        setOriginalKey(JSON.stringify(next));
    }, [tiers, inclusions, initialCells]);

    const dirty = useMemo(
        () => JSON.stringify(cellMap) !== originalKey,
        [cellMap, originalKey],
    );

    function cycleStatus(tierId: string, inclusionId: string) {
        const k = cellKey(tierId, inclusionId);
        setCellMap((m) => {
            const existing = m[k];
            return {
                ...m,
                [k]: {
                    ...existing,
                    status: nextStatus(existing.status),
                    // Clear note when leaving CONDITIONAL.
                    note: existing.status === "CONDITIONAL" ? "" : existing.note,
                },
            };
        });
    }

    function setNote(tierId: string, inclusionId: string, note: string) {
        const k = cellKey(tierId, inclusionId);
        setCellMap((m) => ({ ...m, [k]: { ...m[k], note } }));
    }

    async function handleSave() {
        setSaving(true);
        try {
            await onSave(Object.values(cellMap));
            setOriginalKey(JSON.stringify(cellMap));
        } catch {
            toast.error("Could not save the matrix. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    if (tiers.length === 0 || inclusions.length === 0) {
        return (
            <p className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
                Add at least one tier and one inclusion before editing the matrix.
            </p>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-neutral-500">
                    Click a cell to cycle: <strong>Included</strong> →{" "}
                    <strong>Excluded</strong> → <strong>Conditional</strong>.
                </p>
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={!dirty || saving}
                    className="inline-flex items-center justify-center rounded-full bg-brand-red px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {saving ? "Saving…" : "Save matrix"}
                </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
                <table className="w-full border-collapse">
                    <thead className="bg-neutral-50">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        <th className="px-4 py-3 min-w-[200px]">Inclusion</th>
                        {tiers.map((t) => (
                            <th key={t.id} className="px-4 py-3 text-center">
                                {t.name}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {inclusions.map((i) => (
                        <tr key={i.id} className="border-t border-neutral-100">
                            <td className="px-4 py-3 align-top text-sm font-semibold text-brand-ink">
                                {i.label}
                                {i.description && (
                                    <p className="mt-0.5 text-xs font-normal text-neutral-500">
                                        {i.description}
                                    </p>
                                )}
                            </td>
                            {tiers.map((t) => {
                                const k = cellKey(t.id, i.id);
                                const cell = cellMap[k];
                                if (!cell) return <td key={t.id} />;
                                return (
                                    <td
                                        key={t.id}
                                        className="px-2 py-2 text-center align-top"
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                cycleStatus(t.id, i.id)
                                            }
                                            className={`inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors ${
                                                cell.status === "INCLUDED"
                                                    ? "bg-brand-green/10 text-brand-green hover:bg-brand-green/20"
                                                    : cell.status === "EXCLUDED"
                                                        ? "bg-brand-red/10 text-brand-red hover:bg-brand-red/20"
                                                        : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                            }`}
                                            aria-label={`${i.label} for ${t.name}: ${cell.status}`}
                                        >
                                            {cell.status === "INCLUDED" && (
                                                <Check
                                                    className="h-4 w-4"
                                                    strokeWidth={2.5}
                                                />
                                            )}
                                            {cell.status === "EXCLUDED" && (
                                                <X
                                                    className="h-4 w-4"
                                                    strokeWidth={2.5}
                                                />
                                            )}
                                            {cell.status === "CONDITIONAL" && (
                                                <HelpCircle
                                                    className="h-4 w-4"
                                                    strokeWidth={2.5}
                                                />
                                            )}
                                        </button>
                                        {cell.status === "CONDITIONAL" && (
                                            <input
                                                type="text"
                                                value={cell.note}
                                                onChange={(e) =>
                                                    setNote(
                                                        t.id,
                                                        i.id,
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Note…"
                                                className="mt-1 block w-full rounded border border-neutral-300 px-1.5 py-1 text-xs focus:border-brand-blue focus:outline-none"
                                            />
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}