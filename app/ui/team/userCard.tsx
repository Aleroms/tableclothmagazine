import { User } from "@/app/lib/definitions";
import clsx from "clsx";
import Image from "next/image";

interface Props {
  user: User;
  isSelected: boolean;
  onClick: () => void;
}

export default function UserCard({ user, isSelected, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "transition-all duration-200 ease-in-out rounded-3xl cursor-pointer",
        isSelected && "ring-4 ring-[var(--table-1)] scale-105"
      )}
    >
      {!user.img_url ? (
        <div className="h-35 w-35 bg-stone-400 rounded-3xl md:h-20 md:w-20" />
      ) : (
        <div className="h-35 w-35 relative md:h-20 md:w-20">
          <Image
            src={user.img_url}
            alt={`${user.first_name} ${user.last_name} profile picture`}
            fill
            sizes="80px"
            style={{ objectFit: "cover", borderRadius: "1rem" }}
            className={clsx(
              isSelected && "ring-4 ring-[var(--table-1)] scale-105"
            )}
          />
        </div>
      )}
    </div>
  );
}
