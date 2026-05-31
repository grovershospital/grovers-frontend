import basBg from "../../assets/packages-page/basBg.png";

// Top-right chamfered card — same path used by Founders / LabaCare / Emergency /
// Testimonials / DepartmentHelp.
const CARD_CLIP =
    "M0.59594 0.0 L0.14729 0.0 C0.06593 0.0 0.0 0.0563 0.0 0.12578 " +
    "L0.0 0.87422 C0.0 0.9437 0.06593 1.0 0.14729 1.0 L0.85277 1.0 " +
    "C0.93407 1.0 1.0 0.9437 1.0 0.87422 L1.0 0.37089 " +
    "C1.0 0.33995 0.98664 0.3101 0.96249 0.28703 L0.70572 0.04193 " +
    "C0.67779 0.01526 0.63784 0.0 0.59594 0.0 Z";

export default function PackageHelp() {
    return (
        <section
            id="package-help"
            className="relative isolate overflow-hidden"
            aria-labelledby="package-help-heading"
        >
            {/* Background — medical scene, grayscale + dark overlay so the white */}
            {/* frosted card stands out clearly. */}
            <img
                src={basBg}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 -z-20 h-full w-full object-cover grayscale"
            />
            <div className="absolute inset-0 -z-10 bg-black/30" aria-hidden="true" />

            {/* Section-scoped clip-path defs. */}
            <svg aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
                <defs>
                    <clipPath id="package-help-clip" clipPathUnits="objectBoundingBox">
                        <path d={CARD_CLIP} />
                    </clipPath>
                </defs>
            </svg>

            <div className="mx-auto w-full max-w-content px-6 py-12 sm:py-16 lg:px-10 lg:py-20">
                {/* Card sits in the LEFT column. Mirror of DepartmentHelp which */}
                {/* uses ml-auto for right-positioning — here we leave it at the */}
                {/* default left position. */}
                <div
                    className="w-full max-w-md bg-white/80 backdrop-blur-md"
                    style={{ clipPath: "url(#package-help-clip)" }}
                >
                    <div className="px-8 py-10 sm:px-10 sm:py-12">
                        {/* Heading width capped so it wraps clear of the top-right */}
                        {/* chamfer — same gotcha as Founders / LabaCare / DepartmentHelp. */}
                        <h2
                            id="package-help-heading"
                            className="max-w-[16rem] text-2xl font-extrabold leading-tight text-brand-ink sm:text-3xl"
                        >
                            Not sure where to start?
                        </h2>
                        <p className="mt-6 text-sm leading-relaxed text-brand-ink/80 sm:text-base">
                            Call us and we will point you in the right direction.
                        </p>

                        {/* Violet CTA — inline <a> since Button has no violet variant. */}
                        {/* If this color recurs, promote to a Button variant. */}
                        <div className="mt-8">
                            <a
                                href="/contact"
                                className="inline-flex items-center justify-center rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                            >
                                Book a Screening
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}