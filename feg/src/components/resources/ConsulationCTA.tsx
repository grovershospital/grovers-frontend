import { Button } from "../../ui/Button";
import consultationBg from "../../assets/resources/consultationBg.jpg";

// Top-right chamfered card — same path used across the site
// (Founders / LabaCare / Emergency / Testimonials / DepartmentHelp / PackageHelp).
const CARD_CLIP =
    "M0.59594 0.0 L0.14729 0.0 C0.06593 0.0 0.0 0.0563 0.0 0.12578 " +
    "L0.0 0.87422 C0.0 0.9437 0.06593 1.0 0.14729 1.0 L0.85277 1.0 " +
    "C0.93407 1.0 1.0 0.9437 1.0 0.87422 L1.0 0.37089 " +
    "C1.0 0.33995 0.98664 0.3101 0.96249 0.28703 L0.70572 0.04193 " +
    "C0.67779 0.01526 0.63784 0.0 0.59594 0.0 Z";

export default function ConsultationCTA() {
    return (
        <section
            id="consultation-cta"
            className="relative isolate overflow-hidden"
            aria-labelledby="consultation-cta-heading"
        >
            {/* Background — medic holding a red heart figure. Not grayscaled */}
            {/* because the photo's color (especially the red heart) is intentional. */}
            <img
                src={consultationBg}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 -z-20 h-full w-full object-cover"
            />
            {/* Subtle dark overlay so the white frosted card has clear contrast */}
            {/* without flattening the photo's color. */}
            <div className="absolute inset-0 -z-10 bg-black/15" aria-hidden="true" />

            {/* Section-scoped clip-path defs. */}
            <svg aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
                <defs>
                    <clipPath
                        id="consultation-cta-clip"
                        clipPathUnits="objectBoundingBox"
                    >
                        <path d={CARD_CLIP} />
                    </clipPath>
                </defs>
            </svg>

            <div className="mx-auto w-full lg:w-[70%] max-w-content px-6 py-16 sm:py-20 lg:px-10 lg:py-24">
                {/* Card on the right — same as DepartmentHelp. */}
                <div
                    className="ml-auto w-full max-w-md bg-white/80 backdrop-blur-md"
                    style={{ clipPath: "url(#consultation-cta-clip)" }}
                >
                    <div className="px-8 py-10 sm:px-10 sm:py-12">
                        {/* Heading width capped so it wraps clear of the top-right */}
                        {/* chamfer. Single sentence — natural wrapping handles the */}
                        {/* 4-line layout shown in the design. */}
                        <h2
                            id="consultation-cta-heading"
                            className="max-w-[16rem] text-2xl font-extrabold leading-tight text-brand-ink sm:text-3xl"
                        >
                            Our team is here to help you, book a consultation and we will take
                            it from there.
                        </h2>

                        {/* Two stacked CTAs. flex flex-col stretches them to equal width */}
                        {/* via default align-items: stretch — matches the design where */}
                        {/* both buttons are visually the same size. */}
                        <div className="mt-8 flex flex-col gap-8">
                            <Button variant="primary" className={'py-4 px-7'} href="/patient-portal/login">
                                Book an appointment
                            </Button>
                            <Button variant="red" className={'py-4 px-7'} href="tel:09022012109">
                                Emergency Response
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}