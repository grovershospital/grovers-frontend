import {useMemo} from "react";
import ReactMarkdown from "react-markdown";
import {Check, X} from "lucide-react";
import {Button} from "../../ui/Button";
import type {
    PublicPackage,
    PublicPackageTone,
    InclusionCellStatus,
} from "../../data/portal";

const HEADING_TEXT: Record<PublicPackageTone, string> = {
    GREEN: "text-brand-green",
    RED: "text-brand-red",
    BLUE: "text-brand-blue",
    DARK: "text-brand-ink",
};

const PRICING_HEADER_BG: Record<PublicPackageTone, string> = {
    GREEN: "bg-brand-green",
    RED: "bg-brand-red",
    BLUE: "bg-brand-blue",
    DARK: "bg-brand-ink",
};

const PRICING_TIER_BG: Record<PublicPackageTone, string> = {
    GREEN: "bg-brand-green",
    RED: "bg-brand-red",
    BLUE: "bg-brand-blue",
    DARK: "bg-brand-ink",
};

// Custom markdown components — bold becomes a brand-green spotlight phrase.
const markdownComponents = {
    strong: ({children}: { children?: React.ReactNode }) => (
        <strong className="font-extrabold text-brand-green">{children}</strong>
    ),
    p: ({children}: { children?: React.ReactNode }) => (
        <p className="mt-6 text-sm leading-relaxed text-brand-ink sm:text-base">
            {children}
        </p>
    ),
};

