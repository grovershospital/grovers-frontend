import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import VisitStatusPill from "../../components/admin/VisitStatusPill";
import {
    fetchAdminVisit,
    updateAdminVisit,
    type AdminVisitDetail,
    type VisitUpdateInput,
} from "../../data/admin";

export default function AdminVisitEdit() {
    const { visitId } = useParams<{ visitId: string }>();
    const navigate = useNavigate();

    const [visit, setVisit] = useState<AdminVisitDetail | null>(null);
    const [form, setForm] = useState<VisitUpdateInput | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!visitId) return;
        let alive = true;
        fetchAdminVisit(visitId)
            .then((data) => {
                if (!alive) return;
                setVisit(data);
                setForm({
                    attendingDoctorText: data.attendingDoctorText,
                    chiefComplaint: data.chiefComplaint,
                    status: data.status,
                    diagnosis: data.diagnosis,
                    treatment: data.treatment,
                    clinicalNotes: data.clinicalNotes,
                    followUpRequired: data.followUpRequired,
                    followUpDate: data.followUpDate,
                    followUpInstructions: data.followUpInstructions,
                });
            })
            .catch(() => {
                if (alive) setError("Could not load this visit.");
            });
        return () => {
            alive = false;
        };
    }, [visitId]);

    function update<K extends keyof VisitUpdateInput>(
        key: K,
        value: VisitUpdateInput[K],
    ) {
        setForm((f) => (f ? { ...f, [key]: value } : f));
        if (success) setSuccess(false);
    }

    async function persist(updates: VisitUpdateInput) {
        if (!visit) return;
        setError(null);
        setSubmitting(true);
        try {
            const updated = await updateAdminVisit(visit.id, updates);
            setVisit(updated);
            setForm({
                attendingDoctorText: updated.attendingDoctorText,
                chiefComplaint: updated.chiefComplaint,
                status: updated.status,
                diagnosis: updated.diagnosis,
                treatment: updated.treatment,
                clinicalNotes: updated.clinicalNotes,
                followUpRequired: updated.followUpRequired,
                followUpDate: updated.followUpDate,
                followUpInstructions: updated.followUpInstructions,
            });
            setSuccess(true);
        } catch {
            setError("Could not save the visit. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleSave(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!form) return;
        await persist(form);
    }

    async function handleMarkCompleted() {
        if (!form) return;

        if (!form.chiefComplaint.trim()) {
            setError("Add a chief complaint before marking this visit as completed.");
            return;
        }
        if (!form.diagnosis.trim()) {
            setError("Add a diagnosis before marking this visit as completed.");
            return;
        }

        await persist({ ...form, status: "Completed" });
    }

    if (error && !visit) {
        return (
            <>
                <BackLink patientId={null} />
                <p className="text-sm text-brand-red">{error}</p>
            </>
        );
    }

    if (!visit || !form) {
        return (
            <>
                <BackLink patientId={null} />
                <p className="text-sm text-neutral-500">Loading…</p>
            </>
        );
    }

    return (
        <>
            <BackLink patientId={visit.patientId} />

            <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-brand-ink sm:text-4xl">
                        Visit · {visit.visitDate}
                    </h1>
                    <p className="mt-1 text-sm text-neutral-500">
                        {visit.department}
                        {visit.bookingShortId && (
                            <>
                                {" "}
                                · from booking{" "}
                                <span className="font-mono">#{visit.bookingShortId}</span>
                            </>
                        )}
                    </p>
                </div>
                <VisitStatusPill status={visit.status} size="md" />
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                <FieldGroup title="Attending">
                    <Field label="Attending doctor" htmlFor="vs-doctor">
                        <input
                            id="vs-doctor"
                            type="text"
                            placeholder="Doctor's name (free text for now)"
                            value={form.attendingDoctorText}
                            onChange={(e) =>
                                update("attendingDoctorText", e.target.value)
                            }
                            className={inputClass}
                        />
                    </Field>
                </FieldGroup>

                <FieldGroup title="Clinical">
                    <div className="space-y-5">
                        <Field label="Chief complaint" htmlFor="vs-complaint">
                            <textarea
                                id="vs-complaint"
                                rows={2}
                                value={form.chiefComplaint}
                                onChange={(e) =>
                                    update("chiefComplaint", e.target.value)
                                }
                                placeholder="What brought the patient in?"
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Diagnosis" htmlFor="vs-diagnosis">
                            <textarea
                                id="vs-diagnosis"
                                rows={3}
                                value={form.diagnosis}
                                onChange={(e) => update("diagnosis", e.target.value)}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Treatment" htmlFor="vs-treatment">
                            <textarea
                                id="vs-treatment"
                                rows={3}
                                value={form.treatment}
                                onChange={(e) => update("treatment", e.target.value)}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Clinical notes" htmlFor="vs-notes">
                            <textarea
                                id="vs-notes"
                                rows={4}
                                value={form.clinicalNotes}
                                onChange={(e) =>
                                    update("clinicalNotes", e.target.value)
                                }
                                placeholder="Additional notes from the visit. Visible to admins only."
                                className={inputClass}
                            />
                        </Field>
                    </div>
                </FieldGroup>

                <FieldGroup title="Follow-up">
                    <div className="space-y-5">
                        <label className="flex items-center gap-3 text-sm">
                            <input
                                type="checkbox"
                                checked={form.followUpRequired}
                                onChange={(e) =>
                                    update("followUpRequired", e.target.checked)
                                }
                                className="h-4 w-4 rounded border-neutral-300 text-brand-red focus:ring-brand-blue"
                            />
                            <span className="font-semibold text-brand-ink">
                                Follow-up required
                            </span>
                        </label>

                        {form.followUpRequired && (
                            <>
                                <Field label="Follow-up date" htmlFor="vs-fu-date">
                                    <input
                                        id="vs-fu-date"
                                        type="text"
                                        placeholder="e.g. 12th November 2026"
                                        value={form.followUpDate}
                                        onChange={(e) =>
                                            update("followUpDate", e.target.value)
                                        }
                                        className={inputClass}
                                    />
                                </Field>

                                <Field
                                    label="Follow-up instructions"
                                    htmlFor="vs-fu-notes"
                                >
                                    <textarea
                                        id="vs-fu-notes"
                                        rows={3}
                                        value={form.followUpInstructions}
                                        onChange={(e) =>
                                            update(
                                                "followUpInstructions",
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                    />
                                </Field>
                            </>
                        )}
                    </div>
                </FieldGroup>

                {error && (
                    <p className="text-sm text-brand-red" role="alert">
                        {error}
                    </p>
                )}
                {success && (
                    <p className="text-sm text-brand-green" role="status">
                        Visit saved.
                    </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 pt-6">
                    <button
                        type="button"
                        onClick={() => navigate(`/admin/patients/${visit.patientId}/visits`)}
                        className="text-sm text-brand-ink underline underline-offset-2 hover:no-underline"
                    >
                        Back to patient
                    </button>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center justify-center rounded-full border border-brand-ink bg-white px-6 py-2.5 text-sm font-semibold text-brand-ink transition-colors hover:bg-neutral-100 disabled:opacity-60"
                        >
                            {submitting ? "Saving…" : "Save draft"}
                        </button>

                        {visit.status === "Draft" && (
                            <button
                                type="button"
                                onClick={handleMarkCompleted}
                                disabled={submitting}
                                className="inline-flex items-center justify-center rounded-full bg-brand-green px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green disabled:opacity-60"
                            >
                                {submitting ? "Working…" : "Mark as Completed"}
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </>
    );
}

function BackLink({ patientId }: { patientId: string | null }) {
    return (
        <Link
            to={patientId ? `/admin/patients/${patientId}/visits` : "/admin/patients"}
            className="mb-6 inline-flex items-center gap-1 text-sm text-brand-ink hover:text-brand-blue"
        >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            {patientId ? "Back to visits" : "All patients"}
        </Link>
    );
}

const inputClass =
    "w-full rounded-2xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue";

function FieldGroup({
                        title,
                        children,
                    }: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-6 text-base font-bold text-brand-ink">{title}</h2>
            {children}
        </section>
    );
}

function Field({
                   label,
                   htmlFor,
                   children,
               }: {
    label: string;
    htmlFor: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label
                htmlFor={htmlFor}
                className="mb-1.5 block text-sm font-semibold text-brand-ink"
            >
                {label}
            </label>
            {children}
        </div>
    );
}