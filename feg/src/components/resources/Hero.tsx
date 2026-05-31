import { Button } from "../../ui/Button";
import resourcesHero from "../../assets/resources/resourcesHero.jpg";

export default function Hero() {
    return (
        <section
            id="resources-hero"
            className="relative isolate overflow-hidden"
            aria-labelledby="resources-hero-heading"
        >
            {/* Background photo — globe with stethoscope */}
            <img
                src={resourcesHero}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 -z-10 bg-black/40" aria-hidden="true" />

            <div className="mx-auto w-full lg:w-[80%] max-w-content px-6 py-20 sm:py-24 lg:px-10 lg:py-28">
                {/* Content column — right-aligned on desktop (mirror of Services hero). */}
                <div className="max-w-md lg:ml-auto">
                    {/* Headline — three lines forced via <br />, matching the design's */}
                    {/* intentional wrap. No pill badge on this hero. */}
                    <h1
                        id="resources-hero-heading"
                        className="text-4xl text-left lg:w-[94%]  font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl"
                    >
                        Health resources for
                        Lagos <br/>  families and
                        <br />
                        professionals.
                    </h1>

                    <p className="mt-6 text-base leading-relaxed text-white/85 sm:text-lg">
                        We write about the things that matter. Lifestyle diseases, health
                        checks, what your results mean and how to take better care of
                        yourself and the people around you.
                    </p>

                    <div className="mt-8">
                        <Button variant="primary" href="/contact">
                            Book an Appointment
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}