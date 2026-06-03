import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import MarkdownBody from "../../components/admin/MarkdownBody";
import {
    BLOG_POST_CATEGORIES,
    createAdminBlogPost,
    fetchAdminBlogPost,
    updateAdminBlogPost,
    type AdminBlogPost,
    type BlogPostCategory,
    type BlogPostInput,
} from "../../data/admin";

const EMPTY: BlogPostInput = {
    slug: "",
    title: "",
    category: "General Health",
    excerpt: "",
    body: "",
    heroImageUrl: null,
    status: "Draft",
    featured: false,
    readTimeMinutes: 3,
};

export default function AdminBlogPostEditor() {
    const { slug: routeSlug } = useParams<{ slug: string }>();
    const isEdit = Boolean(routeSlug);
    const navigate = useNavigate();

    const [form, setForm] = useState<BlogPostInput>(EMPTY);
    const [loaded, setLoaded] = useState<AdminBlogPost | null>(null);
    const [loading, setLoading] = useState(isEdit);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!isEdit || !routeSlug) return;
        let alive = true;
        setLoading(true);
        fetchAdminBlogPost(routeSlug)
            .then((post) => {
                if (!alive) return;
                setLoaded(post);
                setForm({
                    slug: post.slug,
                    title: post.title,
                    category: post.category,
                    excerpt: post.excerpt,
                    body: post.body,
                    heroImageUrl: post.heroImageUrl,
                    status: post.status,
                    featured: post.featured,
                    readTimeMinutes: post.readTimeMinutes,
                });
            })
            .catch(() => {
                if (alive) setError("Could not load this post.");
            })
            .finally(() => {
                if (alive) setLoading(false);
            });
        return () => {
            alive = false;
        };
    }, [isEdit, routeSlug]);

    function update<K extends keyof BlogPostInput>(key: K, value: BlogPostInput[K]) {
        setForm((f) => ({ ...f, [key]: value }));
        if (success) setSuccess(false);
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!form.title.trim()) {
            setError("Title is required.");
            return;
        }
        if (!form.slug.trim()) {
            setError("Slug is required.");
            return;
        }

        setSubmitting(true);
        try {
            if (isEdit && routeSlug) {
                const updated = await updateAdminBlogPost(routeSlug, form);
                setLoaded(updated);
                // If the slug changed, sync the URL so future saves hit the new slug.
                if (updated.slug !== routeSlug) {
                    navigate(`/admin/blog-posts/${updated.slug}/edit`, {
                        replace: true,
                    });
                }
                setSuccess(true);
            } else {
                const created = await createAdminBlogPost(form);
                // Switch to edit mode on the newly-created post's slug.
                navigate(`/admin/blog-posts/${created.slug}/edit`, { replace: true });
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Could not save the post. Please try again.",
            );
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <>
                <BackLink />
                <p className="text-sm text-neutral-500">Loading…</p>
            </>
        );
    }

    if (error && !loaded && isEdit) {
        return (
            <>
                <BackLink />
                <p className="text-sm text-brand-red">{error}</p>
            </>
        );
    }

    return (
        <>
            <BackLink />

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-brand-ink sm:text-4xl">
                    {isEdit ? "Edit post" : "New post"}
                </h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
                    <div className="space-y-6">
                        <Field label="Title" htmlFor="bp-title" required>
                            <input
                                id="bp-title"
                                type="text"
                                required
                                value={form.title}
                                onChange={(e) => update("title", e.target.value)}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Slug" htmlFor="bp-slug" required>
                            <input
                                id="bp-slug"
                                type="text"
                                required
                                value={form.slug}
                                onChange={(e) => update("slug", e.target.value)}
                                className={`${inputClass} font-mono`}
                            />
                            <p className="mt-1 text-xs text-neutral-500">
                                URL-safe identifier. Appears in the public link
                                /resources/{form.slug || "your-slug"}.
                            </p>
                        </Field>

                        <Field label="Category" htmlFor="bp-category" required>
                            <select
                                id="bp-category"
                                value={form.category}
                                onChange={(e) =>
                                    update(
                                        "category",
                                        e.target.value as BlogPostCategory,
                                    )
                                }
                                className={inputClass}
                            >
                                {BLOG_POST_CATEGORIES.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Excerpt" htmlFor="bp-excerpt">
                            <textarea
                                id="bp-excerpt"
                                rows={3}
                                value={form.excerpt}
                                onChange={(e) => update("excerpt", e.target.value)}
                                placeholder="Short summary shown in article cards on the Resources page."
                                className={inputClass}
                            />
                        </Field>

                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-brand-ink">
                                Body
                            </label>
                            <MarkdownBody
                                value={form.body}
                                onChange={(v) => update("body", v)}
                            />
                        </div>
                    </div>

                    {/* Sidebar column — status / featured / actions / hero image.       */}
                    {/* Built in the next message; placeholder for now so the layout     */}
                    {/* renders correctly.                                                */}
                    <aside className="space-y-6">
                        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-6 text-center text-sm text-neutral-500">
                            Sidebar coming next: status, featured flag, hero image,
                            save / publish / delete actions.
                        </div>

                        {/* Temporary submit button so this part is testable end-to-end. */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex w-full items-center justify-center rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red disabled:opacity-60"
                        >
                            {submitting
                                ? "Saving…"
                                : isEdit
                                    ? "Save changes"
                                    : "Create post"}
                        </button>

                        {error && (
                            <p className="text-sm text-brand-red" role="alert">
                                {error}
                            </p>
                        )}
                        {success && (
                            <p className="text-sm text-brand-green" role="status">
                                Saved.
                            </p>
                        )}
                    </aside>
                </div>
            </form>
        </>
    );
}

function BackLink() {
    return (
        <Link
            to="/admin/blog-posts"
            className="mb-6 inline-flex items-center gap-1 text-sm text-brand-ink hover:text-brand-blue"
        >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            All posts
        </Link>
    );
}

const inputClass =
    "w-full rounded-2xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue";

function Field({
                   label,
                   htmlFor,
                   required,
                   children,
               }: {
    label: string;
    htmlFor: string;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label
                htmlFor={htmlFor}
                className="mb-1.5 block text-sm font-semibold text-brand-ink"
            >
                {label}
                {required && <span className="ml-1 text-brand-red">*</span>}
            </label>
            {children}
        </div>
    );
}