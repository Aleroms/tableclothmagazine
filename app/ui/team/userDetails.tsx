import { User } from "@/app/lib/definitions";
// import { CustomMDX } from "@/app/plugin/mdx-remote";
import clsx from "clsx";

export default function UserDetails({ user }: { user: User }) {
  return (
    <div className="md:w-md lg:w-lg">
      <h2 className="flex items-center gap-4 text-4xl md:text-5xl mt-6 mb-4 font-bold">
        {user.first_name} {user.last_name}
        <span
          className={clsx(
            "inline-block w-3 h-3 md:h-4 md:w-4 rounded-full ml-2 align-middle",
            !user.fav_color && "bg-gray-400"
          )}
          style={
            user.fav_color ? { backgroundColor: user.fav_color } : undefined
          }
        ></span>
      </h2>
      <h3 className="mb-2 text-[var(--t-dark-4)] md:text-xl">{user.role}</h3>
      {user.pronouns && (
        <h4 className="text-[var(--t-dark-4)]">{user.pronouns}</h4>
      )}
      {user.description ? (
        // <CustomMDX source={user.description} />
        <p className="mt-10 pr-3">{user.description}</p>
      ) : (
        <p>an overal awesome person! ✨</p>
      )}
    </div>
  );
}
