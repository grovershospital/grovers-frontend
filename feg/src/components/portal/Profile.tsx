import { useEffect, useState } from "react";
import ProfileHero from "../../components/portal/ProfileHero";
import PersonalInformation from "../../components/portal/PersonalInformation";
import ContactDetailsForm from "../../components/portal/ContactDetailsForm";
import ChangePasswordForm from "../../components/portal/ChangePasswordForm";
import PrivacyAndData from "../../components/portal/PrivacyAndData";
import { fetchPortalProfile, type PortalProfile } from "../../data/portal";

export default function Profile() {
    const [profile, setProfile] = useState<PortalProfile | null>(null);

    useEffect(() => {
        let alive = true;
        fetchPortalProfile().then((p) => {
            if (alive) setProfile(p);
        });
        return () => {
            alive = false;
        };
    }, []);

    if (!profile) {
        return (
            <>
                <ProfileHero />
                <p className="text-sm text-neutral-500">Loading…</p>
            </>
        );
    }

    return (
        <>
            <ProfileHero />
            <PersonalInformation profile={profile} />
            <ContactDetailsForm profile={profile} onUpdated={setProfile} />
            <ChangePasswordForm />
            <PrivacyAndData />
        </>
    );
}