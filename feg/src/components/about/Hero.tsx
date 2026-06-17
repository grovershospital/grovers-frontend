import { Button } from "../../ui/Button";
import heroBgAbout from "../../assets/about-page/heroBgAbout.png";

export default function Hero() {
    return (
        <section
            id="about-hero"
            className="relative isolate overflow-hidden"
            aria-labelledby="about-hero-heading"
        >
            {/* Background photo */}
            <img
                src={heroBgAbout}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
            />
            {/* Dark overlay — matches Figma's 60% black */}
            <div className="absolute inset-0 -z-10 bg-black/60" aria-hidden="true" />

            <div className="mx-auto w-full max-w-content px-6 py-20 sm:py-24 lg:px-10 lg:py-28">
                <div className="max-w-2xl">
                    {/* Pill badge — translucent blue fill, blue border, white text. */}
                    {/* Two stacked clip-paths in Figma at opacity-68 → border + fill at matching opacity here. */}
                    <span className="inline-flex items-center rounded-md border border-brand-blue/70 bg-brand-blue/25 px-5 py-3 text-xs font-medium tracking-wide text-white backdrop-blur-sm">
            Our story. Our purpose.
          </span>

                    {/* Headline — Inter ExtraBold, white, tight leading */}
                    <h1
                        id="about-hero-heading"
                        className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl"
                    >
                        Nigeria&rsquo;s premiere lifestyle clinic, built on 20 years of
                        healthcare experience.
                    </h1>

                    {/* Body — softened white so headline stays dominant */}
                    <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
                        Grover&rsquo;s Hospital has been caring for Lagos families,
                        professionals and communities since 2017. We were built around a
                        simple but powerful idea: that good healthcare should prevent
                        illness, not just treat it. Everything we do flows from that.
                    </p>

                    {/* CTA — reuses the existing primary variant (blue → green hover) */}
                    <div className="mt-8">
                        <Button variant="primary" href="/patient-portal/login">
                            Book an appointment
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}