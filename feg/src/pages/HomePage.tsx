import { Hero } from "../components/home/Hero";
import {TrustBar} from "../components/home/TrustBar.tsx";
import {About} from "../components/home/About";
import {Stats} from "../components/home/Stats.tsx";
import {Services} from "../components/home/Services.tsx";

export default function HomePage() {
    return (
        <>
            <Hero />
            <TrustBar />
            <About />
            <Stats />
            <Services />
        </>
    );
}