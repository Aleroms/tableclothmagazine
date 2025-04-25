import { User } from "@/app/lib/definitions";
// import { CustomMDX } from "@/app/plugin/mdx-remote";
import clsx from "clsx";
import { JSX } from "react";

/**
 * Parses a string for Markdown-style [label](url) links and plain URLs.
 * Returns a JSX paragraph with links rendered.
 */
function parseDescriptionForExternalLinks(description: string): JSX.Element {
  const markdownRegex = /\[(.*?)\]\((https?:\/\/[^\s)]+|www\.[^\s)]+)\)/g;
  const nakedLinkRegex = /(https?:\/\/[^\s]+|www\.[^\s)]+)/g;
  const defaultLabel = "link";

  // stores all steps of parsing & is returned after parsing
  const parsedDescription: (string | JSX.Element)[] = [];
  let i = 0;

  // parse for markdown
  for (const match of description.matchAll(markdownRegex)) {
    const [fullMatch, label, url] = match;
    const matchIdx = match.index ?? 0;

    // appends plain text before match
    if (i < matchIdx) {
      parsedDescription.push(description.slice(i, matchIdx));
    }

    // markdown link
    const href = url.startsWith("http") ? url : `https://${url}`;

    parsedDescription.push(
      <a
        className="underline text-blue-400"
        href={href}
        key={`${href}-${matchIdx}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
      </a>
    );

    // new pos for start of slice
    i = fullMatch.length + match.index;
  }

  // pushes last remaining strings after last markdown
  parsedDescription.push(description.slice(i));

  let j = 0;
  const fullParsedDesc: (string | JSX.Element)[] = [];

  // parses naked links
  for (const partition of parsedDescription) {
    // only parse strings
    if (typeof partition !== "string") {
      fullParsedDesc.push(partition);
      continue;
    }

    for (const match of partition.matchAll(nakedLinkRegex)) {
      const [url] = match;
      const matchIdx = match.index || 0;

      if (j < matchIdx) {
        fullParsedDesc.push(partition.slice(j, matchIdx));
      }

      const href = url.startsWith("http") ? url : `https://${url}`;
      fullParsedDesc.push(
        <a
          className="underline text-blue-400"
          href={href}
          key={`${href}-${matchIdx}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {defaultLabel}
        </a>
      );

      j = matchIdx + url.length;
    }
    // push remained string
    if (j < partition.length) {
      fullParsedDesc.push(partition.slice(j));
    }
  }

  return <div>{fullParsedDesc.flat()}</div>;
}

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
        <p className="mt-10 pr-3">
          {parseDescriptionForExternalLinks(user.description)}
        </p>
      ) : (
        <p>an overal awesome person! ✨</p>
      )}
    </div>
  );
}
