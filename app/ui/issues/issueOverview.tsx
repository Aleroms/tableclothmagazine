import { formatDateToUSA } from "@/app/lib/utils";
import Image from "next/image";
import NavButton from "../button/navigationButton";
import Link from "next/link";
import { getAllIssues } from "@/app/lib/database/query";

export default async function IssueOverview() {
  const issues = await getAllIssues();
  return (
    <div className="dark:bg-[var(--t-dark-3)] bg-[var(--t-light-3)] shadow-sm p-4 rounded-sm max-w-4xl m-4 md:m-auto md:grid md:grid-cols-3 md:gap-8 lg:max-w-7xl md:pb-8">
      {issues.map(({ id, img_url, name, release_date, description }) => (
        <article key={id} className="px-4 my-5">
          <div className="relative w-60 h-80 m-auto lg:w-80 md:h-100">
            <Link href={`/issues/${id}`}>
              <Image
                src={img_url}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                alt={name}
                className=" mb-2 shadow-sm rounded-sm"
              />
            </Link>
          </div>
          <div className="md:min-h-40 my-4 ">
            <div className="flex items-end justify-between m-1">
              <h2>{name}</h2>
              <p className="text-sm text-[var(--t-dark-4)]">
                {formatDateToUSA(release_date)}
              </p>
            </div>
            <p className="mb-4">{description}</p>
            <NavButton
              href={`issues/${id}`}
              className="border-1 border-solid border-stone-400 transition hover:bg-stone-100/5 focus:border-white text-stone-400 my-4"
            >
              View More
            </NavButton>
          </div>
        </article>
      ))}
    </div>
  );
}
