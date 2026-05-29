import {TESTIMONIALS} from "../../data/site";
import ctaBg2 from '../../assets/ctaBg2.jpg';

const CARD_CLIP =
    "M0.59594 0.0 L0.14729 0.0 C0.06593 0.0 0.0 0.0563 0.0 0.12578 " +
    "L0.0 0.87422 C0.0 0.9437 0.06593 1.0 0.14729 1.0 L0.85277 1.0 " +
    "C0.93407 1.0 1.0 0.9437 1.0 0.87422 L1.0 0.37089 " +
    "C1.0 0.33995 0.98664 0.3101 0.96249 0.28703 L0.70572 0.04193 " +
    "C0.67779 0.01526 0.63784 0.0 0.59594 0.0 Z";

export function Testimonials() {
    return (
        <section className="relative isolate overflow-hidden py-16 md:py-24">
            {/*Background*/}
            <div className={'absolute inset-0 -z-10'}>
                <img src={ctaBg2} alt="" aria-hidden="true" className="h-full w-full object-cover opacity-40"/>
            </div>
            {/* clip path defs */}
            <svg width="0" height="0" className="absolute" aria-hidden="true">
                <defs>
                    <clipPath id="testimonial-clip" clipPathUnits="objectBoundingBox">
                        <path d={CARD_CLIP}/>
                    </clipPath>
                </defs>
            </svg>

            <div className="mx-auto max-w-content lg:w-[65%] px-4 md:px-8">
                <h2 className="text-2xl font-extrabold text-black sm:text-3xl">
                    The Care Speaks for Itself
                </h2>

                <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {TESTIMONIALS.map((t) => (
                        <figure
                            key={t.author}
                            className="flex min-h-[330px] w-full max-w-[300px] flex-col justify-center bg-[#f9f7f0] p-7 pr-10 pt-12"
                            style={{clipPath: "url(#testimonial-clip)"}}
                        >
                            <blockquote className="text-xs leading-relaxed text-brand-ink/80">
                                {t.quote}
                            </blockquote>
                            <figcaption className="mt-6 text-sm font-bold text-brand-ink">
                                {t.author}
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
}