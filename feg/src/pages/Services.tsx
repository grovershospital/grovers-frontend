import Hero from '../components/services/Hero'
import WeeklySchedule from "../components/services/WeeklySchedule.tsx";
import ClinicDetail from "../components/services/ClinicDetail.tsx";
import {CLINIC_DETAILS} from "../data/clinic-details.ts"
import CriticalCare from "../components/services/CriticalCare.tsx";
import Diagnostics from "../components/services/Diagnostics.tsx";
import DepartmentHelp from "../components/services/DepartmentHelp.tsx";
export default function Services() {
    return (
        <>
            <Hero />
            <WeeklySchedule />
            {CLINIC_DETAILS.map((clinic) => (
                <ClinicDetail key={clinic.slug} clinic={clinic}/>
            ))}
            <CriticalCare />
            <Diagnostics/>
            <DepartmentHelp />
        </>
    )
}