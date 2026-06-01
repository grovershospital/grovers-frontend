import { useEffect, useState } from "react";
import { fetchArticles, type Article } from "../../data/articles";
import ArticleCard from "./ArticleCard";

const RELATED_COUNT = 2;

type Props = {
    currentSlug: string;
    currentCategory: string;
};

export default function RelatedArticles({
                                            currentSlug,
                                            currentCategory,
                                        }: Props) {
    const [related, setRelated] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        fetchArticles()
            .then((all) => {
                if (cancelled) return;

                // Exclude the current article from candidates.
                const candidates = all.filter((a) => a.slug !== currentSlug);

                // Prefer articles in the same category; fill the rest with the most
                // recent articles from other categories. This is a "tagged-then-recent"
                // strategy — gives admin-driven feel without requiring admins to pick
                // related articles manually. When the backend lands, this logic could
                // move server-side via a `/api/articles/${slug}/related` endpoint.
                const sameCategory = candidates.filter(
                    (a) => a.category === currentCategory,
                );
                const otherCategories = candidates.filter(
                    (a) => a.category !== currentCategory,
                );

                const picked = [...sameCategory, ...otherCategories].slice(
                    0,
                    RELATED_COUNT,
                );
                setRelated(picked);
            })
            .catch((err) => {
                console.error("Failed to load related articles", err);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [currentSlug, currentCategory]);

    // Hide the section entirely if there are no related articles to show.
    if (!loading && related.length === 0) return null;

    return (
        <section
            id="related-articles"
            className="bg-[#f9f7f0] py-16 sm:py-20 lg:py-24"
            aria-labelledby="related-articles-heading"
        >
            <div className="mx-auto w-full lg:w-[60%] max-w-content px-6 lg:px-10">
                <h2
                    id="related-articles-heading"
                    className="text-center text-3xl font-extrabold text-brand-blue sm:text-4xl"
                >
                    Related Articles
                </h2>

                <div className="mt-12 space-y-12 sm:space-y-16">
                    {loading
                        ? Array.from({ length: RELATED_COUNT }).map((_, i) => (
                            <RelatedSkeleton key={i} />
                        ))
                        : related.map((article) => (
                            <ArticleCard key={article.slug} article={article} />
                        ))}
                </div>
            </div>
        </section>
    );
}

function RelatedSkeleton() {
    return (
        <div className="grid gap-6 sm:grid-cols-[40%_1fr] sm:items-center sm:gap-10">
            <div className="aspect-[4/3] w-full animate-pulse rounded-2xl bg-neutral-200" />
            <div className="space-y-4">
                <div className="h-7 w-32 animate-pulse rounded-full bg-neutral-200" />
                <div className="h-7 w-full animate-pulse rounded bg-neutral-200" />
                <div className="h-7 w-3/4 animate-pulse rounded bg-neutral-200" />
                <div className="h-12 w-full animate-pulse rounded bg-neutral-200" />
                <div className="h-4 w-20 animate-pulse rounded bg-neutral-200" />
                <div className="h-11 w-32 animate-pulse rounded-full bg-neutral-200" />
            </div>
        </div>
    );
}