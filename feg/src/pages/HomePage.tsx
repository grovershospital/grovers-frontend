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

export default function HomePage() {
    return (
        <>
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