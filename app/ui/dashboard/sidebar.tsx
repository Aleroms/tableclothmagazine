"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";

export default function Sidebar() {
  const { user, session, loading, isAdmin, isTeam } = useCurrentUser();
  console.log("User data:", user);
  console.log("Session data:", session);
  console.log("isAdmin:", isAdmin, "isTeam:", isTeam);

  if (loading) {
    return (
      <div className="w-64 md:w-72 lg:w-80 flex flex-col p-4 bg-[var(--t-dark-2)] text-white">
        Loading...
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const userName = user?.first_name || session.user?.name || "User";

  return (
    <aside className="w-64 md:w-72 lg:w-80 flex flex-col p-4 outline-1 bg-[var(--t-dark-2)] min-h-full">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 break-words leading-tight">
        Welcome {userName}!
      </h2>
      <hr className="mb-3" />

      <nav className="space-y-2 flex flex-col flex-1">
        <Link
          href="/dashboard"
          className="py-2 px-3 rounded hover:bg-[var(--t-dark-1)] transition-colors text-sm md:text-base"
        >
          Profile
        </Link>
        {isAdmin && (
          <>
            <h3 className="uppercase text-xs md:text-sm text-gray-400 mt-4 mb-2 font-semibold">
              Admin
            </h3>
            <Link
              href="/dashboard/team"
              className="py-2 px-3 rounded hover:bg-[var(--t-dark-1)] transition-colors text-sm md:text-base"
            >
              Team
            </Link>
            <Link
              href="/dashboard/issues"
              className="py-2 px-3 rounded hover:bg-[var(--t-dark-1)] transition-colors text-sm md:text-base"
            >
              Issues
            </Link>
            <Link
              href="/dashboard/events"
              className="py-2 px-3 rounded hover:bg-[var(--t-dark-1)] transition-colors text-sm md:text-base"
            >
              Events
            </Link>
            <Link
              href="/dashboard/resources"
              className="py-2 px-3 rounded hover:bg-[var(--t-dark-1)] transition-colors text-sm md:text-base"
            >
              Resources
            </Link>
          </>
        )}

        {(isTeam || isAdmin) && (
          <>
            <h3 className="uppercase text-xs md:text-sm text-gray-400 mt-4 mb-2 font-semibold">
              Team
            </h3>
            <Link
              href="/dashboard/articles"
              className="py-2 px-3 rounded hover:bg-[var(--t-dark-1)] transition-colors text-sm md:text-base"
            >
              Articles
            </Link>
          </>
        )}

        <div className="mt-auto pt-6">
          <button
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            className="w-full text-left text-red-400 hover:text-red-300 py-2 px-3 rounded transition-colors text-sm md:text-base"
          >
            Sign Out
          </button>
        </div>
      </nav>
    </aside>
  );
}
