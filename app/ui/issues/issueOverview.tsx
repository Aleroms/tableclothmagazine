import { formatDateToUSA, getAllIssues } from "@/app/lib/utils";
import Image from "next/image";
import NavButton from "../button/navigationButton";
import Link from "next/link";

export default function IssueOverview() {
  const issues = getAllIssues();
  return (
    <div className="bg-[var(--t-dark-3)] p-4 rounded-sm max-w-4xl m-4 md:m-auto md:grid md:grid-cols-3 md:gap-8 lg:max-w-7xl md:pb-8">
      {issues.map((issue) => (
        <article key={issue.id} className="px-4 my-5">
          <div className="relative w-60 h-80 m-auto lg:w-80 md:h-100">
            <Link href={`/issues/${issue.id}`}>
              <Image
                src={issue.img_url}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                alt={issue.name}
                className="py-1 mb-1 drop-shadow-[var(--dropShadow)] rounded-sm"
              />
            </Link>
          </div>

          <div className="flex items-end justify-between m-1">
            <h2>{issue.name}</h2>
            <p className="text-sm text-[var(--t-dark-4)]">
              {formatDateToUSA(issue.release_date)}
            </p>
          </div>
          <p className="mb-4">{issue.description}</p>
          <NavButton
            href={`issues/${issue.id}`}
            className="border-1 border-solid border-stone-400 transition hover:bg-stone-100/5 focus:border-white text-stone-400 my-4"
          >
            View More
          </NavButton>
        </article>
      ))}
    </div>
  );
}
