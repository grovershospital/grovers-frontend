import {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {ChevronDown, ChevronLeft} from "lucide-react";
import MarkdownBody from "../../components/admin/MarkdownBody";
import BlogPostEditorSidebar from "../../components/admin/BlogPostEditorSidebar";
import {slugify} from "../../lib/slugify";
import {
    BLOG_POST_CATEGORIES,
    createAdminBlogPost,
    deleteAdminBlogPost,
    fetchAdminBlogPost,
    publishAdminBlogPost,
    unpublishAdminBlogPost,
    updateAdminBlogPost,
    type AdminBlogPost,
    type BlogPostCategory,
    type BlogPostInput,
    type BlogPostStatus,
} from "../../data/admin";
import {toast} from 'sonner';

const EMPTY: BlogPostInput = {
    title: "",
    category: "General Health",
    excerpt: "",
    content: "",
    featuredImage: null,
    tags: [],
};

export default function AdminBlogPostEditor() {
    const {id: routeId} = useParams<{ id: string }>();
    const isEdit = Boolean(routeId);
    const navigate = useNavigate();

    const [form, setForm] = useState<BlogPostInput>(EMPTY);
    const [loaded, setLoaded] = useState<AdminBlogPost | null>(null);
    const [tagsInput, setTagsInput] = useState("");
    const [loading, setLoading] = useState(isEdit);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!isEdit || !routeId) return;
        let alive = true;
        setLoading(true);
        fetchAdminBlogPost(routeId)
            .then((post) => {
                if (!alive) return;
                setLoaded(post);
                setForm({
                    title: post.title,
                    category: post.category,
                    excerpt: post.excerpt,
                    content: post.content,
                    featuredImage: post.featuredImage,
                    tags: post.tags,
                });
                setTagsInput(post.tags.join(", "));
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
    }, [isEdit, routeId]);

    function update<K extends keyof BlogPostInput>(key: K, value: BlogPostInput[K]) {
        setForm((f) => ({...f, [key]: value}));
        if (success) setSuccess(false);
    }

    function handleTagsChange(raw: string) {
        setTagsInput(raw);
        const parsed = raw
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
        update("tags", parsed);
    }

    function validate(): string | null {
        if (!form.title.trim()) return "Title is required.";
        return null;
    }

    function syncFromServer(post: AdminBlogPost) {
        setLoaded(post);
        setForm({
            title: post.title,
            category: post.category,
            excerpt: post.excerpt,
            content: post.content,
            featuredImage: post.featuredImage,
            tags: post.tags,
        });
        setTagsInput(post.tags.join(", "));
    }

    async function handleSave() {
        setError(null);
        setSuccess(false);
        const v = validate();
        if (v) {
            setError(v);
            return;
        }
        setSubmitting(true);
        try {
            if (isEdit && routeId && loaded) {
                const updated = await updateAdminBlogPost(
                    routeId,
                    form,
                    loaded.status,
                );
                syncFromServer(updated);
                toast.success("Post saved.")
            } else {
                const created = await createAdminBlogPost(form);
                navigate(`/admin/blog-posts/${created.id}/edit`, {replace: true});
            }
        } catch (err) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Could not save the post. Please try again.",
            );
        } finally {
            setSubmitting(false);
        }
    }

    async function handleTogglePublish() {
        if (!isEdit || !routeId || !loaded) return;
        setError(null);
        setSuccess(false);
        setSubmitting(true);
        try {
            const updated =
                loaded.status === "Published"
                    ? await unpublishAdminBlogPost(routeId, form)
                    : await publishAdminBlogPost(routeId);
            syncFromServer(updated);
            setSuccess(true);
        } catch {
            setError("Could not change publication status. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete() {
        if (!isEdit || !routeId) return;
        setSubmitting(true);
        try {
            await deleteAdminBlogPost(routeId);
            navigate("/admin/blog-posts");
        } catch {
            setError("Could not delete the post. Please try again.");
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <>
                <BackLink/>
                <p className="text-sm text-neutral-500">Loading…</p>
            </>
        );
    }

    if (error && !loaded && isEdit) {
        return (
            <>
                <BackLink/>
                <p className="text-sm text-brand-red">{error}</p>
            </>
        );
    }

    // For unsaved new posts, the backend hasn't generated a slug yet — preview
    // it client-side via the same algorithm so the admin knows the URL.
    const slugPreview = loaded?.slug ?? slugify(form.title);
    const currentStatus: BlogPostStatus = loaded?.status ?? "Draft";

    return (
        <>
            <BackLink/>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-brand-ink sm:text-4xl">
                    {isEdit ? "Edit post" : "New post"}
                </h1>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
                <div className="space-y-6">
                    <Field label="Title" htmlFor="bp-title" required>
                        <input
                            id="bp-title"
                            type="text"
                            value={form.title}
                            onChange={(e) => update("title", e.target.value)}
                            className={inputClass}
                        />
                    </Field>

                    <div>
                        <p className="mb-1.5 text-sm font-semibold text-brand-ink">
                            Public URL
                        </p>
                        <p className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 font-mono text-sm text-neutral-600">
                            /resources/{slugPreview || "your-slug"}
                        </p>
                        <p className="mt-1 text-xs text-neutral-500">
                            Auto-generated from the title. Updated when the title changes
                            and the post is saved.
                        </p>
                    </div>

                    <Field label="Category" htmlFor="bp-category" required>
                        <div className="relative">
                            <select
                                id="bp-category"
                                value={form.category}
                                onChange={(e) =>
                                    update("category", e.target.value as BlogPostCategory)
                                }
                                className={`${inputClass} appearance-none cursor-pointer pr-10`}
                            >
                                {BLOG_POST_CATEGORIES.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
                                strokeWidth={2}
                            />
                        </div>
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

                    <Field label="Tags" htmlFor="bp-tags">
                        <input
                            id="bp-tags"
                            type="text"
                            value={tagsInput}
                            onChange={(e) => handleTagsChange(e.target.value)}
                            placeholder="hypertension, diet, prevention"
                            className={inputClass}
                        />
                        <p className="mt-1 text-xs text-neutral-500">
                            Comma-separated. Helps search and related-article suggestions.
                        </p>
                    </Field>

                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-brand-ink">
                            Body
                        </label>
                        <MarkdownBody
                            value={form.content}
                            onChange={(v) => update("content", v)}
                        />
                    </div>
                </div>

                <BlogPostEditorSidebar
                    form={form}
                    status={currentStatus}
                    isEdit={isEdit}
                    onChange={update}
                    onSave={handleSave}
                    onTogglePublish={handleTogglePublish}
                    onDelete={handleDelete}
                    submitting={submitting}
                    error={error}
                    success={success}
                />
            </div>
        </>
    );
}

function BackLink() {
    return (
        <Link
            to="/admin/blog-posts"
            className="mb-6 inline-flex items-center gap-1 text-sm text-brand-ink hover:text-brand-blue"
        >
            <ChevronLeft className="h-4 w-4" strokeWidth={2}/>
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