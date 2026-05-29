const VALUES = [
    {
        title: "Quality",
        body: "We adhere to both Nigerian and international medical standards. Every procedure, from a routine check-up to complex surgery, meets the highest levels of safety and care.",
    },
    {
        title: "Empowerment",
        body: "We equip our patients with the knowledge they need to take charge of their own health. Clear communication, honest conversations and a team that always has time to explain.",
    },
    {
        title: "Inclusivity",
        body: "Our doors are open to everyone. We serve the Nigerian community and the expat community with equal respect, dignity and expertise.",
    },
    {
        title: "Community",
        body: "Our responsibility extends beyond our walls. We bring care directly to corporate organisations through satellite clinics and community health partnerships across Lagos.",
    },
] as const;

export default function Principles() {
    return (
        <section
            id="principles"
            className="bg-[#f9f7f0] py-16 sm:py-20 lg:py-24"
            aria-labelledby="principles-heading"
        >
            <div className="mx-auto w-full max-w-content lg:w-[80%] px-6 lg:px-10">
                {/* Heading */}
                <h2
                    id="principles-heading"
                    className="mx-auto max-w-2xl text-center text-3xl lg:w-[40%] font-extrabold leading-tight text-brand-green sm:text-4xl"
                >
                    The principles behind everything we do.
                </h2>

                {/* Mission / Vision — centered, mid-width column on desktop */}
                <div className="mx-auto mt-12 grid max-w-3xl gap-10 sm:grid-cols-2 sm:gap-12">
                    <div className="text-center">
                        <h3 className="text-base font-extrabold text-brand-red">Mission</h3>
                        <p className="mt-3 text-sm leading-relaxed text-brand-ink sm:text-base">
                            To enhance the health and well-being of our patients by providing
                            affordable, high-quality preventive and clinical care for all
                            diseases and conditions, driven by patient-centred best practices.
                        </p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-base font-extrabold text-brand-red">Vision</h3>
                        <p className="mt-3 text-sm leading-relaxed text-brand-ink sm:text-base">
                            To be the first-choice medical institution in Nigeria for
                            all-encompassing diseases, intensive care and lifestyle diseases.
                            To be the benchmark for excellence and advanced care delivery in
                            the region.
                        </p>
                    </div>
                </div>

                {/* Four value cards — 1 / 2 / 4 columns at sm / lg */}
                <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {VALUES.map((value) => (
                        <li
                            key={value.title}
                            className="rounded-2xl border border-neutral-400/60 p-6 sm:p-7"
                        >
                            <h3 className="text-sm font-extrabold text-brand-ink">
                                {value.title}
                            </h3>
                            <p className="mt-3 text-xs leading-relaxed text-brand-ink/80 sm:text-sm">
                                {value.body}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}