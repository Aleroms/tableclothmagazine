import { Article } from "@/app/lib/definitions";
import { formatDateToUSA } from "@/app/lib/utils";
import Image from "next/image";

type ArticleCardProps = {
  article: Article;
};

export default function ArticleCard({ article }: ArticleCardProps) {
  const { writer, release_date, title } = article;
  const fullName = writer.first_name + " " + writer.last_name;
  const date = formatDateToUSA(release_date);

  return (
    <article
      className="bg-[var(--t-dark-3)] my-1 rounded-sm p-3
     drop-shadow-[var(--dropShadow)] min-h-40 flex flex-col justify-between"
    >
      <h3 className="mb-8">{title}</h3>
      <div className="flex gap-4 items-center">
        {writer.img_url ? (
          <Image
            width={40}
            height={40}
            src={writer.img_url}
            alt={`${fullName} profile picture`}
          />
        ) : (
          // fallback incase user has no profile picture
          <div className="h-9 w-9 bg-stone-300 rounded-full" />
        )}
        <div className="flex flex-col py-1">
          <p className="font-light text-[16px]">by {fullName}</p>
          <p className="text-stone-400 font-light text-sm">{date}</p>
        </div>
      </div>
    </article>
  );
}
