type SkeletonProps = {
    className?: string;
};

/**
 * Lightweight loading skeleton primitive.
 * Use to mirror the shape of content while it loads.
 *
 * Example: <Skeleton className="h-10 w-3/4 rounded-md" />
 */
export function Skeleton({className = ""}: SkeletonProps) {
    return (
        <div
            aria-hidden="true"
            className={`animate-pulse rounded bg-black/10 ${className}`}
        />
    );
}