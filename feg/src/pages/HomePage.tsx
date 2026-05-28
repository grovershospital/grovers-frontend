import { Hero } from "../components/home/Hero";
import {TrustBar} from "../components/home/TrustBar.tsx";
import {About} from "../components/home/About";

export default function HomePage() {
    return (
        <>
            <Hero />
            <TrustBar />
            <About />
        </>
    );
}