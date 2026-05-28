import { STATS } from "../../data/site";

export function Stats() {
    return (
        <section className="w-full bg-[#f7f4ef] py-12 md:py-16">
            <div className="mx-auto grid max-w-content grid-cols-1 gap-6 px-4 md:grid-cols-3 md:px-8 lg:w-[70%]">
                {STATS.map((stat) => (
                    <div
                        key={stat.label}
                        className="rounded-2xl border border-brand-ink/15 p-6"
                    >
                        <p className="text-4xl font-extrabold text-brand-ink">{stat.value}</p>
                        <p className="mt-1 text-sm font-bold text-brand-ink">{stat.label}</p>
                        <p className="mt-4 text-xs leading-relaxed text-brand-ink/70">
                            {stat.blurb}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}