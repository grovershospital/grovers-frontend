import {useEffect, useState} from "react";
import {fetchArticles, type Article} from "../../data/articles";
import ArticleCard from "./ArticleCard";
import {Skeleton} from "../../ui/Skeleton";

// Articles per page. "See more" reveals this many additional cards each click.
const PAGE_SIZE = 4;

type Status = "loading" | "error" | "empty" | "ready";

export default function AllArticles() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [status, setStatus] = useState<Status>("loading");
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;
        setStatus("loading");
        fetchArticles()
            .then((all) => {
                if (cancelled) return;
                // The featured article is already shown in its own section above,
                // so exclude it here to avoid duplication.
                const nonFeatured = all.filter((a) => !a.featured);
                setArticles(nonFeatured);
                setStatus(nonFeatured.length === 0 ? "empty" : "ready");
            })
            .catch(() => {
                if (cancelled) return;
                setStatus("error");
            });
        return () => {
            cancelled = true;
        };
    }, [reloadKey]);

    const retry = () => setReloadKey((k) => k + 1);

    const visibleArticles = articles.slice(0, visibleCount);
    const hasMore = status === "ready" && visibleCount < articles.length;

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

                {status === "loading" && (
                    <div className="mt-12 space-y-12 sm:space-y-16">
                        <ArticleCardSkeleton/>
                        <ArticleCardSkeleton/>
                    </div>
                )}

                {status === "error" && (
                    <div className="mt-12 text-center">
                        <h3 className="text-xl font-extrabold text-brand-ink sm:text-2xl">
                            Couldn't load articles
                        </h3>
                        <p className="mt-2 text-sm text-brand-ink/70 sm:text-base">
                            Check your connection and try again.
                        </p>
                        <button
                            type="button"
                            onClick={retry}
                            className="mt-6 inline-flex items-center rounded-full border border-neutral-300 bg-transparent px-8 py-3 text-sm font-bold text-brand-ink transition-colors hover:bg-white/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {status === "empty" && (
                    <div className="mt-12 text-center">
                        <p className="mx-auto max-w-md text-base text-brand-ink/70 sm:text-lg">
                            Check back soon for exciting health and wellness articles.
                        </p>
                    </div>
                )}

                {status === "ready" && (
                    <div className="mt-12 space-y-12 sm:space-y-16">
                        {visibleArticles.map((article) => (
                            <ArticleCard key={article.slug} article={article}/>
                        ))}
                    </div>
                )}

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
            <Skeleton className="aspect-[4/3] w-full rounded-2xl"/>
            <div className="space-y-4">
                <Skeleton className="h-7 w-32 rounded-full"/>
                <Skeleton className="h-7 w-full"/>
                <Skeleton className="h-7 w-3/4"/>
                <Skeleton className="h-16 w-full"/>
                <Skeleton className="h-4 w-20"/>
                <Skeleton className="h-11 w-32 rounded-full"/>
            </div>
        </div>
    );
}