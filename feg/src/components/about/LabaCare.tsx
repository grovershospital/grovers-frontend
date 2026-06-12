import { Button } from "../../ui/Button";
import learnMoreBg from "../../assets/about-page/learnMoreBg.png";
import labacareAbout from "../../assets/about-page/labacareAbout.png";

// Top-right chamfered card — same path used by Founders / Emergency / Testimonials.
const CARD_CLIP =
    "M0.72 0.0 L0.14729 0.0 C0.06593 0.0 0.0 0.0563 0.0 0.12578 " +
    "L0.0 0.87422 C0.0 0.9437 0.06593 1.0 0.14729 1.0 L0.85277 1.0 " +
    "C0.93407 1.0 1.0 0.9437 1.0 0.87422 L1.0 0.30 " +
    "C1.0 0.27 0.99 0.24 0.97 0.22 L0.82 0.04 " +
    "C0.79 0.015 0.76 0.0 0.72 0.0 Z";

export default function LabaCare() {
    return (
        <section
            id="labacare"
            className="relative isolate overflow-hidden"
            aria-labelledby="labacare-heading"
        >
            {/* Background — building photo, forced to greyscale via CSS. */}
            <img
                src={learnMoreBg}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 -z-20 h-full w-full object-cover grayscale"
            />
            {/* Soft dark overlay for legibility behind the frosted-glass card. */}
            <div className="absolute inset-0 -z-10 bg-black/30" aria-hidden="true" />

            {/* Section-scoped clip-path defs. */}
            <svg aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
                <defs>
                    <clipPath
                        id="labacare-card-clip"
                        clipPathUnits="objectBoundingBox"
                    >
                        <path d={CARD_CLIP} />
                    </clipPath>
                </defs>
            </svg>

            <div className="mx-auto w-full lg:w-[70%] max-w-content px-6 py-12 sm:py-16 lg:px-10 lg:py-20">
                {/* Card + lockup share a flex row. items-end bottom-aligns them, */}
                {/* so the lockup rises to meet the card's bottom edge no matter */}
                {/* how the card's content height changes. */}
                <div className="flex items-end justify-between gap-6">
                    {/* Frosted-glass card with top-right chamfer. */}
                    <div
                        className="w-full max-w-md bg-white/15 backdrop-blur-md"
                        style={{ clipPath: "url(#labacare-card-clip)" }}
                    >
                        <div className="px-8 py-10 sm:px-10 sm:py-12">
                            {/* Heading width capped so it wraps clear of the chamfer. */}
                            <h2
                                id="labacare-heading"
                                className="lg:w-[84%] text-xl font-extrabold leading-tight text-brand-ink sm:text-3xl"
                            >
                                World-class hospital management, built into everything we do.
                            </h2>
                            <p className="mt-6 text-sm leading-relaxed text-brand-ink/80 sm:text-base">
                                Grover&rsquo;s Hospital is operated by LABACare, a professional
                                hospital management company that integrates operational
                                expertise directly into the hospital. From supply chain and
                                power management to billing, digital platforms and patient
                                experience, LABACare ensures that the systems behind the care
                                are as strong as the care itself.
                            </p>

                            <div className="mt-8">
                                <Button variant="primary" href="https://labacare.com">
                                    Learn more about LABACare
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* "OPERATED BY LABACare" lockup — bottom-aligned with the card */}
                    {/* via the parent's items-end. Hidden on mobile where it would */}
                    {/* crowd the card. */}
                    <img
                        src={labacareAbout}
                        alt="Operated by LABACare"
                        className="hidden h-12 w-auto shrink-0 sm:block lg:h-20"
                    />
                </div>
            </div>
        </section>
    );
}