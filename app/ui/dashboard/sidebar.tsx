"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";
import SidebarSkeleton from "@/app/ui/skeleton/sidebarSkeleton";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const { user, session, loading, isAdmin, isTeam } = useCurrentUser();
  const pathname = usePathname();
  console.log("User data:", user);
  console.log("Session data:", session);
  console.log("isAdmin:", isAdmin, "isTeam:", isTeam);

  if (loading) {
    return <SidebarSkeleton />;
  }

  if (!session) {
    return null;
  }

  const userName = user?.first_name || session.user?.name || "User";

  // Helper function to determine if a route is active
  const isActiveRoute = (route: string) => {
    if (route === "/dashboard" && pathname === "/dashboard") return true;
    if (route !== "/dashboard" && pathname.startsWith(route)) return true;
    return false;
  };

  // Common link styling
  const getLinkClassName = (route: string) => {
    const baseClasses =
      "py-2 px-3 rounded transition-colors text-sm md:text-base block";
    const activeClasses = "bg-[var(--t-dark-3)] text-white";
    const inactiveClasses =
      "hover:bg-[var(--t-dark-1)] text-gray-300 hover:text-white";

    return `${baseClasses} ${
      isActiveRoute(route) ? activeClasses : inactiveClasses
    }`;
  };

  return (
    <aside className="w-64 md:w-72 lg:w-80 flex flex-col p-4 outline-1 bg-[var(--t-dark-2)] min-h-full">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 break-words leading-tight">
        Welcome {userName}!
      </h2>
      <hr className="mb-3" />

      <nav className="space-y-2 flex flex-col flex-1">
        <Link href="/dashboard" className={getLinkClassName("/dashboard")}>
          Profile
        </Link>
        {isAdmin && (
          <>
            <h3 className="uppercase text-xs md:text-sm text-gray-400 mt-4 mb-2 font-semibold">
              Admin
            </h3>
            <Link
              href="/dashboard/team"
              className={getLinkClassName("/dashboard/team")}
            >
              Team
            </Link>
            <Link
              href="/dashboard/issues"
              className={getLinkClassName("/dashboard/issues")}
            >
              Issues
            </Link>
            <Link
              href="/dashboard/events"
              className={getLinkClassName("/dashboard/events")}
            >
              Events
            </Link>
            <Link
              href="/dashboard/resources"
              className={getLinkClassName("/dashboard/resources")}
            >
              Resources
            </Link>
            <Link
              href="/dashboard/admin/articles"
              className={getLinkClassName("/dashboard/admin/articles")}
            >
              Manage Articles
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
              className={getLinkClassName("/dashboard/articles")}
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
