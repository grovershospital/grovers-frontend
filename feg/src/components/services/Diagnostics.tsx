const DIAGNOSTIC_CARDS = [
    {
        title: "Laboratory services",
        body: "Full blood count, blood sugar (fasting and random), lipid profile, liver function tests, kidney function tests, thyroid function tests, hormonal panels, HIV screening, Hepatitis B and C testing, malaria parasite testing, urinalysis, stool microscopy, genotype and blood group testing, VDRL (syphilis testing), H. pylori testing, serum tuberculosis testing, sputum microscopy, pregnancy testing, drug abuse and toxicology panel and comprehensive diagnostic panels.",
    },
    {
        title: "Imaging and Radiology",
        body: "X-ray (chest and general), ultrasound scan including abdomino-pelvic scan, echocardiography, ECG, Holter ECG, Doppler scans and sleep apnoea study.",
    },
] as const;

export default function Diagnostics() {
    return (
        <section
            id="diagnostics"
            className="bg-[#f9f7f0] py-16 sm:py-20 lg:py-24"
            aria-labelledby="diagnostics-heading"
        >
            <div className="mx-auto w-full max-w-content px-6 lg:px-10">
                {/* Heading + intro */}
                <h2
                    id="diagnostics-heading"
                    className="mx-auto max-w-2xl text-center text-3xl font-extrabold leading-tight text-brand-blue sm:text-4xl"
                >
                    Accurate results, around the clock.
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-relaxed text-brand-ink sm:text-base">
                    Good diagnosis is the foundation of good treatment. Our laboratory and
                    radiology services run 24 hours a day, 7 days a week, ensuring our
                    medical team always has the precise information needed to make the
                    right decisions quickly.
                </p>

                {/* Two diagnostic cards — centered content, outlined */}
                <div className="mt-12 grid gap-5 sm:grid-cols-2">
                    {DIAGNOSTIC_CARDS.map((card) => (
                        <div
                            key={card.title}
                            className="rounded-2xl border border-neutral-400/60 p-8 text-center"
                        >
                            <h3 className="text-base font-extrabold text-brand-ink">
                                {card.title}
                            </h3>
                            <p className="mt-4 text-xs leading-relaxed text-brand-ink/80 sm:text-sm">
                                {card.body}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Availability footer */}
                <p className="mt-10 text-center text-sm font-extrabold text-brand-red sm:text-base">
                    Available: 24 hours a day, 7 days a week.
                </p>
            </div>
        </section>
    );
}