export default function ScreeningPackage({pkg}: { pkg: PublicPackage }) {
    const headingTone = pkg.headingTone;
    const pricingTone = pkg.pricingTone;

    // Lookup: cell by "tierId::inclusionId". Missing cells default to EXCLUDED.
    const cellLookup = useMemo(() => {
        const map: Record<string, { status: InclusionCellStatus; note: string }> = {};
        for (const c of pkg.cells) {
            map[`${c.tierId}::${c.inclusionId}`] = {status: c.status, note: c.note};
        }
        return map;
    }, [pkg.cells]);

    // Collect conditional notes with footnote numbers for display under the matrix.
    const footnotes = useMemo(() => {
        const seen = new Map<string, number>();
        const list: { number: number; note: string }[] = [];
        for (const inclusion of pkg.inclusions) {
            for (const tier of pkg.tiers) {
                const cell = cellLookup[`${tier.id}::${inclusion.id}`];
                if (cell?.status === "CONDITIONAL" && cell.note) {
                    if (!seen.has(cell.note)) {
                        seen.set(cell.note, list.length + 1);
                        list.push({number: list.length + 1, note: cell.note});
                    }
                }
            }
        }
        return {list, lookup: seen};
    }, [pkg.cells, pkg.inclusions, pkg.tiers, cellLookup]);

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

                        <div className="prose-sm max-w-none">
                            <ReactMarkdown components={markdownComponents}>
                                {pkg.description}
                            </ReactMarkdown>
                        </div>

                        {pkg.targetAudience && (
                            <p className="mt-6 text-sm leading-relaxed text-brand-ink sm:text-base">
                                <strong className="font-extrabold">Who this is for:</strong>{" "}
                                {pkg.targetAudience}
                            </p>
                        )}

                        {/* Pricing table */}
                        <div className="mt-6 overflow-hidden rounded-lg text-sm">
                            <div
                                className={`grid grid-cols-[2fr_1fr_1fr] text-white ${PRICING_HEADER_BG[pricingTone]}`}
                            >
                                <div className="px-4 py-3 font-extrabold">Package</div>
                                <div className="px-4 py-3 font-extrabold">Male</div>
                                <div className="px-4 py-3 font-extrabold">Female</div>
                            </div>
                            {pkg.tiers.map((tier) => (
                                <div
                                    key={tier.id}
                                    className="grid grid-cols-[2fr_1fr_1fr]"
                                >
                                    <div
                                        className={`px-4 py-3 font-bold text-white ${PRICING_TIER_BG[pricingTone]}`}
                                    >
                                        {tier.name}
                                    </div>
                                    <div className="bg-white px-4 py-3 text-brand-ink">
                                        {tier.priceMaleDisplay}
                                    </div>
                                    <div className="bg-white px-4 py-3 text-brand-ink">
                                        {tier.priceFemaleDisplay}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {pkg.pricingNote && (
                            <p className="mt-6 text-sm leading-relaxed text-brand-ink sm:text-base">
                                {pkg.pricingNote}
                            </p>
                        )}

                        <div className="mt-8">
                            <Button variant="primary" href="/patient-portal/login">
                                Book {pkg.name}
                            </Button>
                        </div>
                    </div>

                    {/* Right column — comparison table */}
                    <div className="mt-12 lg:col-span-3 lg:mt-0">
                        {/* --pkg-min-w is set via inline style below and consumed by   */}
                        {/* the .pkg-matrix rule in index.css, which only applies the   */}
                        {/* min-width below the lg breakpoint. At lg+ the table fills   */}
                        {/* its grid column via table-fixed with no min-width needed.   */}
                        <div className="relative overflow-x-auto rounded-lg">
                            <table
                                className="pkg-matrix w-full table-fixed lg:table-auto border-collapse bg-brand-blue text-sm"
                                style={{"--pkg-min-w": `${320 + 110 * pkg.tiers.length}px`} as React.CSSProperties}
                            >
                                <colgroup>
                                    <col className="w-[200px] lg:w-[40%]"/>
                                    {pkg.tiers.map((tier) => (
                                        <col
                                            key={tier.id}
                                            className="w-[110px] lg:w-auto"
                                        />
                                    ))}
                                </colgroup>
                                <thead>
                                <tr className="bg-brand-blue text-white">
                                    <th className="whitespace-nowrap px-4 py-3 text-left font-extrabold">
                                        Test
                                    </th>
                                    {pkg.tiers.map((tier) => (
                                        <th
                                            key={tier.id}
                                            className="whitespace-nowrap px-4 py-3 text-center font-extrabold"
                                        >
                                            {tier.name}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {pkg.inclusions.map((inclusion) => (
                                    <tr key={inclusion.id}>
                                        <td className="px-4 py-3 text-xs text-white sm:text-sm">
                                            {inclusion.label}
                                        </td>
                                        {pkg.tiers.map((tier) => {
                                            const cell = cellLookup[`${tier.id}::${inclusion.id}`];
                                            const status = cell?.status ?? "EXCLUDED";
                                            const note = cell?.note ?? "";
                                            const footnoteNumber =
                                                status === "CONDITIONAL" && note
                                                    ? footnotes.lookup.get(note)
                                                    : undefined;
                                            return (
                                                <td
                                                    key={tier.id}
                                                    className="bg-white px-4 py-3 text-center"
                                                >
                                                    {status === "INCLUDED" && (
                                                        <span
                                                            className="inline-flex h-5 w-5 items-center justify-center rounded-[3px] bg-brand-green"
                                                            aria-label="Included"
                                                        >
                                                            <Check className="h-3.5 w-3.5 text-white" strokeWidth={3}/>
                                                        </span>
                                                    )}
                                                    {status === "EXCLUDED" && (
                                                        <span
                                                            className="inline-flex h-5 w-5 items-center justify-center rounded-[3px] bg-brand-red"
                                                            aria-label="Not included"
                                                        >
                                                            <X className="h-3.5 w-3.5 text-white" strokeWidth={3}/>
                                                        </span>
                                                    )}
                                                    {status === "CONDITIONAL" && (
                                                        <span className="inline-flex items-center gap-1">
                                                            <span
                                                                className="inline-flex h-5 w-5 items-center justify-center rounded-[3px] bg-amber-400"
                                                                aria-label="Conditional"
                                                            >
                                                                <Check className="h-3.5 w-3.5 text-white" strokeWidth={3}/>
                                                            </span>
                                                            {footnoteNumber && (
                                                                <sup className="text-xs font-bold text-brand-ink">
                                                                    {footnoteNumber}
                                                                </sup>
                                                            )}
                                                        </span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <p className="mt-2 text-xs text-neutral-500 lg:hidden">
                            ← Swipe to see all tiers →
                        </p>

                        {footnotes.list.length > 0 && (
                            <ul className="mt-4 space-y-1 text-xs text-brand-ink/80">
                                {footnotes.list.map((f) => (
                                    <li key={f.number}>
                                        <sup className="font-bold">{f.number}</sup>{" "}
                                        {f.note}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}