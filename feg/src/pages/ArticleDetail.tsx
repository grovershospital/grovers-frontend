import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { ArrowLeft } from "lucide-react";
import {
    fetchArticleBySlug,
    getCategoryStyle,
    type Article,
} from "../data/articles";

export default function ArticleDetail() {
    const { slug } = useParams<{ slug: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;
        let cancelled = false;
        setLoading(true);
        fetchArticleBySlug(slug)
            .then((a) => {
                if (!cancelled) setArticle(a);
            })
            .catch((err) => {
                console.error("Failed to load article", err);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [slug]);

    if (loading) {
        return <ArticleDetailSkeleton />;
    }

    if (!article) {
        return <ArticleNotFound />;
    }

    const categoryStyle = getCategoryStyle(article.category);

    return (
        <article className="bg-[#f9f7f0]">
            <div className="mx-auto w-full max-w-4xl px-6 py-12 sm:py-16 lg:px-8 lg:py-20">
                {/* Top row — back link, category pill, read time */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    <Link
                        to="/resources"
                        className="inline-flex items-center gap-2 text-sm font-bold text-brand-ink underline underline-offset-4 hover:text-brand-blue"
                    >
                        <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                        Back to Blog
                    </Link>
                    <span
                        className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-white ${categoryStyle.bg}`}
                    >
            {article.category}
          </span>
                    <span className="text-sm font-bold text-brand-ink">
            {article.readMinutes} min read
          </span>
                </div>

                {/* Hero image */}
                <img
                    src={article.heroImage}
                    alt={article.title}
                    className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover sm:aspect-[2/1]"
                />

                {/* Title */}
                <h1 className="mt-8 text-3xl font-extrabold leading-tight tracking-tight text-brand-blue sm:text-4xl lg:text-5xl">
                    {article.title}
                </h1>

                {/* Body — react-markdown with custom component overrides for typography. */}
                {/* The clearfix wrapper (overflow-hidden) prevents floated images from */}
                {/* bleeding into the section that follows the article. */}
                <div className="mt-8 overflow-hidden">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                            h2: ({ ...props }) => (
                                <h2
                                    className="mt-10 text-lg font-extrabold text-brand-ink sm:text-xl"
                                    {...props}
                                />
                            ),
                            h3: ({ ...props }) => (
                                <h3
                                    className="mt-8 text-base font-extrabold text-brand-ink sm:text-lg"
                                    {...props}
                                />
                            ),
                            p: ({ ...props }) => (
                                <p
                                    className="mt-4 text-sm leading-relaxed text-brand-ink sm:text-base"
                                    {...props}
                                />
                            ),
                            ul: ({ ...props }) => (
                                <ul
                                    className="mt-4 list-disc space-y-1 pl-5 text-sm leading-relaxed text-brand-ink sm:text-base"
                                    {...props}
                                />
                            ),
                            ol: ({ ...props }) => (
                                <ol
                                    className="mt-4 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-brand-ink sm:text-base"
                                    {...props}
                                />
                            ),
                            a: ({ ...props }) => (
                                <a
                                    className="text-brand-blue underline underline-offset-2 hover:text-brand-green"
                                    {...props}
                                />
                            ),
                            blockquote: ({ ...props }) => (
                                <blockquote
                                    className="mt-6 border-l-4 border-brand-blue pl-4 text-sm italic text-brand-ink/80 sm:text-base"
                                    {...props}
                                />
                            ),
                            // Images: detect float-left / float-right classes from the admin's
                            // markdown and apply Tailwind float utilities. Mobile always shows
                            // full-width block — float only kicks in at sm+ breakpoint so text
                            // wrap has enough horizontal space to look right.
                            img: ({ className, alt, ...props }) => {
                                const isFloatLeft = className?.includes("float-left");
                                const isFloatRight = className?.includes("float-right");
                                let cls = "my-6 w-full rounded-2xl object-cover";
                                if (isFloatLeft) {
                                    cls +=
                                        " sm:float-left sm:mt-2 sm:mr-6 sm:mb-2 sm:w-[40%]";
                                } else if (isFloatRight) {
                                    cls +=
                                        " sm:float-right sm:mt-2 sm:ml-6 sm:mb-2 sm:w-[40%]";
                                }
                                return <img alt={alt || ""} className={cls} {...props} />;
                            },
                        }}
                    >
                        {article.body}
                    </ReactMarkdown>
                </div>
            </div>
        </article>
    );
}

// ─── Loading / not-found states ──────────────────────────────

function ArticleDetailSkeleton() {
    return (
        <div className="bg-[#f9f7f0]">
            <div className="mx-auto w-full max-w-4xl px-6 py-12 sm:py-16 lg:px-8 lg:py-20">
                <div className="flex items-center gap-6">
                    <div className="h-5 w-32 animate-pulse rounded bg-neutral-200" />
                    <div className="h-7 w-32 animate-pulse rounded-full bg-neutral-200" />
                </div>
                <div className="mt-8 aspect-[2/1] w-full animate-pulse rounded-2xl bg-neutral-200" />
                <div className="mt-8 space-y-3">
                    <div className="h-10 w-full animate-pulse rounded bg-neutral-200" />
                    <div className="h-10 w-3/4 animate-pulse rounded bg-neutral-200" />
                </div>
                <div className="mt-8 space-y-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-4 w-full animate-pulse rounded bg-neutral-200"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function ArticleNotFound() {
    return (
        <div className="bg-[#f9f7f0] py-24 sm:py-32">
            <div className="mx-auto w-full max-w-2xl px-6 text-center">
                <h1 className="text-3xl font-extrabold text-brand-ink sm:text-4xl">
                    Article not found
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-brand-ink sm:text-base">
                    The article you are looking for does not exist or may have been
                    removed.
                </p>
                <div className="mt-8">
                    <Link
                        to="/resources"
                        className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-green"
                    >
                        <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                        Back to Blog
                    </Link>
                </div>
            </div>
        </div>
    );
}