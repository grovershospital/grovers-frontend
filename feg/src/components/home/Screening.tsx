import { PACKAGES } from "../../data/site";
import { Button } from "../../ui/Button";

// Package card images -> src/assets/packages/. Match filenames below.
const packageImages = import.meta.glob<{ default: string }>(
    "../../assets/packages/*.{jpg,png,webp}",
    { eager: true }
);

const IMAGE_FOR: Record<string, string> = {
    "Pre-Employment Test": "pre-employment.jpg",
    "Domestic Staff Screening": "domestic-staff.jpg",
    "Annual Wellness Test": "annual-wellness.jpg",
};

function imageFor(name: string): string | undefined {
    const filename = IMAGE_FOR[name];
    if (!filename) return undefined;
    const entry = Object.entries(packageImages).find(([path]) =>
        path.endsWith(`/${filename}`)
    );
    return entry?.[1].default;
}

export function Screening() {
    return (
        <section className="w-full bg-[#f7f4ef] py-16 md:py-24">
            <div className="mx-auto max-w-content px-4 md:px-8">
                {/* Heading */}
                <h2 className="mx-auto max-w-2xl text-center text-3xl font-extrabold leading-tight text-brand-blue sm:text-4xl">
                    Health screening packages for individuals, families and businesses.
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-relaxed text-brand-ink/70">
                    We offer three health screening packages built for Lagos families and
                    businesses. Pre-employment screening, domestic staff checks, food handler
                    tests and annual wellness checks. Every package comes with transparent
                    pricing, multiple tiers and results you can act on.
                </p>

                {/* Package cards: 1 col mobile, 3 cols from md */}
                <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 lg:w-[70%] mx-auto">
                    {PACKAGES.map((pkg) => {
                        const img = imageFor(pkg.name);
                        return (
                            <article key={pkg.name} className="flex flex-col text-center">
                                {/* Image */}
                                <div className="mb-5 aspect-[4/3] w-full overflow-hidden rounded-lg bg-brand-ink/5">
                                    {img ? (
                                        <img
                                            src={img}
                                            alt={pkg.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : null}
                                </div>

                                <h3 className="text-lg font-bold text-brand-ink">{pkg.name}</h3>
                                <p className="mt-3 grow text-xs leading-relaxed text-brand-ink/70">
                                    {pkg.blurb}
                                </p>

                                <div className="mt-6 flex justify-center">
                                    <Button href="/packages" variant="green" className="w-full max-w-[220px]">
                                        See Full Package
                                    </Button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}