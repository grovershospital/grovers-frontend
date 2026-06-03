import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import MedicationFormModal from "../../../components/admin/MedicationFormModal";
import { useAdminPatient } from "../../../contexts/AdminPatientContext";
import {
    createAdminMedication,
    deleteAdminMedication,
    fetchAdminMedications,
    updateAdminMedication,
    type AdminMedication,
    type MedicationInput,
} from "../../../data/admin";

export default function MedicationsTab() {
    const patient = useAdminPatient();

    const [medications, setMedications] = useState<AdminMedication[]>([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<AdminMedication | null>(null);

    useEffect(() => {
        let alive = true;
        setLoading(true);
        fetchAdminMedications(patient.id)
            .then((data) => {
                if (alive) setMedications(data);
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

    function openEdit(med: AdminMedication) {
        setEditing(med);
        setModalOpen(true);
    }

    async function handleSubmit(input: MedicationInput) {
        if (editing) {
            const updated = await updateAdminMedication(editing.id, input);
            setMedications((list) =>
                list.map((m) => (m.id === updated.id ? updated : m)),
            );
        } else {
            const created = await createAdminMedication(patient.id, input);
            setMedications((list) => [...list, created]);
        }
    }

    async function handleDelete(med: AdminMedication) {
        const ok = window.confirm(`Remove "${med.name}" from medications?`);
        if (!ok) return;

        // Optimistic removal — restore on failure.
        const prev = medications;
        setMedications((list) => list.filter((m) => m.id !== med.id));
        try {
            await deleteAdminMedication(med.id);
        } catch {
            setMedications(prev);
            window.alert("Could not remove the medication. Please try again.");
        }
    }

    return (
        <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-brand-ink">Medications</h2>
                    <p className="mt-1 text-sm text-neutral-500">
                        Active and past medications for this patient.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={openAdd}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                    Add medication
                </button>
            </div>

            {loading ? (
                <p className="text-sm text-neutral-500">Loading…</p>
            ) : medications.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
                    No medications recorded. Click "Add medication" to record one.
                </p>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
                    <table className="w-full min-w-[800px] border-collapse">
                        <thead className="bg-neutral-50">
                        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Dosage</th>
                            <th className="px-4 py-3">Frequency</th>
                            <th className="px-4 py-3">Started</th>
                            <th className="px-4 py-3">Prescribed by</th>
                            <th className="px-4 py-3" />
                        </tr>
                        </thead>
                        <tbody>
                        {medications.map((m) => (
                            <tr
                                key={m.id}
                                className="border-t border-neutral-100 text-sm align-top"
                            >
                                <td className="px-4 py-3">
                                    <p className="font-semibold text-brand-ink">
                                        {m.name}
                                    </p>
                                    {m.notes && (
                                        <p className="mt-1 text-xs text-neutral-500">
                                            {m.notes}
                                        </p>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-brand-ink">
                                    {m.dosage || "—"}
                                </td>
                                <td className="px-4 py-3 text-brand-ink">
                                    {m.frequency || "—"}
                                </td>
                                <td className="px-4 py-3 text-brand-ink">
                                    {m.startedOn || "—"}
                                </td>
                                <td className="px-4 py-3 text-brand-ink">
                                    {m.prescribedByText || "—"}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-end gap-1">
                                        <button
                                            type="button"
                                            onClick={() => openEdit(m)}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-brand-ink"
                                            aria-label={`Edit ${m.name}`}
                                        >
                                            <Pencil
                                                className="h-4 w-4"
                                                strokeWidth={2}
                                            />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(m)}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-brand-red/10 hover:text-brand-red"
                                            aria-label={`Delete ${m.name}`}
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

            <MedicationFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                medication={editing}
                onSubmit={handleSubmit}
            />
        </>
    );
}