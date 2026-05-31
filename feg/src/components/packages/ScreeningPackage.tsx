import { Check, X } from "lucide-react";
import { Button } from "../../ui/Button";

type ColorTone = "green" | "red";

export type ScreeningPackageData = {
    slug: string;
    headline: string;
    body: string;
    whoThisIsFor: string;
    tiers: ReadonlyArray<string>;
    tests: ReadonlyArray<{
        name: string;
        included: ReadonlyArray<boolean>;
    }>;
    pricing: ReadonlyArray<{
        tier: string;
        male: string;
        female: string;
    }>;
    footerNote: string;
    ctaLabel: string;
    ctaHref?: string;
    headingTone?: ColorTone;  // default "green"
    pricingTone?: ColorTone;  // default "red"
};

// Tailwind classes keyed by tone. Listed here so the JIT compiler can see
// the full class strings — interpolating into `bg-${tone}-800` would not work.
const HEADING_TEXT: Record<ColorTone, string> = {
    green: "text-brand-green",
    red: "text-brand-red",
};
const PRICING_HEADER_BG: Record<ColorTone, string> = {
    red: "bg-brand-red",
    green: "bg-brand-green",
};
const PRICING_TIER_BG: Record<ColorTone, string> = {
    red: "bg-brand-red",
    green: "bg-brand-green",
};

export default function ScreeningPackage({
                                             pkg,
                                         }: {
    pkg: ScreeningPackageData;
}) {
    const headingTone = pkg.headingTone ?? "green";
    const pricingTone = pkg.pricingTone ?? "red";

    return (
        <section
            id={pkg.slug}
            className="bg-[#f9f7f0] py-16 sm:py-20 lg:py-24"
            aria-labelledby={`${pkg.slug}-heading`}
        >
            <div className="mx-auto w-full lg:w-[80%] max-w-content px-6 lg:px-10">
                <div className="lg:grid lg:grid-cols-5 lg:gap-12">
                    {/* Left column — content + pricing table */}
                    <div className="lg:col-span-2">
                        <h2
                            id={`${pkg.slug}-heading`}
                            className={`text-3xl font-extrabold leading-tight sm:text-4xl ${HEADING_TEXT[headingTone]}`}
                        >
                            {pkg.headline}
                        </h2>
                        <p className="mt-6 text-sm leading-relaxed text-brand-ink sm:text-base">
                            {pkg.body}
                        </p>
                        <p className="mt-6 text-sm leading-relaxed text-brand-ink sm:text-base">
                            <strong className="font-extrabold">Who this is for:</strong>{" "}
                            {pkg.whoThisIsFor}
                        </p>

                        {/* Pricing table — header strip in darker tone, tier column */}
                        {/* in brand tone. */}
                        <div className="mt-6 overflow-hidden rounded-lg text-sm">
                            <div
                                className={`grid grid-cols-[2fr_1fr_1fr] text-white ${PRICING_HEADER_BG[pricingTone]}`}
                            >
                                <div className="px-4 py-3 font-extrabold">Package</div>
                                <div className="px-4 py-3 font-extrabold">Male</div>
                                <div className="px-4 py-3 font-extrabold">Female</div>
                            </div>
                            {pkg.pricing.map((row) => (
                                <div
                                    key={row.tier}
                                    className="grid grid-cols-[2fr_1fr_1fr]"
                                >
                                    <div
                                        className={`px-4 py-3 font-bold text-white ${PRICING_TIER_BG[pricingTone]}`}
                                    >
                                        {row.tier}
                                    </div>
                                    <div className="bg-white px-4 py-3 text-brand-ink">
                                        {row.male}
                                    </div>
                                    <div className="bg-white px-4 py-3 text-brand-ink">
                                        {row.female}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <p className="mt-6 text-sm leading-relaxed text-brand-ink sm:text-base">
                            {pkg.footerNote}
                        </p>

                        <div className="mt-8">
                            <Button variant="primary" href={pkg.ctaHref ?? "/contact"}>
                                {pkg.ctaLabel}
                            </Button>
                        </div>
                    </div>

                    {/* Right column — comparison table. */}
                    {/* overflow-x-auto so it scrolls horizontally on narrow viewports */}
                    {/* where 6 columns can't fit. */}
                    <div className="mt-12 lg:col-span-3 lg:mt-0">
                        <div className="overflow-x-auto overflow-hidden rounded-lg">
                            <table className="w-full border-collapse bg-brand-blue text-sm">
                                <thead>
                                <tr className="bg-brand-blue text-white">
                                    <th className="whitespace-nowrap px-4 py-3 text-left font-extrabold">
                                        Test
                                    </th>
                                    {pkg.tiers.map((tier) => (
                                        <th
                                            key={tier}
                                            className="whitespace-nowrap px-4 py-3 text-left font-extrabold"
                                        >
                                            {tier}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {pkg.tests.map((test) => (
                                    <tr key={test.name}>
                                        <td className="px-4 py-3 text-xs text-white sm:text-sm">
                                            {test.name}
                                        </td>
                                        {test.included.map((inc, i) => (
                                            <td
                                                key={i}
                                                className="bg-white px-4 py-3 text-center"
                                            >
                                                {inc ? (
                                                    <span
                                                        className="inline-flex h-5 w-5 items-center justify-center rounded-[3px] bg-brand-green"
                                                        aria-label="Included"
                                                    >
                              <Check
                                  className="h-3.5 w-3.5 text-white"
                                  strokeWidth={3}
                              />
                            </span>
                                                ) : (
                                                    <span
                                                        className="inline-flex h-5 w-5 items-center justify-center rounded-[3px] bg-brand-red"
                                                        aria-label="Not included"
                                                    >
                              <X
                                  className="h-3.5 w-3.5 text-white"
                                  strokeWidth={3}
                              />
                            </span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}