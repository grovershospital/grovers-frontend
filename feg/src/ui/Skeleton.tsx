type SkeletonProps = {
    className?: string;
    /**
     * Background contrast.
     * - "light" (default) — for cream/white backgrounds (uses bg-black/10)
     * - "dark" — for dark backgrounds like the portal sidebar (uses bg-white/10)
     */
    tone?: "light" | "dark";
};

/**
 * Lightweight loading skeleton primitive.
 * Use to mirror the shape of content while it loads.
 *
 * Example: <Skeleton className="h-10 w-3/4 rounded-md" />
 * Dark bg: <Skeleton tone="dark" className="h-4 w-full" />
 */
export function Skeleton({className = "", tone = "light"}: SkeletonProps) {
    const baseBg = tone === "dark" ? "bg-white/10" : "bg-black/10";
    return (
        <div
            aria-hidden="true"
            className={`animate-pulse rounded ${baseBg} ${className}`}
        />
    );
}