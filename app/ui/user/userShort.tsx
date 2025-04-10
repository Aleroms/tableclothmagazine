import { User } from "@/app/lib/definitions";
import Image from "next/image";

interface UserShortProps {
  user: User;
}
export default function UserShort({ user }: UserShortProps) {
  return (
    <div className="flex gap-4 mt-6">
      {user.img_url ? (
        <Image
          height={40}
          width={45}
          src={user.img_url}
          alt={`${user.first_name} ${user.last_name}`}
          className="rounded-full"
        />
      ) : (
        <div className="h-20 w-20 bg-stone-400 rounded-full"></div>
      )}
      <div className="flex flex-col">
        <p className="font-medium capitalize text-lg">
          {user.first_name} {user.last_name}{" "}
          {user.pronouns ? `~ ${user.pronouns}` : ""}
        </p>
        <p className="capitalize text-sm font-light text-stone-400">
          {user.role}
        </p>
      </div>
    </div>
  );
}
