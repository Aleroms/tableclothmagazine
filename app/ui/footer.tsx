import TableLogo from "./table_logo";
import Link from "next/link";
export default function Footer() {
  // removing "resources" for now
  const links = ["issues", "about", "events"];
  const delim = "|";
  return (
    <footer className="px-12 py-8 bg-[var(--t-dark-3)] block">
      <TableLogo size={100} />
      <p className="text-stone-50/40 text-sm mt-6 text-center">
        © 2025 The Tablecloth magazine. All rights reserved.
      </p>
      <nav className="flex justify-center gap-4 mt-2">
        {links.map((link, index) => (
          <span key={link} className="flex items-center gap-2">
            <Link href={`/${link}`}>{link}</Link>
            {index < links.length - 1 && (
              <span className="text-stone-50/40">{delim}</span>
            )}
          </span>
        ))}
      </nav>
    </footer>
  );
}
