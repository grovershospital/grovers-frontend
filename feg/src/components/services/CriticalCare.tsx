import { Button } from "../../ui/Button";

const ICU_CARDS = [
    {
        title: "Adult ICU",
        paragraphs: [
            "A 3-bed intensive care unit staffed 24/7 by a multidisciplinary team of intensivists, physicians, nurses and healthcare professionals. Equipped with state-of-the-art monitoring tools and life-saving ventilators.",
            "Conditions managed: severe respiratory distress, cardiac emergencies, post-surgical complications, multi-organ failure, severe sepsis and critical neurological events. Our ICU has a proven track record of managing critically ill patients, including during the COVID-19 pandemic.",
        ],
    },
    {
        title: "Neonatal ICU",
        paragraphs: [
            "Neonatal Intensive Care for premature and critically ill newborns. Features modern incubators and baby warmers with round-the-clock specialist support. Focused on accurate diagnosis, careful monitoring and compassionate support for families throughout.",
            "Conditions managed: premature birth, neonatal respiratory distress, low birth weight complications, neonatal sepsis and birth complications.",
        ],
    },
] as const;

const TWENTY_FOUR_SEVEN_SERVICES = [
    "Emergency assessment and stabilisation",
    "24/7 Pharmacy",
    "24/7 Laboratory",
    "Ambulance service",
];

export default function CriticalCare() {
    return (
        <section
            id="critical-care"
            className="bg-[#f9f7f0] py-16 sm:py-20 lg:py-24"
            aria-labelledby="critical-care-heading"
        >
            <div className="mx-auto w-full max-w-content px-6 lg:px-10">
                {/* Heading + intro */}
                <h2
                    id="critical-care-heading"
                    className="mx-auto max-w-2xl text-center text-3xl font-extrabold leading-tight text-brand-green sm:text-4xl"
                >
                    When it matters most, we are ready for you.
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-relaxed text-brand-ink sm:text-base">
                    Our Adult ICU and NICU operate around the clock, every day of the
                    year. Staffed by experienced critical care professionals and equipped
                    with advanced life-support systems, we are structured to handle the
                    most severe and complex cases without delay.
                </p>

                {/* Two ICU cards — fully centered content, outlined */}
                <div className="mt-12 grid gap-5 sm:grid-cols-2">
                    {ICU_CARDS.map((card) => (
                        <div
                            key={card.title}
                            className="rounded-2xl border border-neutral-400/60 p-8 text-center"
                        >
                            <h3 className="text-base font-extrabold text-brand-ink">
                                {card.title}
                            </h3>
                            <div className="mt-4 space-y-4 text-xs leading-relaxed text-brand-ink/80 sm:text-sm">
                                {card.paragraphs.map((p, i) => (
                                    <p key={i}>{p}</p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 24/7 Services subsection — all red */}
                <div className="mt-12 text-center">
                    <h3 className="text-lg font-extrabold text-brand-red">
                        24/7 Services
                    </h3>
                    <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-brand-red sm:text-base">
                        {TWENTY_FOUR_SEVEN_SERVICES.join(" | ")}
                    </p>
                    <div className="mt-6 flex justify-center">
                        <Button variant="red" href="tel:09022012109">
                            Call for Emergency
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}