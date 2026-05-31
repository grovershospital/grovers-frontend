import Hero from "../components/packages/Hero.tsx";
import ScreeningPackages from '../components/packages/ScreeningPackage.tsx'
import {ANNUAL_WELLNESS, DOMESTIC_STAFF, FOOD_HANDLERS, PRE_EMPLOYMENT} from "../data/screening-packages.ts";
import CorporateHealth from "../components/packages/Corporatehealth.tsx";
import PackageHelp from "../components/packages/PackageHelp.tsx";
import {Contact} from "../components/shared/Contact.tsx"

export default function Packages() {
    return (
        <>
            <Hero/>
            <ScreeningPackages pkg={ANNUAL_WELLNESS}/>
            <ScreeningPackages pkg={PRE_EMPLOYMENT}/>
            <ScreeningPackages pkg={DOMESTIC_STAFF}/>
            <ScreeningPackages pkg={FOOD_HANDLERS}/>
            <CorporateHealth/>
            <PackageHelp/>
            <Contact/>
        </>
    )
}