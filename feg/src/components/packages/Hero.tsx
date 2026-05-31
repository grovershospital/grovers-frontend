import { Button } from "../../ui/Button";
import packagesHero from "../../assets/packages-page/packagesHero.jpg";

export default function Hero() {
    return (
        <section
            id="packages-hero"
            className="relative isolate overflow-hidden"
            aria-labelledby="packages-hero-heading"
        >
            {/* Background photo */}
            <img
                src={packagesHero}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
            />
            {/* Dark overlay — same weight as Services hero so the lab equipment */}
            {/* reads through clearly. */}
            <div className="absolute inset-0 -z-10 bg-black/40" aria-hidden="true" />

            <div className="mx-auto w-full lg:w-[80%] max-w-content px-6 py-20 sm:py-24 lg:px-10 lg:py-28">
                {/* Content column — left-aligned (no lg:ml-auto, unlike Services). */}
                <div className="max-w-md ">
                    {/* Green pill badge — solid fill, border adds visual definition */}
                    {/* against the photo bg. Variant of the About hero's bordered */}
                    {/* pill, but in green. */}
                    <span className="inline-flex items-center rounded-md  border-white border-1  bg-brand-green px-5 py-3 text-xs font-medium tracking-wide text-white">
            Health Screening Packages
          </span>

                    {/* Headline — two distinct lines per the design. */}
                    <h1
                        id="packages-hero-heading"
                        className="mt-6 text-4xl text-left  font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl"
                    >
                        Know your health.
                        <br/>
                        Protect your people.
                    </h1>

                    <p className="mt-6 text-base leading-relaxed text-white/85 sm:text-lg">
                        We offer health screening packages built for different needs.
                        Whether you are checking your own health, screening new staff or
                        meeting food safety requirements, everything is clearly priced and
                        available right here in Victoria Island.
                    </p>

                    {/* CTA — scrolls to the first packages section below. */}
                    <div className="mt-8">
                        <Button variant="primary" href="#wellness">
                            View Packages
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}