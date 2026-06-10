import { Info } from "lucide-react";
import { useAdminPatient } from "../../../contexts/AdminPatientContext";

export default function ProfileTab() {
    const patient = useAdminPatient();

    const rows: Array<[string, string]> = [
        ["First Name", patient.firstName],
        ["Last Name", patient.lastName],
        ["Email", patient.email],
        ["Phone", patient.phone],
        ["WhatsApp", patient.whatsapp ?? "—"],
        ["Date of Birth", patient.dateOfBirth],
        ["Gender", patient.gender],
        ["Member Since", patient.memberSinceDisplay],
    ];

    return (
        <>
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-brand-blue/30 bg-brand-blue/5 p-4">
                <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-blue" strokeWidth={2} />
                <p className="text-sm text-brand-ink">
                    Basic profile details are managed by the patient through their portal.
                    Patients submit change requests via the Profile Update Requests queue, where
                    you can approve or reject them.
                </p>
            </div>

            <section className="rounded-2xl border border-neutral-200 bg-white p-6">
                <h2 className="mb-6 text-xl font-bold text-brand-ink">Personal Information</h2>

                <dl className="grid grid-cols-1 gap-y-4 text-sm sm:grid-cols-[max-content_1fr] sm:gap-x-8">
                    {rows.map(([label, value]) => (
                        <div key={label} className="contents">
                            <dt className="font-semibold text-neutral-500">{label}</dt>
                            <dd className="text-brand-ink">{value}</dd>
                        </div>
                    ))}
                </dl>
            </section>
        </>
    );
}