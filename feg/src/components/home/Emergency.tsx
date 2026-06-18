// src/components/home/Emergency.tsx
import { EMERGENCY_UNITS } from "../../data/site";
import { Button } from "../../ui/Button";
import emergencyBg from "../../assets/emergencyBg.jpg"; // dark ambulance photo

// Clip path taken directly from the Figma shape (394x461), normalized to the
// 0-1 objectBoundingBox space so it scales with the card. The shape is a
// rounded rectangle whose TOP-RIGHT corner is cut by a large diagonal sweep.
const CARD_CLIP =
    "M0.59594 0.0 L0.14729 0.0 C0.06593 0.0 0.0 0.0563 0.0 0.12578 " +
    "L0.0 0.87422 C0.0 0.9437 0.06593 1.0 0.14729 1.0 L0.85277 1.0 " +
    "C0.93407 1.0 1.0 0.9437 1.0 0.87422 L1.0 0.37089 " +
    "C1.0 0.33995 0.98664 0.3101 0.96249 0.28703 L0.70572 0.04193 " +
    "C0.67779 0.01526 0.63784 0.0 0.59594 0.0 Z";

export function Emergency() {
    return (
        <section className="relative isolate overflow-hidden">
            {/* Background photo + dark overlay */}
            <div className="absolute inset-0 -z-10">
                <img
                    src={emergencyBg}
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-brand-ink/55" />
            </div>

            {/* SVG defs holding the clip path. width/height 0 so it takes no space. */}
            <svg width="0" height="0" className="absolute" aria-hidden="true">
                <defs>
                    <clipPath id="emergency-card-clip" clipPathUnits="objectBoundingBox">
                        <path d={CARD_CLIP} />
                    </clipPath>
                </defs>
            </svg>

            <div className="mx-auto flex max-w-content lg:w-[85%] flex-col gap-8 lg:gap-40 px-4 py-16 md:flex-row md:items-end md:justify-center md:px-8 md:py-24">
                {/* White unit chips — DOM-first, shows left on desktop */}
                <div className="order-2 flex flex-wrap gap-6 md:order-1">
                    {EMERGENCY_UNITS.map((unit) => (
                        <div
                            key={unit.name}
                            className="rounded-xl bg-white px-6 py-4 leading-tight text-brand-red shadow-md"
                        >
                            <p className="text-sm font-bold">{unit.name}</p>
                            <p className="text-sm font-bold">{unit.detail}</p>
                            <p className="text-sm font-bold">{unit.note}</p>
                        </div>
                    ))}
                </div>

                {/* Frosted glass card — DOM-second, shows right on desktop. No ml-auto. */}
                <div
                    className="order-1 w-full max-w-md bg-white/10 backdrop-blur-md md:order-2"
                    style={{
                        clipPath:
                            typeof window !== "undefined" && window.innerWidth >= 768
                                ? "url(#emergency-card-clip)"
                                : "none",
                    }}
                >
                    <div className="p-8 pt-10 md:p-10 md:pr-14 md:pt-12">
                        <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                            If it is an emergency, we have it covered.
                        </h2>

                        <div className="mt-5 space-y-4 text-sm leading-relaxed text-white/85">
                            <p>
                                Our Adult ICU and NICU run around the clock, every day of the year.
                                Fully staffed and fully equipped for the most critical cases, from
                                premature newborns needing neonatal support to adults requiring
                                intensive life support.
                            </p>
                            <p>
                                Our 24/7 emergency service, pharmacy and laboratory are always open.
                                When time matters most, we do not make you wait.
                            </p>
                        </div>

                        <div className="mt-7">
                            <Button href="tel:09022012109" variant="red">
                                Call Emergency Line
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}