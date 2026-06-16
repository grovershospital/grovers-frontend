import Hero from '../components/services/Hero'
import WeeklySchedule from "../components/services/WeeklySchedule.tsx";
import ClinicDetail from "../components/services/ClinicDetail.tsx";
import {CLINIC_DETAILS} from "../data/clinic-details.ts"
import CriticalCare from "../components/services/CriticalCare.tsx";
import Diagnostics from "../components/services/Diagnostics.tsx";
import DepartmentHelp from "../components/services/DepartmentHelp.tsx";
import {Contact} from '../components/shared/Contact.tsx'
import {Helmet} from "react-helmet-async";

export default function Services() {
    return (
        <>
            <Helmet>
                <title>Grover's Hospital — Services | Packages | Our Clinics</title>
                <meta
                    name="description"
                    content="Private hospital in Victoria Island, Lagos. Annual wellness screening, pre-employment medical tests, corporate health services and more."
                />

                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Grover's Hospital — Private Healthcare in Victoria Island, Lagos" />
                <meta property="og:description" content="Services page, contains our vast clinics, amongst other services we offer" />
                <meta property="og:image" content="https://YOUR-DOMAIN.com/og-image.png" />
                <meta property="og:url" content="https://YOUR-DOMAIN.com/" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Grover's Hospital — Private Healthcare in Victoria Island, Lagos" />
                <meta name="twitter:description" content="Private hospital in Victoria Island, Lagos. Annual wellness screening, pre-employment medical tests, corporate health services and more." />
                <meta name="twitter:image" content="https://YOUR-DOMAIN.com/og-image.png" />
            </Helmet>
            <Hero />
            <WeeklySchedule />
            {CLINIC_DETAILS.map((clinic) => (
                <ClinicDetail key={clinic.slug} clinic={clinic}/>
            ))}
            <CriticalCare />
            <Diagnostics/>
            <DepartmentHelp />
            <Contact />
        </>
    )
}