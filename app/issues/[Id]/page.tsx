"use server";
import { redirect } from "next/navigation";
import Image from "next/image";
import ArticlePreview from "@/app/ui/articlePreview";
import UserShort from "@/app/ui/user/userShort";
import { Metadata } from "next";
import {
  getIssueById,
  getUserById,
  getArticlesByIssueId,
} from "@/app/lib/database/query";

interface IssueDetailsProps {
  params: Promise<{ Id: string }>;
}

export async function generateMetadata({
  params,
}: IssueDetailsProps): Promise<Metadata> {
  const { Id } = await params;
  return {
    title: `Issue ${Id}`,
    description: `Details of Issue ${Id} of Tablecloth Magazine.`,
  };
}

export default async function IssueDetails({ params }: IssueDetailsProps) {
  const { Id } = await params;

  const id = parseInt(Id);
  const issue = await getIssueById(id);

  if (issue == null) {
    redirect("/");
  }

  const articles = await getArticlesByIssueId(issue.id);

  const editor = await getUserById(issue.editor_id);

  return (
    <main className="mt-20 mb-40">
      <div className="m-4">
        <div className="relative w-70 h-100 m-auto lg:w-100 md:h-120">
          {issue.img_url && (
            <Image
              src={issue.img_url}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt={issue.name}
              className="py-1 mb-1 drop-shadow-[var(--dropShadow)] rounded-sm"
            />
          )}
        </div>
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
