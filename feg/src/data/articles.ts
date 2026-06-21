// ============================================================
// Article data layer
// ============================================================
// Fetches published blog posts from GET /public/blog and
// GET /public/blog/{id}. All field mapping, enum conversion,
// and read-time computation happens here — components receive
// the Article type and never touch raw API shapes.
// ============================================================

import { api } from "../lib/api";

const API_ORIGIN = (
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1"
).replace(/\/api\/v1$/, "");

export type Article = {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    readMinutes: number;
    heroImage: string;     // CDN URL from backend; empty string if null
    body: string;          // Markdown — rendered with react-markdown on the detail page
    publishedAt: string;   // ISO date string
    featured?: boolean;
};

// ─── Category pill styling ───────────────────────────────────
// Maps category display labels to Tailwind background classes.
// Unknown categories fall back to neutral gray — admins can add
// new categories without breaking the pill display.
type CategoryStyle = { bg: string };

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
    "Lifestyle Diseases": { bg: "bg-brand-green" },
    "Screening and Packages": { bg: "bg-brand-red" },
    "General Health": { bg: "bg-violet-600" },
};

const DEFAULT_CATEGORY_STYLE: CategoryStyle = { bg: "bg-neutral-500" };

export function getCategoryStyle(category: string): CategoryStyle {
    return CATEGORY_STYLES[category] ?? DEFAULT_CATEGORY_STYLE;
}

// ─── Backend response shape ───────────────────────────────────
type BlogPostResponse = {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string | null;
    featuredImage: string | null;
    tags: string[];
    metaTitle: string;
    category: string;
    metaDescription: string;
    publishedAt: string;
};

type BlogListResponse = {
    content: BlogPostResponse[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
};

// ─── Category enum → display label ───────────────────────────
// Backend stores categories as SCREAMING_SNAKE_CASE enums.
// Components expect display labels that match CATEGORY_STYLES keys.
const CATEGORY_LABEL: Record<string, string> = {
    GENERAL_HEALTH: "General Health",
    LIFESTYLE_DISEASES: "Lifestyle Diseases",
    SCREENING_AND_PACKAGES: "Screening and Packages",
};

function mapCategory(raw: string): string {
    return CATEGORY_LABEL[raw] ?? raw;
}

// ─── Read time ────────────────────────────────────────────────
// Estimated reading time based on average adult reading speed of
// 200 words per minute. Minimum 1 minute.
function computeReadMinutes(content: string | null | undefined): number {
    if (!content) return 1;
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
}

// ─── Shape mapper ─────────────────────────────────────────────
function mapPost(post: BlogPostResponse, featured?: boolean): Article {
    return {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: mapCategory(post.category),
        readMinutes: computeReadMinutes(post.content),
        heroImage: post.featuredImage
            ? post.featuredImage.startsWith("http")
                ? post.featuredImage
                : `${API_ORIGIN}${post.featuredImage}`
            : "",
        body: post.content ?? "",
        publishedAt: post.publishedAt,
        featured,
    };
}

// ─── Public data-access functions ────────────────────────────

// Fetches the full content for a single post by id.
async function fetchFullPost(id: number): Promise<BlogPostResponse> {
    return api.get<BlogPostResponse>(`/public/blog/${id}`, { skipAuth: true });
}

// Fetches all published posts with full content. The list endpoint returns
// content: null (to keep payloads light), so we follow up with individual
// fetches to get the body — needed for accurate read-time computation.
// Fine for launch with < 20 posts. When post count grows, ask the backend
// to add a readTimeMinutes field to the list response instead.
// TODO (backend): add readTimeMinutes to GET /public/blog list response,
//   then drop the per-post fetches here.
export async function fetchArticles(): Promise<Article[]> {
    const res = await api.get<BlogListResponse>(
        "/public/blog?page=0&size=100",
        { skipAuth: true },
    );
    const fullPosts = await Promise.all(res.content.map((p) => fetchFullPost(p.id)));
    return fullPosts.map((post, i) => mapPost(post, i === 0));
}

// Featured article = most recently published post.
// Fetches the full post for accurate read time.
export async function fetchFeaturedArticle(): Promise<Article | null> {
    const res = await api.get<BlogListResponse>(
        "/public/blog?page=0&size=1",
        { skipAuth: true },
    );
    const summary = res.content[0];
    if (!summary) return null;
    const full = await fetchFullPost(summary.id);
    return mapPost(full, true);
}

// No slug-based endpoint exists. Two-step lookup:
//   1. Fetch the list to find the post by slug and get its numeric id.
//   2. Fetch GET /public/blog/{id} for the full content body.
// Resolves null if no published post matches the slug (renders ArticleNotFound).
export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
    const list = await api.get<BlogListResponse>(
        "/public/blog?page=0&size=100",
        { skipAuth: true },
    );
    const match = list.content.find((p) => p.slug === slug);
    if (!match) return null;

    const full = await api.get<BlogPostResponse>(
        `/public/blog/${match.id}`,
        { skipAuth: true },
    );
    return mapPost(full);
}