import type { PortalProfile } from "../../data/portal";

type Props = {
    profile: PortalProfile;
};

export default function PersonalInformation({ profile }: Props) {
    const rows: Array<[string, string]> = [
        ["First Name:", profile.firstName],
        ["Last name:", profile.lastName],
        ["Email address:", profile.email],
        ["Phone Number:", profile.phone],
        ["Date of Birth:", profile.dateOfBirth],
        ["Gender:", profile.gender],
    ];

    return (
        <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-brand-ink">Personal Information</h2>

            <dl className="grid grid-cols-[max-content_1fr] gap-x-8 gap-y-3 text-sm">
                {rows.map(([label, value]) => (
                    <div key={label} className="contents">
                        <dt className="font-bold text-brand-red">{label}</dt>
                        <dd className="text-brand-ink">{value}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}