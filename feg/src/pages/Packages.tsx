import Hero from "../components/packages/Hero.tsx";
import ScreeningPackages from '../components/packages/ScreeningPackage.tsx'
import {ANNUAL_WELLNESS, DOMESTIC_STAFF, PRE_EMPLOYMENT} from "../data/screening-packages.ts";

export default function Packages() {
    return (
        <>
            <Hero />
            <ScreeningPackages pkg={ANNUAL_WELLNESS}/>
            <ScreeningPackages pkg={PRE_EMPLOYMENT} />
            <ScreeningPackages pkg={DOMESTIC_STAFF} />
        </>
    )
}