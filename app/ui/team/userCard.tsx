import { User } from "@/app/lib/definitions";
import Image from "next/image";

interface Props {
  user: User;
}

export default function UserCard({ user }: Props) {
  return (
    <div className="transition-all duration-200 ease-in-out rounded-3xl">
      {!user.img_url ? (
        <div className="h-15 w-15 bg-stone-400 rounded-3xl md:h-20 md:w-20" />
      ) : (
        <div className="h-15 w-15 relative md:h-20 md:w-20">
          <Image
            src={user.img_url}
            alt={`${user.first_name} ${user.last_name} profile picture`}
            fill
            sizes="80px"
            style={{ objectFit: "cover", borderRadius: "1rem" }}
          />
        </div>
      )}
    </div>
  );
}
