import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import BlogPostStatusPill from "../../components/admin/BlogPostStatusPill";
import Pagination from "../../components/admin/Pagination";
import {
    BLOG_POST_CATEGORIES,
    deleteAdminBlogPost,
    fetchAdminBlogPosts,
    type AdminBlogPostFilters,
    type AdminBlogPostSummary,
    type BlogPostCategory,
    type BlogPostStatus,
} from "../../data/admin";
import {toast} from "sonner";

const PAGE_SIZE = 10;

const STATUS_OPTIONS: ReadonlyArray<BlogPostStatus> = ["Draft", "Published"];

export default function AdminBlogPosts() {
    const navigate = useNavigate();

    const [filters, setFilters] = useState<AdminBlogPostFilters>({
        search: "",
        category: "all",
        status: "all",
    });
    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState<AdminBlogPostSummary[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    function loadPosts() {
        let alive = true;
        setLoading(true);
        fetchAdminBlogPosts(filters, page, PAGE_SIZE)
            .then((res) => {
                if (!alive) return;
                setPosts(res.entries);
                setTotal(res.total);
            })
            .catch(() => {
                if (alive) toast.error("Could not load posts.")
            })
            .finally(() => {
                if (alive) setLoading(false);
            });
        return () => {
            alive = false;
        };
    }

    useEffect(() => {
        setPage(1);
    }, [filters]);

    useEffect(() => {
        return loadPosts();
    }, [filters, page]);

    function update<K extends keyof AdminBlogPostFilters>(
        key: K,
        value: AdminBlogPostFilters[K],
    ) {
        setFilters((f) => ({ ...f, [key]: value }));
    }

    async function handleDelete(post: AdminBlogPostSummary) {
        if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;

        const prev = posts;
        setPosts((list) => list.filter((p) => p.id !== post.id));
        try {
            await deleteAdminBlogPost(post.id);
        } catch {
            setPosts(prev);
            toast.error("Could not delete the post. Please try again.");
        }
    }

    return (
        <>
            <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-brand-red sm:text-4xl">
                        Blog Posts
                    </h1>
                    <p className="mt-3 max-w-prose text-brand-ink">
                        Manage articles published on the public Resources page. Drafts
                        are invisible to patients until you publish them.
                    </p>
                </div>
                <Link
                    to="/admin/blog-posts/new"
                    className="inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                    New post
                </Link>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto]">
                <div className="relative">
                    <Search
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                        strokeWidth={2}
                    />
                    <input
                        type="search"
                        placeholder="Search by title…"
                        value={filters.search ?? ""}
                        onChange={(e) => update("search", e.target.value)}
                        className="w-full rounded-full border border-neutral-300 bg-white py-2 pl-10 pr-4 text-sm text-brand-ink placeholder:text-neutral-400 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                </div>

                <select
                    value={filters.category ?? "all"}
                    onChange={(e) =>
                        update("category", e.target.value as BlogPostCategory | "all")
                    }
                    className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                >
                    <option value="all">All categories</option>
                    {BLOG_POST_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.status ?? "all"}
                    onChange={(e) =>
                        update("status", e.target.value as BlogPostStatus | "all")
                    }
                    className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                >
                    <option value="all">All statuses</option>
                    {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <p className="text-sm text-neutral-500">Loading…</p>
            ) : posts.length === 0 ? (
                <p className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
                    No posts match the current filters.
                </p>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
                    <table className="w-full min-w-[800px] border-collapse">
                        <thead className="bg-neutral-50">
                        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Read time</th>
                            <th className="px-4 py-3">Updated</th>
                            <th className="px-4 py-3" />
                        </tr>
                        </thead>
                        <tbody>
                        {posts.map((p) => (
                            <tr
                                key={p.id}
                                onClick={() =>
                                    navigate(`/admin/blog-posts/${p.id}/edit`)
                                }
                                className="cursor-pointer border-t border-neutral-100 text-sm hover:bg-neutral-50"
                            >
                                <td className="px-4 py-3">
                                    <p className="font-semibold text-brand-ink">
                                        {p.title}
                                    </p>
                                    <p className="mt-0.5 font-mono text-xs text-neutral-500">
                                        /{p.slug}
                                    </p>
                                </td>
                                <td className="px-4 py-3 text-brand-ink">
                                    {p.category}
                                </td>
                                <td className="px-4 py-3">
                                    <BlogPostStatusPill status={p.status} />
                                </td>
                                <td className="px-4 py-3 text-brand-ink">
                                    {p.readTimeMinutes} min
                                </td>
                                <td className="px-4 py-3 text-xs text-neutral-500">
                                    {p.updatedAtDisplay}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-end gap-1">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(
                                                    `/admin/blog-posts/${p.id}/edit`,
                                                );
                                            }}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-brand-ink"
                                            aria-label={`Edit ${p.title}`}
                                        >
                                            <Pencil
                                                className="h-4 w-4"
                                                strokeWidth={2}
                                            />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(p);
                                            }}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-brand-red/10 hover:text-brand-red"
                                            aria-label={`Delete ${p.title}`}
                                        >
                                            <Trash2
                                                className="h-4 w-4"
                                                strokeWidth={2}
                                            />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Pagination
                page={page}
                total={total}
                pageSize={PAGE_SIZE}
                onChange={setPage}
            />
        </>
    );
}