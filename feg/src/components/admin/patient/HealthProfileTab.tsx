import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useAdminPatient } from "../../../contexts/AdminPatientContext";
import {
    fetchAdminHealthProfile,
    updateAdminHealthProfile,
    type AdminHealthProfile,
    type BloodGroup,
    type Genotype,
} from "../../../data/admin";

const BLOOD_GROUPS: ReadonlyArray<BloodGroup> = [
    "Unknown",
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
];

const GENOTYPES: ReadonlyArray<Genotype> = ["Unknown", "AA", "AS", "AC", "SS", "SC"];

export default function HealthProfileTab() {
    const patient = useAdminPatient();

    const [profile, setProfile] = useState<AdminHealthProfile | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;
        fetchAdminHealthProfile(patient.id).then((data) => {
            if (alive) setProfile(data);
        });
        return () => {
            alive = false;
        };
    }, [patient.id]);

    function update<K extends keyof AdminHealthProfile>(
        key: K,
        value: AdminHealthProfile[K],
    ) {
        setProfile((p) => (p ? { ...p, [key]: value } : p));
        if (success) setSuccess(false);
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!profile) return;
        setError(null);
        setSuccess(false);
        setSubmitting(true);
        try {
            const updated = await updateAdminHealthProfile(patient.id, profile);
            setProfile(updated);
            setSuccess(true);
        } catch {
            setError("Could not save the health profile. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    if (!profile) {
        return <p className="text-sm text-neutral-500">Loading health profile…</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <FieldGroup title="Vitals">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="Blood Group" htmlFor="hp-blood">
                        <select
                            id="hp-blood"
                            value={profile.bloodGroup}
                            onChange={(e) =>
                                update("bloodGroup", e.target.value as BloodGroup)
                            }
                            className={inputClass}
                        >
                            {BLOOD_GROUPS.map((g) => (
                                <option key={g} value={g}>
                                    {g}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Genotype" htmlFor="hp-genotype">
                        <select
                            id="hp-genotype"
                            value={profile.genotype}
                            onChange={(e) =>
                                update("genotype", e.target.value as Genotype)
                            }
                            className={inputClass}
                        >
                            {GENOTYPES.map((g) => (
                                <option key={g} value={g}>
                                    {g}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Height (cm)" htmlFor="hp-height">
                        <input
                            id="hp-height"
                            type="number"
                            min="0"
                            step="0.1"
                            value={profile.heightCm}
                            onChange={(e) => update("heightCm", e.target.value)}
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Weight (kg)" htmlFor="hp-weight">
                        <input
                            id="hp-weight"
                            type="number"
                            min="0"
                            step="0.1"
                            value={profile.weightKg}
                            onChange={(e) => update("weightKg", e.target.value)}
                            className={inputClass}
                        />
                    </Field>
                </div>
            </FieldGroup>

            <FieldGroup title="Allergies">
                <Field label="Known allergies" htmlFor="hp-allergies">
                    <textarea
                        id="hp-allergies"
                        rows={3}
                        value={profile.allergies}
                        onChange={(e) => update("allergies", e.target.value)}
                        placeholder="List any known allergies (medications, foods, environmental)…"
                        className={inputClass}
                    />
                </Field>
            </FieldGroup>

            <FieldGroup title="Emergency Contact">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="Contact name" htmlFor="hp-ec-name">
                        <input
                            id="hp-ec-name"
                            type="text"
                            value={profile.emergencyContactName}
                            onChange={(e) =>
                                update("emergencyContactName", e.target.value)
                            }
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Relationship" htmlFor="hp-ec-rel">
                        <input
                            id="hp-ec-rel"
                            type="text"
                            value={profile.emergencyContactRelationship}
                            onChange={(e) =>
                                update("emergencyContactRelationship", e.target.value)
                            }
                            placeholder="e.g. Spouse, Parent, Sibling"
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Contact phone" htmlFor="hp-ec-phone">
                        <input
                            id="hp-ec-phone"
                            type="tel"
                            value={profile.emergencyContactPhone}
                            onChange={(e) =>
                                update("emergencyContactPhone", e.target.value)
                            }
                            className={inputClass}
                        />
                    </Field>
                </div>
            </FieldGroup>

            <FieldGroup title="Clinical Notes">
                <Field label="Internal clinical notes" htmlFor="hp-notes">
                    <textarea
                        id="hp-notes"
                        rows={5}
                        value={profile.clinicalNotes}
                        onChange={(e) => update("clinicalNotes", e.target.value)}
                        placeholder="Internal notes from medical staff. Visible to admins only."
                        className={inputClass}
                    />
                </Field>
            </FieldGroup>

            <div className="flex items-center gap-4">
                <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center rounded-full bg-brand-red px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red disabled:opacity-60"
                >
                    {submitting ? "Saving…" : "Save Health Profile"}
                </button>

                {error && (
                    <p className="text-sm text-brand-red" role="alert">
                        {error}
                    </p>
                )}
                {success && (
                    <p className="text-sm text-brand-green" role="status">
                        Health profile saved.
                    </p>
                )}
            </div>
        </form>
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