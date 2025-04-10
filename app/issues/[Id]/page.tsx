"use server";
import { redirect } from "next/navigation";
import Image from "next/image";
import {
  getArticlesByIssueId,
  getIssueById,
  getUserById,
} from "@/app/lib/utils";
import ArticlePreview from "@/app/ui/articlePreview";
import UserShort from "@/app/ui/user/userShort";

interface IssueDetailsProps {
  params: Promise<{ Id: string }>;
}
export default async function IssueDetails({ params }: IssueDetailsProps) {
  const { Id } = await params;
  const issue = getIssueById(Id);

  if (issue == null) {
    redirect("/");
  }

  const articles = getArticlesByIssueId(issue.id);

  const editor = getUserById(issue.editor_id);

  return (
    <main className="mt-20 mb-40">
      <div className="m-4">
        <div className="relative w-70 h-80 m-auto lg:w-80 md:h-100">
          <Image
            src={issue.img_url}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt={issue.name}
            className="py-1 mb-1 drop-shadow-[var(--dropShadow)] rounded-sm"
          />
        </div>
        <h1 className="text-5xl text-center my-8 capitalize font-medium">
          {issue.name}
        </h1>
      </div>
      <div className="m-4 max-w-3xl md:m-auto">
        <p>{issue.editors_note}</p>
        {editor && <UserShort user={editor} />}
      </div>
      {articles.length > 0 ? (
        <ArticlePreview articles={articles} />
      ) : (
        <p className="m-4 max-w-3xl md:m-auto pt-5 text-stone-400">
          could not find articles...
        </p>
      )}
    </main>
  );
}
