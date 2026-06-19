import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {ArrowLeft} from "lucide-react";
import {
    fetchArticleBySlug,
    getCategoryStyle,
    type Article,
} from "../data/articles";
import ArticleConsultationCTA from "../components/resources/ArticleConsultationCTA";
import RelatedArticles from "../components/resources/RelatedArticles";
import {Contact} from '../components/shared/Contact.tsx';
import {Helmet} from "react-helmet-async";
import {Skeleton} from "../ui/Skeleton";

type Status = "loading" | "error" | "ready";

export default function ArticleDetail() {
    const {slug} = useParams<{ slug: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [status, setStatus] = useState<Status>("loading");
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        if (!slug) return;
        let cancelled = false;
        setStatus("loading");
        fetchArticleBySlug(slug)
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
    }, [slug, reloadKey]);

    const retry = () => setReloadKey((k) => k + 1);

    if (status === "loading") {
        return <ArticleDetailSkeleton/>;
    }

    // Distinguish "fetch failed" (transient, retryable) from "article doesn't
    // exist" (terminal, no retry helps). fetchArticleBySlug resolves with null
    // on 404 and rejects on network/server errors.
    if (status === "error") {
        return <ArticleLoadError onRetry={retry}/>;
    }

    if (!article) {
        return <ArticleNotFound/>;
    }

    const categoryStyle = getCategoryStyle(article.category);

    return (
        <>
            <Helmet>
                <title>{article.title} | Grover's Hospital</title>
                <meta name="description" content={article.excerpt} />
                <meta property="og:type" content="article" />
                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={article.excerpt} />
                <meta property="og:image" content={article.heroImage} />
            </Helmet>
            <article className="bg-[#f9f7f0]">
                <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:py-16 lg:px-8 lg:py-20">
                    {/* Top row — back link, category pill, read time */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                        <Link
                            to="/resources"
                            className="inline-flex items-center gap-2 text-sm font-bold text-brand-ink underline underline-offset-4 hover:text-brand-blue"
                        >
                            <ArrowLeft className="h-4 w-4" strokeWidth={2.5}/>
                            Back to Blog
                        </Link>
                        <span
                            className={`inline-flex items-center rounded-md px-4 py-2 text-xs font-medium tracking-wide text-white ${categoryStyle.bg}`}
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
                        className="mt-8 aspect-[16/10] w-full rounded-3xl object-cover"
                    />

                    <div className={'mx-auto max-w-4xl'}>
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
                                    h2: ({...props}) => (
                                        <h2
                                            className="mt-10 text-lg font-extrabold text-brand-ink sm:text-xl"
                                            {...props}
                                        />
                                    ),
                                    h3: ({...props}) => (
                                        <h3
                                            className="mt-8 text-base font-extrabold text-brand-ink sm:text-lg"
                                            {...props}
                                        />
                                    ),
                                    p: ({...props}) => (
                                        <p
                                            className="mt-4 text-sm leading-relaxed text-brand-ink sm:text-base"
                                            {...props}
                                        />
                                    ),
                                    ul: ({...props}) => (
                                        <ul
                                            className="mt-4 list-disc space-y-1 pl-5 text-sm leading-relaxed text-brand-ink sm:text-base"
                                            {...props}
                                        />
                                    ),
                                    ol: ({...props}) => (
                                        <ol
                                            className="mt-4 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-brand-ink sm:text-base"
                                            {...props}
                                        />
                                    ),
                                    a: ({...props}) => (
                                        <a
                                            className="text-brand-blue underline underline-offset-2 hover:text-brand-green"
                                            {...props}
                                        />
                                    ),
                                    blockquote: ({...props}) => (
                                        <blockquote
                                            className="mt-6 border-l-4 border-brand-blue pl-4 text-sm italic text-brand-ink/80 sm:text-base"
                                            {...props}
                                        />
                                    ),
                                    // Images: detect float-left / float-right classes from the admin's
                                    // markdown and apply Tailwind float utilities. Mobile always shows
                                    // full-width block — float only kicks in at sm+ breakpoint so text
                                    // wrap has enough horizontal space to look right.
                                    img: ({alt, ...props}) => (
                                        <img
                                            alt={alt || ""}
                                            className="mt-12 mb-12 block w-full rounded-2xl object-cover"
                                            {...props}
                                        />
                                    ),
                                }}
                            >
                                {article.body}
                            </ReactMarkdown>
                        </div>
                    </div>

                </div>
            </article>

            <ArticleConsultationCTA/>
            <RelatedArticles
                currentSlug={article.slug}
                currentCategory={article.category}
            />
            <Contact/>
        </>
    );
}

// ─── Loading / error / not-found states ──────────────────────────────

function ArticleDetailSkeleton() {
    return (
        <div className="bg-[#f9f7f0]">
            <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:py-16 lg:px-8 lg:py-20">
                {/* Top row */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    <Skeleton className="h-5 w-32"/>
                    <Skeleton className="h-9 w-32 rounded-md"/>
                    <Skeleton className="h-5 w-24"/>
                </div>

                {/* Hero image — matches real aspect ratio so no layout shift */}
                <Skeleton className="mt-8 aspect-[16/10] w-full rounded-3xl"/>

                {/* Title + body live in a narrower container, matching the real layout */}
                <div className="mx-auto max-w-4xl">
                    <div className="mt-8 space-y-3">
                        <Skeleton className="h-10 w-full"/>
                        <Skeleton className="h-10 w-3/4"/>
                    </div>
                    <div className="mt-8 space-y-3">
                        {Array.from({length: 8}).map((_, i) => (
                            <Skeleton key={i} className="h-4 w-full"/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ArticleLoadError({onRetry}: { onRetry: () => void }) {
    return (
        <div className="bg-[#f9f7f0] py-24 sm:py-32">
            <div className="mx-auto w-full max-w-2xl px-6 text-center">
                <h1 className="text-3xl font-extrabold text-brand-ink sm:text-4xl">
                    Couldn't load article
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-brand-ink/70 sm:text-base">
                    Check your connection and try again.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                    <button
                        type="button"
                        onClick={onRetry}
                        className="inline-flex items-center rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink"
                    >
                        Try again
                    </button>
                    <Link
                        to="/resources"
                        className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-transparent px-6 py-3 text-sm font-bold text-brand-ink transition-colors hover:bg-white/50"
                    >
                        <ArrowLeft className="h-4 w-4" strokeWidth={2.5}/>
                        Back to Blog
                    </Link>
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
                        <ArrowLeft className="h-4 w-4" strokeWidth={2.5}/>
                        Back to Blog
                    </Link>
                </div>
            </div>
        </div>
    );
}