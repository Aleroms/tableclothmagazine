"use client";
import { useState } from "react";
import TableLogo from "@/app/ui/table_logo";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  return (
    <>
      <header className="bg-[var(--t-light-3)] dark:bg-black shadow-sm">
        <div className="flex items-center justify-between py-5 px-8">
          <Link href={"/"}>
            <TableLogo size={80} />
          </Link>

          {/* desktop menu */}
          <nav className="hidden md:flex items-center justify-even gap-10 capitalize font-medium">
            <Link href="/issues">Issues</Link>
            <Link href="/about">about</Link>
            <Link href="/events">events</Link>
            {status === "authenticated" && (
              <Link href="/dashboard">Dashboard</Link>
            )}
            {/* <Link href="/resources">resources</Link> */}
          </nav>

          {/* hamburger menu*/}
          <button
            className=" md:hidden flex flex-col justify-center items-center gap-0.5"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span
              className={`dark:bg-white bg-black block transition-all duration-300 ease-out 
                    h-0.5 w-6 rounded-sm ${
                      menuOpen ? "rotate-45 translate-y-1" : ""
                    }`}
            ></span>
            <span
              className={`dark:bg-white bg-black block transition-all duration-300 ease-out 
                    h-0.5 w-6 rounded-sm my-0.5 ${
                      menuOpen ? "opacity-0" : "opacity-100"
                    }`}
            ></span>
            <span
              className={`dark:bg-white bg-black block transition-all duration-300 ease-out 
                    h-0.5 w-6 rounded-sm ${
                      menuOpen ? "rotate-135 -translate-y-2" : ""
                    }`}
            ></span>
          </button>
        </div>
        {menuOpen && (
          <nav className="flex flex-col md:hidden items-start gap-4 mt-4 px-8 py-4 capitalize font-medium">
            <Link href="/issues" onClick={() => setMenuOpen(false)}>
              Issues
            </Link>
            <Link href="/about" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            <Link href="/events" onClick={() => setMenuOpen(false)}>
              Events
            </Link>
            {status === "authenticated" && (
              <Link href="/dashboard">Dashboard</Link>
            )}
            {status === "authenticated" && session.user && (
              <div className="flex items-center gap-2 bg-[var(--t-light-2)] dark:bg-[var(--t-dark-2)] rounded-md px-3 py-2 mb-2 shadow-sm">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  ↪️ Signed in as{" "}
                  <span className="font-semibold">{session.user.email}</span>
                </span>
                <Link
                  href="/api/auth/signout"
                  className="ml-auto text-sm font-medium text-[var(--table-1)]  transition-colors"
                >
                  Sign out
                </Link>
              </div>
            )}
            {/* <Link href="/resources" onClick={() => setMenuOpen(false)}>
            Resources
          </Link> */}
          </nav>
        )}
        {status === "authenticated" && session.user && (
          <div className="hidden md:flex items-center gap-2 bg-[var(--t-light-2)] dark:bg-[var(--t-dark-2)] rounded-md px-3 py-2 mb-2 shadow-sm">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              ↪️ Signed in as{" "}
              <span className="font-semibold">{session.user.email}</span>
            </span>
            <Link
              href="/api/auth/signout"
              className="ml-auto text-sm font-medium text-[var(--table-1)]  transition-colors"
            >
              Sign out
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
