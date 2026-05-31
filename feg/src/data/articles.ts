export type Article = {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    readMinutes: number;
    heroImage: string;
    body: string;
    publishedAt: string;
    featured?: boolean;
};

// Stub data. When the API is ready, delete this array and swap the function
// bodies below to fetch from /api/articles.
const STUB_ARTICLES: Article[] = [
    {
        slug: "high-blood-pressure-silent-killer",
        title: "High blood pressure and why most people do not know they have it.",
        excerpt:
            "High blood pressure, or hypertension, is a \"silent killer\" with no symptoms until serious damage occurs. Factors include genetics, diet, inactivity, stress, obesity, alcohol, and smoking. It's diagnosed by measuring blood pressure, with readings over 130/80 mmHg considered high. Management involves lifestyle changes like a balanced diet, exercise, and stress reduction, along with possible medication. Regular monitoring and check-ups are essential for effective management.",
        category: "Lifestyle Diseases",
        readMinutes: 4,
        heroImage: "/src/assets/resources/articles/high-blood-pressure.jpg",
        body: "",  // full body — will be Markdown when backend lands
        publishedAt: "2026-05-01",
        featured: true,
    },
    {
        slug: "pre-employment-medical-test-guide",
        title: "Everything you need to know before your pre-employment medical test.",
        excerpt: "What the test involves, which package to choose and what to expect on the day.",
        category: "Screening and Packages",
        readMinutes: 5,
        heroImage: "/src/assets/resources/articles/pre-employment.jpg",
        body: "",
        publishedAt: "2026-04-20",
    },
    {
        slug: "malaria-self-diagnosis",
        title: "Malaria self-diagnosis and why it is dangerous",
        excerpt: "How to recognise malaria, when to treat at home and when to see a doctor.",
        category: "General Health",
        readMinutes: 4,
        heroImage: "/src/assets/resources/articles/malaria.jpg",
        body: "",
        publishedAt: "2026-04-15",
    },
    {
        slug: "hiring-domestic-staff",
        title: "What every employer should know before hiring domestic staff",
        excerpt: "What tests to run, which package covers what and how to book.",
        category: "Screening and Packages",
        readMinutes: 4,
        heroImage: "/src/assets/resources/articles/domestic-staff.jpg",
        body: "",
        publishedAt: "2026-04-10",
    },
    {
        slug: "annual-health-checks-guide",
        title: "The complete guide to annual health checks",
        excerpt: "What the wellness test covers, what to expect and how to pick the right tier.",
        category: "Screening and Packages",
        readMinutes: 5,
        heroImage: "/src/assets/resources/articles/annual-health.jpg",
        body: "",
        publishedAt: "2026-04-01",
    },
];

// === Data access layer ===
// These functions return Promises so the swap to a real API in the future is
// purely an implementation change — components don't need to be rewritten.

export async function fetchArticles(): Promise<Article[]> {
    // TODO: replace with `fetch('/api/articles').then(r => r.json())`
    return Promise.resolve(STUB_ARTICLES);
}

export async function fetchFeaturedArticle(): Promise<Article | null> {
    // TODO: replace with `fetch('/api/articles/featured').then(r => r.json())`
    const featured = STUB_ARTICLES.find((a) => a.featured);
    return Promise.resolve(featured ?? null);
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
    // TODO: replace with `fetch(`/api/articles/${slug}`).then(r => r.json())`
    return Promise.resolve(STUB_ARTICLES.find((a) => a.slug === slug) ?? null);
}