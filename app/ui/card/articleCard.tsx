import { Article } from "@/app/lib/definitions";
import UserAuthor from "../user/userAuthor";
import { getUserById } from "@/app/lib/database/query";

type ArticleCardProps = {
  article: Article;
};

export default async function ArticleCard({ article }: ArticleCardProps) {
  const { release_date, title, writer_id } = article;

  const writer = await getUserById(writer_id);

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
