import {useEffect, useState} from "react";
import {Button} from "../../ui/Button";
import {Skeleton} from "../../ui/Skeleton";
import {
    fetchFeaturedArticle,
    getCategoryStyle,
    type Article,
} from "../../data/articles";

type Status = "loading" | "error" | "ready";

export default function FeaturedArticle() {
    const [article, setArticle] = useState<Article | null>(null);
    const [status, setStatus] = useState<Status>("loading");
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;
        setStatus("loading");
        fetchFeaturedArticle()
            .then((a) => {
                if (cancelled) return;
                setArticle(a);
                setStatus("ready");
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

    // Hide the section entirely if the fetch succeeded but no featured article
    // exists. (Error state is handled separately below — we still want the user
    // to see what failed and be able to retry.)
    if (status === "ready" && !article) return null;

    return (
        <section
            id="featured-article"
            className="bg-[#f9f7f0] py-16 sm:py-20 lg:py-24"
            aria-labelledby="featured-heading"
        >
            <div className="mx-auto w-full lg:w-[70%] max-w-content px-6 lg:px-10">
                <h2
                    id="featured-heading"
                    className="text-3xl font-extrabold text-brand-red sm:text-4xl"
                >
                    Featured
                </h2>

                {status === "loading" && (
                    <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-center">
                        <div className="space-y-4">
                            <Skeleton className="h-7 w-32 rounded-full"/>
                            <Skeleton className="h-8 w-full"/>
                            <Skeleton className="h-8 w-3/4"/>
                            <Skeleton className="h-24 w-full"/>
                            <Skeleton className="h-4 w-20"/>
                            <Skeleton className="h-11 w-32 rounded-full"/>
                        </div>
                        <Skeleton className="aspect-[4/3] w-full rounded-2xl"/>
                    </div>
                )}

                {status === "error" && (
                    <div className="mt-10 text-center">
                        <h3 className="text-xl font-extrabold text-brand-ink sm:text-2xl">
                            Couldn't load featured article
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

                {status === "ready" && article && (
                    <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-center">
                        {/* Content column */}
                        <div>
                            {/* Category pill — color driven by getCategoryStyle so different */}
                            {/* categories get different colors per the design. */}
                            <span
                                className={`inline-flex items-center rounded-md px-5 py-2.5 text-xs font-medium tracking-wide text-white ${getCategoryStyle(article.category).bg}`}
                            >
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
                                <Button variant="primary" className={'px-12'} href={`/resources/${article.slug}`}>
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
                )}
            </div>
        </section>
    );
}