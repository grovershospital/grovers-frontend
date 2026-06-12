import basBg from "../../assets/packages-page/basBg.png";

const PACKAGE_HELP_CLIP =
    "M0.18 0 " +
    "L0.72 0 " +
    "C0.76 0 0.79 0.02 0.82 0.06 " +
    "L0.96 0.22 " +
    "C0.99 0.26 1 0.31 1 0.36 " +
    "L1 0.82 " +
    "C1 0.92 0.92 1 0.82 1 " +
    "L0.18 1 " +
    "C0.08 1 0 0.92 0 0.82 " +
    "L0 0.18 " +
    "C0 0.08 0.08 0 0.18 0 Z";

export default function PackageHelp() {
    return (
        <section
            id="package-help"
            className="relative isolate overflow-hidden"
            aria-labelledby="package-help-heading"
        >
            <img
                src={basBg}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 -z-20 h-full w-full object-cover grayscale"
            />

            <div
                className="absolute inset-0 -z-10 bg-black/30"
                aria-hidden="true"
            />

            <svg
                aria-hidden="true"
                className="absolute h-0 w-0 overflow-hidden"
            >
                <defs>
                    <clipPath
                        id="package-help-clip"
                        clipPathUnits="objectBoundingBox"
                    >
                        <path d={PACKAGE_HELP_CLIP} />
                    </clipPath>
                </defs>
            </svg>

            <div className="mx-auto max-w-content w-full px-6 py-12 sm:py-16 lg:w-[70%] lg:px-10 lg:py-32">
                <div
                    className="w-full max-w-md min-h-[29rem] bg-white/80 backdrop-blur-md"
                    style={{ clipPath: "url(#package-help-clip)" }}
                >
                    <div className="flex min-h-[29rem] flex-col justify-center px-10 sm:px-12">
                        <div className="-translate-y-1">
                            <h2
                                id="package-help-heading"
                                className="max-w-[20rem] text-2xl font-extrabold leading-tight text-brand-ink sm:text-3xl"
                            >
                                Not sure where to start?
                            </h2>

                            <p className="mt-6 max-w-[18rem] text-sm leading-relaxed text-brand-ink/80 sm:text-base">
                                Call us and we will point you in the right
                                direction.
                            </p>

                            <div className="mt-10">
                                <a
                                    href="/contact"
                                    className="inline-flex items-center justify-center rounded-full bg-blue-600 px-14 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                                >
                                    Book a Screening
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}