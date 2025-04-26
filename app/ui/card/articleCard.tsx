import { Article } from "@/app/lib/definitions";
import UserAuthor from "../user/userAuthor";
import { getAuthorById } from "@/app/lib/utils";

type ArticleCardProps = {
  article: Article;
};

export default function ArticleCard({ article }: ArticleCardProps) {
  const { release_date, title, writer_id } = article;

  const writer = getAuthorById(writer_id);

  return (
    <article
      className="dark:bg-[var(--t-dark-3)] bg-[var(--t-light-4)] shadow-sm my-1 rounded-sm p-3
     drop-shadow-[var(--dropShadow)] min-h-40 flex flex-col justify-between"
    >
      <h3 className="mb-8">{title}</h3>
      <UserAuthor writer={writer} release_date={release_date} />
    </article>
  );
}
