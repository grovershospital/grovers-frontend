import { Link } from "react-router-dom";
import { ChevronLeft, Mail, Phone } from "lucide-react";
import type { AdminPatientProfile } from "../../data/admin";

type Props = {
    patient: AdminPatientProfile;
};

export default function PatientDetailHeader({ patient }: Props) {
    return (
        <div className="mb-8">
            <Link
                to="/admin/patients"
                className="mb-6 inline-flex items-center gap-1 text-sm text-brand-ink hover:text-brand-blue"
            >
                <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                All patients
            </Link>

            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-brand-ink sm:text-4xl">
                        {patient.firstName} {patient.lastName}
                    </h1>
                    <p className="mt-1 text-sm text-neutral-500">
                        Member since {patient.memberSinceDisplay} ·{" "}
                        {patient.bookingCount} booking
                        {patient.bookingCount === 1 ? "" : "s"}
                    </p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                    <a
                        href={`mailto:${patient.email}`}
                        className="inline-flex items-center gap-2 text-brand-ink underline underline-offset-2 hover:no-underline"
                    >
                        <Mail className="h-4 w-4" strokeWidth={2} />
                        {patient.email}
                    </a>

                    <a
                        href={`tel:${patient.phone}`}
                        className="inline-flex items-center gap-2 text-brand-ink underline underline-offset-2 hover:no-underline"
                    >
                        <Phone className="h-4 w-4" strokeWidth={2} />
                        {patient.phone}
                    </a>
                </div>
            </div>
        </div>
    );
}