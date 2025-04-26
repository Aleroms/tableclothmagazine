import { User } from "@/app/lib/definitions";
import UserCard from "./userCard";
import clsx from "clsx";

interface UserSelectorProps {
  users: User[];
  currentUser: User;
  onUserSelect: (user: User) => void;
}

export default function UserSelector({
  users,
  currentUser,
  onUserSelect,
}: UserSelectorProps) {
  return (
    <>
      {/* Mobile view of user profile images  */}
      <div className="flex overflow-visible overflow-x-auto gap-6 items-center p-3 md:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 cursor-pointer">
        {users.map((user) => (
          <div
            key={user.id}
            className={clsx(
              currentUser.id === user.id &&
                "ring-4 ring-[var(--table-1)] scale-105 rounded-3xl"
            )}
            onClick={() => onUserSelect(user)}
          >
            <UserCard user={user} />
          </div>
        ))}
      </div>
    </>
  );
}
