import { Button } from "../../ui/Button.tsx";
import { getCategoryStyle, type Article } from "../../data/articles.ts";

export default function ArticleCard({ article }: { article: Article }) {
    const categoryStyle = getCategoryStyle(article.category);

    return (
        <article className="grid gap-6 sm:grid-cols-[30%_1fr] sm:items-center sm:gap-10">
            {/* Image — comes first in DOM so it stacks on top in mobile naturally. */}
            <div>
                <img
                    src={article.heroImage}
                    alt=""
                    className="aspect-[4/3] w-full rounded-2xl object-cover"
                />
            </div>

            {/* Content */}
            <div>
        <span
            className={`inline-flex items-center rounded-md px-4 py-2 text-xs font-medium tracking-wide text-white ${categoryStyle.bg}`}
        >
          {article.category}
        </span>

                <h3 className="mt-4 text-xl font-extrabold leading-tight text-brand-ink sm:text-2xl">
                    {article.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-brand-ink sm:text-base">
                    {article.excerpt}
                </p>

                <p className="mt-4 text-sm font-bold text-brand-ink">
                    {article.readMinutes} min read
                </p>

                <div className="mt-5">
                    <Button variant="primary" className={'px-12'} href={`/resources/${article.slug}`}>
                        Read Article
                    </Button>
                </div>
            </div>
        </article>
    );
}