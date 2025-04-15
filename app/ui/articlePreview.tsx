import ArticleCard from "./card/articleCard";
import Link from "next/link";

import { Article } from "../lib/definitions";

interface ArticlePreviewProps {
  articles: Article[];
}

export default function ArticlePreview({ articles }: ArticlePreviewProps) {

  return (
    <div className="my-12 md:my-30 mx-4 md:max-w-4xl lg:mx-auto">
      <h2 className="capitalize font-bold text-2xl md:text-4xl">Articles</h2>
      <div className="mt-4">
        <div className="flex flex-col gap-3 md:grid md:grid-cols-2">
          {articles.map((article, idx) => (
            <Link
              key={article.id}
              href={`${article.issue_id}/article/${article.id}`}
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
