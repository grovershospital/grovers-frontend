import { Button } from "../../ui/Button";
import departmentHelpBg from "../../assets/services/departmentHelpBg.jpg";

// Top-right chamfered card — same path used by Founders / LabaCare / Emergency / Testimonials.
const CARD_CLIP =
    "M0.59594 0.0 L0.14729 0.0 C0.06593 0.0 0.0 0.0563 0.0 0.12578 " +
    "L0.0 0.87422 C0.0 0.9437 0.06593 1.0 0.14729 1.0 L0.85277 1.0 " +
    "C0.93407 1.0 1.0 0.9437 1.0 0.87422 L1.0 0.37089 " +
    "C1.0 0.33995 0.98664 0.3101 0.96249 0.28703 L0.70572 0.04193 " +
    "C0.67779 0.01526 0.63784 0.0 0.59594 0.0 Z";

export default function DepartmentHelp() {
    return (
        <section
            id="department-help"
            className="relative isolate overflow-hidden"
            aria-labelledby="department-help-heading"
        >
            {/* Background — consultation room, washed out via grayscale + light overlay */}
            {/* so the white frosted card has clear separation. */}
            <img
                src={departmentHelpBg}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 -z-20 h-full w-full object-cover grayscale"
            />
            <div className="absolute inset-0 -z-10 bg-white/20" aria-hidden="true" />

            {/* Section-scoped clip-path defs. */}
            <svg aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
                <defs>
                    <clipPath
                        id="department-help-clip"
                        clipPathUnits="objectBoundingBox"
                    >
                        <path d={CARD_CLIP} />
                    </clipPath>
                </defs>
            </svg>

            <div className="mx-auto w-full lg:w-[80%] max-w-content px-6  py-12 sm:py-16 lg:px-10 lg:py-20">
                {/* Card sits in the right column on desktop, full-width on mobile. */}
                {/* bg-white/80 is much more opaque than LabaCare's card because the */}
                {/* content here is dark text — needs a near-white surface to read. */}
                <div
                    className="ml-auto w-full max-w-md bg-white/80 backdrop-blur-md"
                    style={{ clipPath: "url(#department-help-clip)" }}
                >
                    <div className="px-8 py-10 sm:px-10 sm:py-12">
                        {/* Heading width is capped so it wraps clear of the top-right */}
                        {/* chamfer — same gotcha as Founders / LabaCare. */}
                        <h2
                            id="department-help-heading"
                            className="max-w-[16rem] text-2xl font-extrabold leading-tight text-brand-ink sm:text-3xl"
                        >
                            Not sure which department is right for you?
                        </h2>
                        <div className="mt-6 space-y-4 text-sm leading-relaxed text-brand-ink/80 sm:text-base">
                            <p>Our Family Medicine team is the best place to start.</p>
                            <p>
                                They will assess your condition, run any necessary tests and
                                direct you to the right specialist if needed.
                            </p>
                        </div>

                        <div className="mt-8">
                            <Button variant="red" href="/contact">
                                Book an appointment
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}