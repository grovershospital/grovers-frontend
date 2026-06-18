import {useEffect, useState} from "react";
import Hero from "../components/packages/Hero.tsx";
import ScreeningPackages from "../components/packages/ScreeningPackage.tsx";
import PackageSkeleton from "../components/packages/PackageSkeleton.tsx";
import CorporateHealth from "../components/packages/Corporatehealth.tsx";
import PackageHelp from "../components/packages/PackageHelp.tsx";
import {Contact} from "../components/shared/Contact.tsx";
import {Button} from "../ui/Button.tsx";
import {fetchPublicPackages, type PublicPackage} from "../data/portal.ts";

type Status = "loading" | "error" | "ready";

export default function Packages() {
    const [packages, setPackages] = useState<PublicPackage[]>([]);
    const [status, setStatus] = useState<Status>("loading");
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let alive = true;
        setStatus("loading");
        fetchPublicPackages()
            .then((data) => {
                if (!alive) return;
                setPackages(data);
                setStatus("ready");
            })
            .catch(() => {
                if (!alive) return;
                setStatus("error");
            });
        return () => {
            alive = false;
        };
    }, [reloadKey]);

    const retry = () => setReloadKey((k) => k + 1);

    return (
        <>
            <Hero/>

            {status === "loading" && (
                <>
                    <PackageSkeleton/>
                    <PackageSkeleton/>
                </>
            )}

            {status === "error" && (
                <section className="bg-[#f9f7f0] py-16 sm:py-20 lg:py-24">
                    <div className="mx-auto w-full max-w-content px-6 lg:px-10">
                        <div className="mx-auto max-w-md text-center">
                            <h2 className="text-2xl font-extrabold text-brand-ink">
                                Couldn't load packages
                            </h2>
                            <p className="mt-3 text-sm text-brand-ink/70 sm:text-base">
                                Check your connection and try again.
                            </p>
                            <div className="mt-6">
                                <Button variant="primary" onClick={retry}>
                                    Try again
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {status === "ready" &&
                packages.map((pkg) => <ScreeningPackages key={pkg.id} pkg={pkg}/>)}

            <CorporateHealth/>
            <PackageHelp/>
            <Contact/>
        </>
    );
}