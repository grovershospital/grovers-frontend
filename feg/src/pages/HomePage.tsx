import { Hero } from "../components/home/Hero";
import {TrustBar} from "../components/home/TrustBar.tsx";
import {About} from "../components/home/About";
import {Stats} from "../components/home/Stats.tsx";
import {Services} from "../components/home/Services.tsx";
import {Emergency} from "../components/home/Emergency.tsx";
import {Screening} from "../components/home/Screening.tsx";
import {CTA} from "../components/home/CTA.tsx";
import {Testimonials} from "../components/home/Testimonials.tsx";
import {Contact} from "../components/shared/Contact.tsx";
import {Helmet} from 'react-helmet-async';

export default function HomePage() {
    return (
        <>
            <Helmet>
                <title>Grover's Hospital — Private Healthcare</title>
                <meta
                    name="description"
                    content="Private hospital in Victoria Island, Lagos. Annual wellness screening, pre-employment medical tests, corporate health services and more."
                />

                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Grover's Hospital — Private Healthcare in Victoria Island, Lagos" />
                <meta property="og:description" content="Private hospital in Victoria Island, Lagos. Annual wellness screening, pre-employment medical tests, corporate health services and more." />
                <meta property="og:image" content="https://YOUR-DOMAIN.com/og-image.png" />
                <meta property="og:url" content="https://YOUR-DOMAIN.com/" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Grover's Hospital — Private Healthcare in Victoria Island, Lagos" />
                <meta name="twitter:description" content="Private hospital in Victoria Island, Lagos. Annual wellness screening, pre-employment medical tests, corporate health services and more." />
                <meta name="twitter:image" content="https://YOUR-DOMAIN.com/og-image.png" />
            </Helmet>
            <Hero />
            <TrustBar />
            <About />
            <Stats />
            <Services />
            <Emergency />
            <Screening />
            <CTA />
            <Testimonials />
            <Contact />
        </>
    );
}