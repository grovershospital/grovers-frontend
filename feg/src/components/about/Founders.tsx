import owner from "../../assets/about-page/owner.png";

// Chamfered top-right card shape — normalized to 0–1 for objectBoundingBox.
// Same path used by Emergency / Testimonials on the homepage; defined here
// so the section is self-contained on the About route.
const CARD_CLIP =
    "M0.59594 0.0 L0.14729 0.0 C0.06593 0.0 0.0 0.0563 0.0 0.12578 " +
    "L0.0 0.87422 C0.0 0.9437 0.06593 1.0 0.14729 1.0 L0.85277 1.0 " +
    "C0.93407 1.0 1.0 0.9437 1.0 0.87422 L1.0 0.37089 " +
    "C1.0 0.33995 0.98664 0.3101 0.96249 0.28703 L0.70572 0.04193 " +
    "C0.67779 0.01526 0.63784 0.0 0.59594 0.0 Z";

export default function Founders() {
    return (
        <section
            id="founders"
            className="bg-black py-16 sm:py-20 lg:py-28"
            aria-labelledby="founders-heading"
        >
            {/* Local SVG defs for the chamfered card clip-path. */}
            <svg aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
                <defs>
                    <clipPath
                        id="founders-card-clip"
                        clipPathUnits="objectBoundingBox"
                    >
                        <path d={CARD_CLIP} />
                    </clipPath>
                </defs>
            </svg>

            <div className="mx-auto w-full max-w-content px-6 lg:px-10 lg:w-[70%]">
                <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-44">
                    {/* Photo column */}
                    <figure className="mx-auto w-full max-w-md">
                        <div className="overflow-hidden rounded-2xl">
                            <img
                                src={owner}
                                alt="Chief Dr. Anil Grover and Dr. Arvinder Grover, founders of Grover's Hospital"
                                className="block h-auto w-full"
                            />
                        </div>
                        <figcaption className="mt-6 text-center">
                            <p className="text-base font-extrabold text-white sm:text-lg">
                                Chief Dr. Anil Grover and Dr. Arvinder Grover
                            </p>
                            <p className="mt-1 text-sm text-white/70">
                                Founders, Grover&rsquo;s Hospital
                            </p>
                        </figcaption>
                    </figure>

                    {/* Chamfered card. No aspect-ratio: the card grows with content. */}
                    {/* The chamfer scales with the box but stays anchored to the top-right. */}
                    <div
                        className="mx-auto w-full max-w-md bg-stone-800"
                        style={{ clipPath: "url(#founders-card-clip)" }}
                    >
                        <div className="px-8 py-10 sm:px-10 sm:py-12">
                            {/* Heading width is capped so it wraps to short lines and stays */}
                            {/* clear of the top-right chamfer cut. */}
                            <h2
                                id="founders-heading"
                                className="max-w-[15rem] text-2xl font-extrabold leading-tight text-white"
                            >
                                We built Grover&rsquo;s because Lagos deserves better.
                            </h2>
                            <div className="mt-8 space-y-4 text-sm leading-relaxed text-white/80">
                                <p>
                                    When we founded this hospital in 2017, we brought more than
                                    two decades of experience in Nigerian healthcare. We had
                                    seen what was missing: hospitals that treated illness but
                                    rarely focused on preventing it. Facilities that were
                                    reactive, not proactive. Places that did not truly partner
                                    with their patients for the long term.
                                    <br />
                                    Grover&rsquo;s Hospital was built to be different.
                                </p>
                                <p>
                                    From day one, our focus has been on the whole person, not
                                    just the condition. We invest in the latest technology,
                                    recruit the best consultants and maintain a standard of
                                    care that meets international benchmarks, all while keeping
                                    our roots firmly in the Nigerian community we serve.
                                    <br />
                                    We are proud of what this hospital has become. And we are
                                    committed to what it will continue to be.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}