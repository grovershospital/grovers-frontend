// ============================================================
// Article data layer
// ============================================================
// While the backend isn't wired up yet, this file holds stub data and
// data-access functions that mirror the shape of the future API.
//
// When the backend goes live:
//   1. Delete the `STUB_ARTICLES` array and the `LOCAL_IMAGES` / `resolveLocal`
//      block above the fetch functions.
//   2. Swap each fetch function's body for the real `fetch(...)` call (each
//      function has a `TODO` comment showing exactly what to replace).
//   3. The `Article` type stays as-is — the backend should return this shape.
//
// Components depend on these fetch functions returning Promises, so swapping
// the implementation is fully transparent to the rest of the app.
// ============================================================

export type Article = {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    readMinutes: number;
    heroImage: string;     // CDN URL in production; resolved local URL during dev
    body: string;          // Markdown — rendered with react-markdown on the detail page
    publishedAt: string;   // ISO date string
    featured?: boolean;
};

// ─── Category pill styling ───────────────────────────────────
// Maps category names to Tailwind background classes for the pill badges
// used in FeaturedArticle and ArticleCard.tsx. Categories are stored as strings
// so admins can create new ones freely — unknown categories fall back to a
// neutral gray rather than crashing.
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

// ─── Local image resolution (delete when backend lands) ──────
// Eager-loads every article hero image so the stub data can reference them
// by filename and we still get hashed asset URLs in production builds.
const LOCAL_IMAGES = import.meta.glob<{ default: string }>(
    "../assets/resources/articles/*.{jpg,jpeg,png,webp}",
    { eager: true },
);

function resolveLocal(filename: string): string {
    const match = LOCAL_IMAGES[`../assets/resources/articles/${filename}`];
    if (!match) {
        // Useful during development — surfaces missing images without crashing.
        console.warn(`Article image not found in local assets: ${filename}`);
        return "";
    }
    return match.default;
}

// ─── Stub article data ───────────────────────────────────────
const STUB_ARTICLES: Article[] = [
    {
        slug: "high-blood-pressure-silent-killer",
        title:
            "High blood pressure and why most people do not know they have it.",
        excerpt:
            'High blood pressure, or hypertension, is a "silent killer" with no symptoms until serious damage occurs. Factors include genetics, diet, inactivity, stress, obesity, alcohol, and smoking. It\'s diagnosed by measuring blood pressure, with readings over 130/80 mmHg considered high. Management involves lifestyle changes like a balanced diet, exercise, and stress reduction, along with possible medication. Regular monitoring and check-ups are essential for effective management.',
        category: "Lifestyle Diseases",
        readMinutes: 4,
        heroImage: resolveLocal("featuredImage.jpg"),
        body: "",
        publishedAt: "2026-05-01",
        featured: true,
    },
    {
        slug: "pre-employment-medical-test-guide",
        title:
            "Everything you need to know before your pre-employment medical test.",
        excerpt:
            "What the test involves, which package to choose and what to expect on the day.",
        category: "Screening and Packages",
        readMinutes: 5,
        heroImage: resolveLocal("preEmployment.png"),
        body: "",
        publishedAt: "2026-04-20",
    },
    {
        slug: "malaria-self-diagnosis",
        title: "Malaria self-diagnosis and why it is dangerous",
        excerpt:
            "How to recognise malaria, when to treat at home and when to see a doctor.",
        category: "General Health",
        readMinutes: 4,
        heroImage: resolveLocal("preEmployment.png"),
        body: "",
        publishedAt: "2026-04-15",
    },
    {
        slug: "hiring-domestic-staff",
        title: "What every employer should know before hiring domestic staff",
        excerpt:
            "What tests to run, which package covers what and how to book.",
        category: "Screening and Packages",
        readMinutes: 4,
        heroImage: resolveLocal("preEmployment.png"),
        body: "",
        publishedAt: "2026-04-10",
    },
    {
        slug: "annual-health-checks-guide",
        title: "The complete guide to annual health checks",
        excerpt:
            "What the wellness test covers, what to expect and how to pick the right tier.",
        category: "Screening and Packages",
        readMinutes: 5,
        heroImage: resolveLocal("preEmployment.png"),
        body: "",
        publishedAt: "2026-04-01",
    },
];

// ─── Public data-access functions ────────────────────────────

export async function fetchArticles(): Promise<Article[]> {
    // TODO (backend): replace with
    //   const res = await fetch("/api/articles");
    //   if (!res.ok) throw new Error("Failed to fetch articles");
    //   return res.json();
    return Promise.resolve(STUB_ARTICLES);
}

export async function fetchFeaturedArticle(): Promise<Article | null> {
    // TODO (backend): replace with
    //   const res = await fetch("/api/articles/featured");
    //   if (res.status === 404) return null;
    //   if (!res.ok) throw new Error("Failed to fetch featured article");
    //   return res.json();
    return Promise.resolve(STUB_ARTICLES.find((a) => a.featured) ?? null);
}

export async function fetchArticleBySlug(
    slug: string,
): Promise<Article | null> {
    // TODO (backend): replace with
    //   const res = await fetch(`/api/articles/${slug}`);
    //   if (res.status === 404) return null;
    //   if (!res.ok) throw new Error("Failed to fetch article");
    //   return res.json();
    return Promise.resolve(STUB_ARTICLES.find((a) => a.slug === slug) ?? null);
}