// import { promises as fs } from "fs";
// import path from "path";

interface ArticleDetailsProps {
  params: Promise<{ articleId: string }>;
}

export default async function ArticleDetails({ params }: ArticleDetailsProps) {
  const { articleId } = await params;
  console.log("articleId", articleId);

  return <div>asdf {articleId}</div>;
}
