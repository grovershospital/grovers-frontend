// src/components/home/CTA.tsx
import {Button} from "../../ui/Button";
import doctorleft from "../../assets/doctorleft.png";
import doctorLady from "../../assets/doctorLady.png";
import ctaBg1 from '../../assets/ctaBg1.jpg'

export function CTA() {
    return (
        <section className="relative isolate overflow-hidden">
            <div className="absolute inset-0 -z-10">
                <img src={ctaBg1} alt="" aria-hidden="true" className="h-full w-full object-cover opacity-40"/>
            </div>

            <div className="mx-auto flex max-w-content items-end justify-center gap-4 px-4 md:px-8 lg:w-[70%]">
                {/* Left doctor — hidden on small screens to keep text readable */}
                <img
                    src={doctorleft}
                    alt=""
                    aria-hidden="true"
                    className="hidden h-auto w-1/4 max-w-[280px] self-end object-contain lg:block"
                />

                {/* Center text */}
                <div className="flex-1 py-16 text-center md:py-24">
                    <h2 className="mx-auto max-w-xl text-3xl font-extrabold leading-tight   text-brand-ink sm:text-4xl">
                        From everyday health to specialist care, we have you covered.
                    </h2>
                    <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-brand-ink/70">
                        We believe everyone deserves access to high-quality specialist care
                        without the stress of searching. With experts from Family Medicine to
                        Cardiology and ENT, we ensure that specialized medical support is a
                        constant presence here at Grover&apos;s.
                    </p>
                    <div className="mt-8 flex justify-center">
                        <Button href="/schedule" variant="primary">
                            View Full Schedule
                        </Button>
                    </div>
                </div>

                {/* Right doctor */}
                <img
                    src={doctorLady}
                    alt=""
                    aria-hidden="true"
                    className="hidden h-auto w-1/4 max-w-[280px] self-end object-contain lg:block"
                />
            </div>
        </section>
    );
}