import { Button } from "../../ui/Button";
import ctaBg from "../../assets/resources/ctaBg.jpg";

// Top-right chamfered card — same path used across the site.
const CARD_CLIP =
    "M0.59594 0.0 L0.14729 0.0 C0.06593 0.0 0.0 0.0563 0.0 0.12578 " +
    "L0.0 0.87422 C0.0 0.9437 0.06593 1.0 0.14729 1.0 L0.85277 1.0 " +
    "C0.93407 1.0 1.0 0.9437 1.0 0.87422 L1.0 0.37089 " +
    "C1.0 0.33995 0.98664 0.3101 0.96249 0.28703 L0.70572 0.04193 " +
    "C0.67779 0.01526 0.63784 0.0 0.59594 0.0 Z";

export default function ArticleConsultationCTA() {
    return (
        <section
            id="article-consultation-cta"
            className="relative isolate overflow-hidden"
            aria-labelledby="article-consultation-cta-heading"
        >
            {/* Same background photo as the Resources page CTA — keeps visual */}
            {/* consistency between the listing CTA and the per-article CTA. */}
            <img
                src={ctaBg}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 -z-20 h-full w-full object-cover"
            />
            <div className="absolute inset-0 -z-10 bg-black/15" aria-hidden="true" />

            <svg aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
                <defs>
                    <clipPath
                        id="article-consultation-cta-clip"
                        clipPathUnits="objectBoundingBox"
                    >
                        <path d={CARD_CLIP} />
                    </clipPath>
                </defs>
            </svg>

            <div className="mx-auto w-full lg:w-[70%] max-w-content px-6 py-16 sm:py-20 lg:px-10 lg:py-24">
                <div
                    className="ml-auto w-full max-w-md bg-white/80 backdrop-blur-md"
                    style={{ clipPath: "url(#article-consultation-cta-clip)" }}
                >
                    <div className="px-8 py-10 sm:px-10 sm:py-12">
                        <h2
                            id="article-consultation-cta-heading"
                            className="max-w-[16rem] text-2xl font-extrabold leading-tight text-brand-ink sm:text-3xl"
                        >
                            When last did you check your blood pressure?
                        </h2>
                        <p className="mt-5 text-sm leading-relaxed text-brand-ink/80 sm:text-base">
                            A blood pressure check takes minutes. Book a consultation with
                            our Family Medicine or Internal Medicine team today.
                        </p>

                        <div className="mt-8 flex flex-col gap-5">
                            <Button variant="primary" href="/patient-portal">
                                Book an appointment
                            </Button>
                            <Button variant="red" href="tel:09022012109">
                                Emergency Response
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}