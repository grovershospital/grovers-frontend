import { useEffect, useState } from "react";
import { fetchArticles, type Article } from "../../data/articles";
import ArticleCard from "./ArticleCard";

// Articles per page. "See more" reveals this many additional cards each click.
const PAGE_SIZE = 4;

export default function AllArticles() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    useEffect(() => {
        let cancelled = false;
        fetchArticles()
            .then((all) => {
                if (!cancelled) {
                    // The featured article is already shown in its own section above,
                    // so exclude it here to avoid duplication.
                    setArticles(all.filter((a) => !a.featured));
                }
            })
            .catch((err) => {
                console.error("Failed to load articles", err);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const visibleArticles = articles.slice(0, visibleCount);
    const hasMore = !loading && visibleCount < articles.length;

    return (
        <section
            id="all-articles"
            className="bg-[#f9f7f0] py-16 sm:py-20 lg:py-24"
            aria-labelledby="all-articles-heading"
        >
            <div className="mx-auto w-full lg:w-[70%] max-w-content px-6 lg:px-10">
                <h2
                    id="all-articles-heading"
                    className="text-center text-3xl font-extrabold text-brand-blue sm:text-4xl"
                >
                    All Articles
                </h2>
                <p className="mt-3 text-center text-sm font-bold text-brand-ink sm:text-base">
                    Our latest articles.
                </p>

                <div className="mt-12 space-y-12 sm:space-y-16">
                    {loading ? (
                        // Two skeleton cards while loading — enough to convey list shape
                        // without filling the whole viewport with placeholders.
                        <>
                            <ArticleCardSkeleton />
                            <ArticleCardSkeleton />
                        </>
                    ) : (
                        visibleArticles.map((article) => (
                            <ArticleCard key={article.slug} article={article} />
                        ))
                    )}
                </div>

                {/* "See more" — plain <button>, not <Button>, because Button is */}
                {/* router-aware (always renders as a link). This needs to be a real */}
                {/* button since clicking it just updates local state. */}
                {hasMore && (
                    <div className="mt-12 flex justify-center">
                        <button
                            type="button"
                            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                            className="inline-flex items-center rounded-full border border-neutral-300 bg-transparent px-8 py-3 text-sm font-bold text-brand-ink transition-colors hover:bg-white/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink"
                        >
                            See more
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

function ArticleCardSkeleton() {
    return (
        <div className="grid gap-6 sm:grid-cols-[40%_1fr] sm:items-center sm:gap-10">
            <div className="aspect-[4/3] w-full animate-pulse rounded-2xl bg-neutral-200" />
            <div className="space-y-4">
                <div className="h-7 w-32 animate-pulse rounded-full bg-neutral-200" />
                <div className="h-7 w-full animate-pulse rounded bg-neutral-200" />
                <div className="h-7 w-3/4 animate-pulse rounded bg-neutral-200" />
                <div className="h-16 w-full animate-pulse rounded bg-neutral-200" />
                <div className="h-4 w-20 animate-pulse rounded bg-neutral-200" />
                <div className="h-11 w-32 animate-pulse rounded-full bg-neutral-200" />
            </div>
        </div>
    );
}