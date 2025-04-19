import { User } from "@/app/lib/definitions";
import Image from "next/image";
import { formatDateToUSA } from "@/app/lib/utils";

interface UserAuthorProps {
  writer: User | undefined;
  release_date: Date;
}
export default function UserAuthor({ writer, release_date }: UserAuthorProps) {
  const fullName = writer
    ? `${writer.first_name} ${writer.last_name}`
    : "Unknown Author";
  const date = formatDateToUSA(release_date);

  return (
    <div className="flex gap-4 items-center">
      {writer?.img_url ? (
        <Image
          width={40}
          height={45}
          src={writer.img_url}
          alt={`${fullName} profile picture`}
          className="rounded-full"
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
  );
}
