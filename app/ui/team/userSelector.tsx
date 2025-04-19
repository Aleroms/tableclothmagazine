import { User } from "@/app/lib/definitions";
import UserCard from "./userCard";

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
      <div className="flex overflow-visible overflow-x-auto gap-6 items-center p-3 md:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            isSelected={currentUser.id === user.id}
            onClick={() => onUserSelect(user)}
          />
        ))}
      </div>
    </>
  );
}
