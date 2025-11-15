import Image from "next/image";
import Link from "next/link";
import { getAllIssues } from "@/app/lib/database/query";

export default async function IssueOverview() {
  const issues = await getAllIssues();
  return (
    <div className="dark:bg-[var(--t-dark-3)] bg-[var(--t-light-3)] shadow-sm p-4 rounded-sm max-w-4xl m-4 md:m-auto md:grid md:grid-cols-3 md:gap-8 lg:max-w-7xl md:pb-8">
      {issues.map(({ id, img_url, name }) => (
        <article key={id} className="px-4 my-5">
          <div className="relative w-60 h-80 m-auto lg:w-80 md:h-100">
            <Link href={`/issues/${id}`}>
              {img_url && (
                <Image
                  src={img_url}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  alt={name}
                  className=" mb-2 shadow-sm rounded-sm"
                />
              )}
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
