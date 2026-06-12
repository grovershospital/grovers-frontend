import { Button } from "../../ui/Button";
import servicesBg from "../../assets/services/servicesBg.png";

export default function Hero() {
    return (
        <section
            id="services-hero"
            className="relative isolate overflow-hidden"
            aria-labelledby="services-hero-heading"
        >
            {/* Background photo */}
            <img
                src={servicesBg}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
            />
            {/* Dark overlay — lighter than About hero so the keyboard reads through. */}
            <div className="absolute inset-0 -z-10 bg-black/40" aria-hidden="true" />

            <div className="mx-auto w-full lg:w-[80%] max-w-content px-6 py-20 sm:py-24 lg:px-10 lg:py-28">
                {/* Content column — left-aligned within itself, pushed right on lg+. */}
                <div className="max-w-md lg:ml-auto">
                    {/* Green pill badge — solid fill, white text. */}
                    <span className="inline-flex items-center rounded-md bg-brand-green px-5 py-3 text-xs font-medium tracking-wide text-white border-l-white border-1">
            Our Departments. Our Specialists.
          </span>

                    <h1
                        id="services-hero-heading"
                        className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl w-full"
                    >
                        Our specialist clinics covers every stage of your health journey.
                    </h1>

                    <p className="mt-6 text-base leading-relaxed text-white/85 sm:text-lg">
                        From routine family medicine to complex surgery, Grover&rsquo;s
                        Hospital has the right specialist for you. Our consultants are
                        available across the week, all from our facility in Victoria
                        Island, Lagos.
                    </p>

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