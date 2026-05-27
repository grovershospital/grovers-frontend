// src/pages/HomePage.tsx
import { Hero } from "../components/home/Hero";
// later: TrustBar, About, Services, Emergency, Screening, CTA, Testimonials

export default function HomePage() {
    return (
        <>
            <Hero />
            {/* TrustBar, About, ... go here as we build them */}
        </>
    );
}