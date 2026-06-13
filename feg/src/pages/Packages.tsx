import { useEffect, useState } from "react";
import Hero from "../components/packages/Hero.tsx";
import ScreeningPackages from "../components/packages/ScreeningPackage.tsx";
import CorporateHealth from "../components/packages/Corporatehealth.tsx";
import PackageHelp from "../components/packages/PackageHelp.tsx";
import { Contact } from "../components/shared/Contact.tsx";
import { fetchPublicPackages, type PublicPackage } from "../data/portal.ts";

export default function Packages() {
    const [packages, setPackages] = useState<PublicPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;
        fetchPublicPackages()
            .then((data) => {
                if (alive) setPackages(data);
            })
            .catch(() => {
                if (alive) setError("Could not load packages right now. Please try again later.");
            })
            .finally(() => {
                if (alive) setLoading(false);
            });
        return () => {
            alive = false;
        };
    }, []);

    return (
        <>
            <Hero />

            {loading ? (
                <section className="bg-[#f9f7f0] py-16 sm:py-20 lg:py-24">
                    <div className="mx-auto w-full max-w-content px-6 lg:px-10">
                        <p className="text-sm text-neutral-500">Loading packages…</p>
                    </div>
                </section>
            ) : error ? (
                <section className="bg-[#f9f7f0] py-16 sm:py-20 lg:py-24">
                    <div className="mx-auto w-full max-w-content px-6 lg:px-10">
                        <p className="text-sm text-brand-red">{error}</p>
                    </div>
                </section>
            ) : (
                packages.map((pkg) => <ScreeningPackages key={pkg.id} pkg={pkg} />)
            )}

            <CorporateHealth />
            <PackageHelp />
            <Contact />
        </>
    );
}