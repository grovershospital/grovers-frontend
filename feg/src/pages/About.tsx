import Hero from "../components/about/Hero.tsx";
import Founders from "../components/about/Founders.tsx";
import VictoriaIsland from "../components/about/VictoriaIsland.tsx";
import Principles from "../components/about/Principles.tsx";
import Team from "../components/about/Team.tsx";
import LabaCare from "../components/about/LabaCare.tsx";
import {Contact} from "../components/shared/Contact.tsx";
import {Helmet} from 'react-helmet-async';

export default function About() {
    return (
        <>
            <Helmet>
                <title>Grover's Hospital — About us</title>
                <meta
                    name="description"
                    content="Private hospital in Victoria Island, Lagos. Annual wellness screening, pre-employment medical tests, corporate health services and more."
                />

                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Grover's Hospital — Private Healthcare in Victoria Island, Lagos" />
                <meta property="og:description" content="About Us, meet the team, where we are located,Victoria Island" />
                <meta property="og:image" content="https://YOUR-DOMAIN.com/og-image.png" />
                <meta property="og:url" content="https://YOUR-DOMAIN.com/" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Grover's Hospital — Private Healthcare in Victoria Island, Lagos" />
                <meta name="twitter:description" content="Private hospital in Victoria Island, Lagos. Annual wellness screening, pre-employment medical tests, corporate health services and more." />
                <meta name="twitter:image" content="https://YOUR-DOMAIN.com/og-image.png" />
            </Helmet>
            <Hero/>
            <Founders/>
            <VictoriaIsland/>
            <Principles />
            <Team />
            <LabaCare />
            <Contact/>
        </>
    )
}