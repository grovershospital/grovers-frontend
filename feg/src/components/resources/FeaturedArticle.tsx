import { useEffect, useState } from "react";
import { Button } from "../../ui/Button";
import { fetchFeaturedArticle, type Article } from "../../data/articles";

export default function FeaturedArticle() {
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        fetchFeaturedArticle()
            .then((a) => {
                if (!cancelled) setArticle(a);
            })
            .catch((err) => {
                // Don't crash the page on a failed fetch — just log and render nothing.
                console.error("Failed to load featured article", err);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    // Hide the section entirely if there's no featured article. The page
    // shouldn't show a "Featured" heading with empty content under it.
    if (!loading && !article) return null;

    return (
        <section
            id="featured-article"
            className="bg-[#f9f7f0] py-16 sm:py-20 lg:py-24"
            aria-labelledby="featured-heading"
        >
            <div className="mx-auto w-full max-w-content px-6 lg:px-10">
                <h2
                    id="featured-heading"
                    className="text-3xl font-extrabold text-brand-red sm:text-4xl"
                >
                    Featured
                </h2>

                {loading ? (
                    // Skeleton — mirrors the real layout so there's no shift when the
                    // article lands. Pulse animation gives it visual life.
                    <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-center">
                        <div className="space-y-4">
                            <div className="h-7 w-32 animate-pulse rounded-full bg-neutral-200" />
                            <div className="h-8 w-full animate-pulse rounded bg-neutral-200" />
                            <div className="h-8 w-3/4 animate-pulse rounded bg-neutral-200" />
                            <div className="h-24 w-full animate-pulse rounded bg-neutral-200" />
                            <div className="h-4 w-20 animate-pulse rounded bg-neutral-200" />
                            <div className="h-11 w-32 animate-pulse rounded-full bg-neutral-200" />
                        </div>
                        <div className="aspect-[4/3] animate-pulse rounded-2xl bg-neutral-200" />
                    </div>
                ) : article ? (
                    <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-center">
                        {/* Content column */}
                        <div>
                            {/* Category pill — same solid green style as the Packages hero. */}
                            <span className="inline-flex items-center rounded-full bg-brand-green px-4 py-1.5 text-xs font-medium tracking-wide text-white">
                {article.category}
              </span>

                            <h3 className="mt-5 text-2xl font-extrabold leading-tight text-brand-ink sm:text-3xl">
                                {article.title}
                            </h3>

                            <p className="mt-5 text-sm leading-relaxed text-brand-ink sm:text-base">
                                {article.excerpt}
                            </p>

                            <p className="mt-6 text-sm font-bold text-brand-ink">
                                {article.readMinutes} min read
                            </p>

                            <div className="mt-8">
                                <Button variant="primary" href={`/resources/${article.slug}`}>
                                    Read Article
                                </Button>
                            </div>
                        </div>

                        {/* Image column */}
                        <div>
                            <img
                                src={article.heroImage}
                                alt={article.title}
                                className="block h-full w-full rounded-2xl object-cover"
                            />
                        </div>
                    </div>
                ) : null}
            </div>
        </section>
    );
}