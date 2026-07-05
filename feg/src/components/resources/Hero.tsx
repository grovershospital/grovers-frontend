import {Button} from "../../ui/Button";
import resourcesHero from "../../assets/resources/resourcesHero.jpg";

export default function Hero() {
    return (
        <section
            id="resources-hero"
            className="relative isolate overflow-hidden"
            aria-labelledby="resources-hero-heading"
        >
            <img
                src={resourcesHero}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 -z-10 bg-black/40" aria-hidden="true"/>

            <div
                className="mx-auto w-full max-w-content px-6 py-14 min-[390px]:py-16 sm:py-24 lg:w-[80%] lg:px-10 lg:py-28">
                <div className="max-w-md lg:ml-auto">
                    <h1
                        id="resources-hero-heading"
                        className="text-left text-[30px] font-extrabold leading-[1.08] tracking-tight text-white min-[390px]:text-[34px] sm:text-5xl"
                    >
                        {/* Mobile & tablet — natural wrap, no forced breaks */}
                        <span className="block lg:hidden">
        Health resources for Lagos families and professionals.
    </span>

                        {/* Desktop — forced three-line layout */}
                        <span className="hidden lg:block">
        Health resources for
        Lagos families and
        professionals.
    </span>
                    </h1>
                    <p className="mt-5 text-sm leading-relaxed text-white/85 min-[390px]:text-base sm:mt-6 sm:text-lg">
                        We write about the things that matter. Lifestyle diseases, health
                        checks, what your results mean and how to take better care of
                        yourself and the people around you.
                    </p>

                    <div className="mt-7 sm:mt-8">
                        <Button variant="primary" href="/patient-portal/login">
                            Book an Appointment
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}