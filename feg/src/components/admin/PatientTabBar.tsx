import { NavLink } from "react-router-dom";

type Props = {
    patientId: string;
};

const TABS = [
    { slug: "profile", label: "Profile" },
    { slug: "health-profile", label: "Health Profile" },
    { slug: "medications", label: "Medications" },
    { slug: "conditions", label: "Chronic Conditions" },
    { slug: "visits", label: "Visits" },
    { slug: "lab-results", label: "Lab Results" },
    { slug: "documents", label: "Documents" },
];

export default function PatientTabBar({ patientId }: Props) {
    return (
        <div className="mb-8 border-b border-neutral-200">
            <nav className="-mb-px flex flex-wrap gap-x-6 overflow-x-auto">
                {TABS.map((tab) => (
                    <NavLink
                        key={tab.slug}
                        to={`/admin/patients/${patientId}/${tab.slug}`}
                        className={({ isActive }) =>
                            `whitespace-nowrap border-b-2 px-1 py-3 text-sm transition-colors ${
                                isActive
                                    ? "border-brand-red font-semibold text-brand-ink"
                                    : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-brand-ink"
                            }`
                        }
                    >
                        {tab.label}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}