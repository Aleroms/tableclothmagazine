import ArticleCard from "./card/articleCard";
import Link from "next/link";

import { articlePlaceholder } from "../lib/placeholder-data";

export default function ArticlePreview() {
  const sortedArticles = articlePlaceholder.sort(
    (a, b) => b.release_date.getTime() - a.release_date.getTime()
  );
  return (
    <div className="my-12 md:my-30 mx-4 md:max-w-4xl lg:mx-auto">
      <h2 className="capitalize font-bold text-2xl md:text-4xl">Articles</h2>
      <div className="mt-4">
        <div className="flex flex-col gap-3 md:grid md:grid-cols-2">
          {sortedArticles.map((article, idx) => (
            <Link
              key={article.id}
              href={`issue/${article.issue_id}/article/${article.id}`}
              className={idx % 3 === 2 ? "md:col-span-2" : ""}
            >
              <ArticleCard article={article} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
