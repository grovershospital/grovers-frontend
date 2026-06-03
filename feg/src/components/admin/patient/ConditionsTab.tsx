import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import ConditionFormModal from "../../../components/admin/ConditionFormModal";
import { useAdminPatient } from "../../../contexts/AdminPatientContext";
import {
    createAdminCondition,
    deleteAdminCondition,
    fetchAdminConditions,
    updateAdminCondition,
    type AdminCondition,
    type ChronicConditionStatus,
    type ConditionInput,
} from "../../../data/admin";

const STATUS_TONE: Record<ChronicConditionStatus, string> = {
    Active: "bg-brand-red/10 text-brand-red",
    Managed: "bg-brand-blue/10 text-brand-blue",
    "In remission": "bg-brand-green/10 text-brand-green",
};

export default function ConditionsTab() {
    const patient = useAdminPatient();

    const [conditions, setConditions] = useState<AdminCondition[]>([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<AdminCondition | null>(null);

    useEffect(() => {
        let alive = true;
        setLoading(true);
        fetchAdminConditions(patient.id)
            .then((data) => {
                if (alive) setConditions(data);
            })
            .finally(() => {
                if (alive) setLoading(false);
            });
        return () => {
            alive = false;
        };
    }, [patient.id]);

    function openAdd() {
        setEditing(null);
        setModalOpen(true);
    }

    function openEdit(cond: AdminCondition) {
        setEditing(cond);
        setModalOpen(true);
    }

    async function handleSubmit(input: ConditionInput) {
        if (editing) {
            const updated = await updateAdminCondition(editing.id, input);
            setConditions((list) =>
                list.map((c) => (c.id === updated.id ? updated : c)),
            );
        } else {
            const created = await createAdminCondition(patient.id, input);
            setConditions((list) => [...list, created]);
        }
    }

    async function handleDelete(cond: AdminCondition) {
        const ok = window.confirm(`Remove "${cond.name}" from conditions?`);
        if (!ok) return;

        const prev = conditions;
        setConditions((list) => list.filter((c) => c.id !== cond.id));
        try {
            await deleteAdminCondition(cond.id);
        } catch {
            setConditions(prev);
            window.alert("Could not remove the condition. Please try again.");
        }
    }

    return (
        <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-brand-ink">
                        Chronic Conditions
                    </h2>
                    <p className="mt-1 text-sm text-neutral-500">
                        Ongoing health conditions for this patient.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={openAdd}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                    Add condition
                </button>
            </div>

            {loading ? (
                <p className="text-sm text-neutral-500">Loading…</p>
            ) : conditions.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
                    No chronic conditions recorded. Click "Add condition" to record
                    one.
                </p>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
                    <table className="w-full min-w-[800px] border-collapse">
                        <thead className="bg-neutral-50">
                        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Diagnosed</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Managing doctor</th>
                            <th className="px-4 py-3" />
                        </tr>
                        </thead>
                        <tbody>
                        {conditions.map((c) => (
                            <tr
                                key={c.id}
                                className="border-t border-neutral-100 align-top text-sm"
                            >
                                <td className="px-4 py-3">
                                    <p className="font-semibold text-brand-ink">
                                        {c.name}
                                    </p>
                                    {c.notes && (
                                        <p className="mt-1 text-xs text-neutral-500">
                                            {c.notes}
                                        </p>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-brand-ink">
                                    {c.diagnosedDate || "—"}
                                </td>
                                <td className="px-4 py-3">
                                        <span
                                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_TONE[c.status]}`}
                                        >
                                            {c.status}
                                        </span>
                                </td>
                                <td className="px-4 py-3 text-brand-ink">
                                    {c.managingDoctorText || "—"}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-end gap-1">
                                        <button
                                            type="button"
                                            onClick={() => openEdit(c)}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-brand-ink"
                                            aria-label={`Edit ${c.name}`}
                                        >
                                            <Pencil
                                                className="h-4 w-4"
                                                strokeWidth={2}
                                            />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(c)}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-brand-red/10 hover:text-brand-red"
                                            aria-label={`Delete ${c.name}`}
                                        >
                                            <Trash2
                                                className="h-4 w-4"
                                                strokeWidth={2}
                                            />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ConditionFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                condition={editing}
                onSubmit={handleSubmit}
            />
        </>
    );
}