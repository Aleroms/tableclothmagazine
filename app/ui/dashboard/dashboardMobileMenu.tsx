"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";

export default function DashboardMobileMenu() {
  const { user, session, loading, isAdmin, isTeam } = useCurrentUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="md:hidden bg-[var(--t-dark-2)] border-b border-gray-700 p-4">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session) return null;

  const userName = user?.first_name || session.user?.name || "User";

  return (
    <div className="md:hidden bg-[var(--t-dark-2)] border-b border-gray-700">
      {/* Top bar with hamburger menu */}
      <div className="flex items-center justify-between p-4">
        <h1 className="text-lg font-bold text-white truncate">
          Welcome {userName}!
        </h1>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-[var(--t-dark-1)] transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Collapsible menu */}
      {isMenuOpen && (
        <div className="border-t border-gray-700 bg-[var(--t-dark-1)]">
          <nav className="px-4 py-2 space-y-1">
            <Link
              href="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 px-3 rounded text-white hover:bg-[var(--t-dark-2)] transition-colors"
            >
              Profile
            </Link>

            {isAdmin && (
              <>
                <div className="pt-2">
                  <h3 className="px-3 text-xs uppercase text-gray-400 font-semibold mb-1">
                    Admin
                  </h3>
                  <Link
                    href="/dashboard/team"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 px-3 rounded text-white hover:bg-[var(--t-dark-2)] transition-colors"
                  >
                    Team
                  </Link>
                  <Link
                    href="/dashboard/issues"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 px-3 rounded text-white hover:bg-[var(--t-dark-2)] transition-colors"
                  >
                    Issues
                  </Link>
                  <Link
                    href="/dashboard/events"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 px-3 rounded text-white hover:bg-[var(--t-dark-2)] transition-colors"
                  >
                    Events
                  </Link>
                  <Link
                    href="/dashboard/resources"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 px-3 rounded text-white hover:bg-[var(--t-dark-2)] transition-colors"
                  >
                    Resources
                  </Link>
                  <Link
                    href="/dashboard/admin/articles"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 px-3 rounded text-white hover:bg-[var(--t-dark-2)] transition-colors"
                  >
                    Manage Articles
                  </Link>
                </div>
              </>
            )}

            {(isTeam || isAdmin) && (
              <div className="pt-2">
                <h3 className="px-3 text-xs uppercase text-gray-400 font-semibold mb-1">
                  Team
                </h3>
                <Link
                  href="/dashboard/articles"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 px-3 rounded text-white hover:bg-[var(--t-dark-2)] transition-colors"
                >
                  Articles
                </Link>
              </div>
            )}

            <div className="pt-4 border-t border-gray-600">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  signOut({ callbackUrl: "/auth/signin" });
                }}
                className="block w-full text-left py-2 px-3 rounded text-red-400 hover:text-red-300 hover:bg-[var(--t-dark-2)] transition-colors"
              >
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
