import UserAuthor from "@/app/ui/user/userAuthor";
import { redirect } from "next/navigation";
import { CustomMDX } from "@/app/plugin/mdx-remote";
import { getArticleById, getUserById } from "@/app/lib/database/query";

interface ArticleDetailsProps {
  params: Promise<{ articleId: string }>;
}

export default async function ArticleDetails({ params }: ArticleDetailsProps) {
  const { articleId } = await params;

  const article = await getArticleById(articleId);
  console.log(article);

  if (article == null) {
    redirect("/");
  }

  const { title, release_date, writer_id, markdown } = article;

  const writer = await getUserById(writer_id);

  return (
    <main className="my-10 md:my-30 mx-7 max-w-3xl md:mx-auto lg:my-30 lg:max-w-6xl">
      <h1 className="font-bold text-xl capitalize mb-3 md:text-3xl lg:text-4xl">
        {title}
      </h1>
      <UserAuthor writer={writer} release_date={release_date} />
      <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-[var(--t-dark-3)]" />
      {markdown ? (
        <article className="prose prose-lg dark:prose-invert">
          <CustomMDX source={markdown} />
        </article>
      ) : (
        <p> could not find article!</p>
      )}
    </main>
  );
}
