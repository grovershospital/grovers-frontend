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
    "Lifestyle Diseases": {bg: "bg-brand-green"},
    "Screening and Packages": {bg: "bg-brand-red"},
    "General Health": {bg: "bg-violet-600"},
};

const DEFAULT_CATEGORY_STYLE: CategoryStyle = {bg: "bg-neutral-500"};

export function getCategoryStyle(category: string): CategoryStyle {
    return CATEGORY_STYLES[category] ?? DEFAULT_CATEGORY_STYLE;
}

// ─── Local image resolution (delete when backend lands) ──────
// Eager-loads every article hero image so the stub data can reference them
// by filename and we still get hashed asset URLs in production builds.
const LOCAL_IMAGES = import.meta.glob<{ default: string }>(
    "../assets/resources/articles/*.{jpg,jpeg,png,webp}",
    {eager: true},
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
        body: `If you asked most people in Lagos whether they have high blood pressure, the majority would say no. Not because they have been tested and confirmed it. But because they feel fine. And feeling fine, in the Nigerian health consciousness, is broadly understood to mean nothing is wrong. This is the most dangerous assumption in modern healthcare.
 
## The silent progression of hypertension
 
High blood pressure, or hypertension, does not hurt. It does not keep you awake at night. It does not stop you from going to work, exercising or eating well. In its early and even moderate stages, it produces no symptoms that most people would recognise as a reason to see a doctor. What it does instead is work quietly in the background, putting consistent strain on your heart, blood vessels, kidneys and brain over months and years. By the time it makes itself known, through a heart attack, a stroke, kidney failure or vision loss, the damage has been accumulating for a long time.
 
This is not a rare or extreme scenario. It is the most common trajectory of untreated hypertension. And in Nigeria, where routine health checks are not yet a cultural norm, it plays out daily.
 
## Hypertension in Nigeria by the numbers
 
Research on hypertension prevalence in Lagos has found rates significantly higher than global averages. Studies have documented hypertension prevalence of over 50% among adults in Lagos, compared to global averages closer to 30%. More concerning is that a substantial proportion of those individuals are unaware of their condition.
 
This is not primarily a story about access to treatment. It is a story about a gap between how many people have high blood pressure and how many people know they have it. That gap is where the real danger lives.
 
## Why urban professionals are at higher risk
 
<img src="/articles/articleImage.jpg" alt="" class="float-left" />
 
Hypertension does not develop in a vacuum. It is shaped by the environment we live in and the lives we lead. And for many Lagos professionals, that environment is a near-perfect storm of risk factors. The diet is a significant contributor. Processed foods, high sodium content, irregular eating patterns and the prevalence of convenience food across the city all put consistent pressure on the cardiovascular system. Physical inactivity compounds this. Lagos is not a city built for walking. Long commutes, desk-based work and the sheer exhaustion of navigating the city leave very little time or energy for regular exercise.
 
Then there is stress. Chronic, sustained stress raises blood pressure directly. It drives behaviours like poor sleep, excessive alcohol consumption and smoking that raise it further. And it is embedded in the fabric of professional life in Lagos in a way that is rarely acknowledged as the health risk it actually is.
 
None of these factors in isolation are enough to cause hypertension. Together, over years, they create the conditions for it.
 
## The danger of symptom-based self-assessment
 
There is a deeply held belief in Nigerian culture that the body will tell you when something is wrong. That if you were seriously ill, you would know it. This belief is understandable. It is also medically incorrect.
 
The body is remarkably good at adapting. It compensates for damage, maintains function under strain and often continues to perform normally long after a problem has taken hold. High blood pressure is the clearest example of this. The cardiovascular system can sustain elevated pressure for years without producing symptoms that register as a warning sign.
 
Feeling fine is not a health status. It is the absence of obvious symptoms. Those are two very different things. And building a health strategy around the former is a significant risk.
 
## What actually needs to change
 
The solution to Nigeria's hypertension problem is not complicated at the individual level. It is a blood pressure reading. A single measurement taken during a routine consultation can identify elevated blood pressure before it has caused significant damage. At that point, the options for management are broad. Lifestyle changes alone, reducing salt, losing weight, exercising more regularly and managing stress, can be enough to bring blood pressure back to a healthy level for many people. For others, medication is needed. Either way, the earlier the intervention, the better the outcome.
 
What needs to change is the assumption that a health check is something you do when you are unwell. The entire point of a health check is that you do it before anything goes wrong. That shift in mindset, from reactive to proactive healthcare, is arguably the most important health decision a Lagos professional can make.
 
## A call for proactive healthcare
 
High blood pressure is not a condition that happens to unhealthy people. It happens to busy people, stressed people, people who are too focused on everything else to pay attention to their own health. It happens to people who feel fine.
 
The most effective thing you can do for your long-term health right now is not a dramatic lifestyle overhaul. It is knowing your numbers. Blood pressure, blood sugar, cholesterol. These three markers tell you more about your cardiovascular risk than almost anything else. And none of them require you to feel unwell to find out.
 
The conversation about hypertension in Nigeria needs to move from treatment to prevention. From the hospital to the annual check-up. From crisis management to informed decision-making.
 
That shift starts with a single appointment.`,
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