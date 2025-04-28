import {
  getArticleByArticleId,
  getAuthorById,
  getMarkdownByArticleId,
} from "@/app/lib/utils";
import UserAuthor from "@/app/ui/user/userAuthor";
import { redirect } from "next/navigation";
import { CustomMDX } from "@/app/plugin/mdx-remote";

interface ArticleDetailsProps {
  params: Promise<{ articleId: string }>;
}

export default async function ArticleDetails({ params }: ArticleDetailsProps) {
  const { articleId } = await params;

  const article = getArticleByArticleId(articleId);

  if (article == null) {
    redirect("/");
  }

  const writer = getAuthorById(article.writer_id);

  let markdown;
  try {
    markdown = await getMarkdownByArticleId(articleId);
  } catch (error) {
    console.log(error);
  }

  return (
    <main className="my-10 md:my-30 mx-7 max-w-3xl md:mx-auto lg:my-30 lg:max-w-6xl">
      <h1 className="font-bold text-xl capitalize mb-3 md:text-3xl lg:text-4xl">
        {article.title}
      </h1>
      <UserAuthor writer={writer} release_date={article.release_date} />
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
