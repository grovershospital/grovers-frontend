import {Skeleton} from "../../ui/Skeleton";

/**
 * Skeleton placeholder for ScreeningPackage. Mirrors the two-column layout
 * (left: heading + description + pricing table + CTA, right: comparison table)
 * so there's no layout shift when real content swaps in.
 */
export default function PackageSkeleton() {
    return (
        <section
            aria-busy="true"
            aria-label="Loading package"
            className="bg-[#f9f7f0] py-16 sm:py-20 lg:py-24"
        >
            <div className="mx-auto w-full lg:w-[80%] max-w-content px-6 lg:px-10">
                <div className="lg:grid lg:grid-cols-5 lg:gap-12">
                    {/* Left column */}
                    <div className="lg:col-span-2">
                        {/* Heading */}
                        <Skeleton className="h-10 w-3/4"/>
                        <Skeleton className="mt-3 h-10 w-1/2"/>

                        {/* Description paragraphs */}
                        <div className="mt-8 space-y-3">
                            <Skeleton className="h-4 w-full"/>
                            <Skeleton className="h-4 w-full"/>
                            <Skeleton className="h-4 w-11/12"/>
                            <Skeleton className="h-4 w-4/5"/>
                        </div>

                        {/* Target audience line */}
                        <div className="mt-6 space-y-2">
                            <Skeleton className="h-4 w-full"/>
                            <Skeleton className="h-4 w-2/3"/>
                        </div>

                        {/* Pricing table */}
                        <div className="mt-8 overflow-hidden rounded-lg">
                            <Skeleton className="h-12 w-full rounded-none"/>
                            <div className="mt-px space-y-px">
                                <Skeleton className="h-12 w-full rounded-none"/>
                                <Skeleton className="h-12 w-full rounded-none"/>
                                <Skeleton className="h-12 w-full rounded-none"/>
                            </div>
                        </div>

                        {/* Pricing note */}
                        <div className="mt-6 space-y-2">
                            <Skeleton className="h-4 w-5/6"/>
                            <Skeleton className="h-4 w-3/4"/>
                        </div>

                        {/* Book button */}
                        <Skeleton className="mt-8 h-12 w-44 rounded-full"/>
                    </div>

                    {/* Right column — comparison table */}
                    <div className="mt-12 lg:col-span-3 lg:mt-0">
                        <div className="overflow-hidden rounded-lg">
                            {/* Header */}
                            <Skeleton className="h-12 w-full rounded-none"/>
                            {/* Rows */}
                            <div className="mt-px space-y-px">
                                {Array.from({length: 8}).map((_, i) => (
                                    <Skeleton key={i} className="h-12 w-full rounded-none"/>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}