import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import Link from "next/link";
import React from "react";

// Generic type for MDX component props
type ComponentProps = {
  children?: React.ReactNode;
  href?: string;
};

const components = {
  h2: (props: ComponentProps) => (
    <h2 {...props} className="text-lg font-bold my-12 text-[var(--table-1)]">
      {props.children}
    </h2>
  ),
  p: (props: ComponentProps) => <p className="my-5">{props.children}</p>,
  em: (props: ComponentProps) => (
    <em className="text-stone-400 my-6">{props.children}</em>
  ),
  a: (props: ComponentProps) => {
    const { href, children } = props;
    const styles =
      "font-black text-lg underline underline-offset-3 decoration-2 hover:decoration-3 decoration-[var(--table-1)]";

    if (typeof href === "string" && href.startsWith("https")) {
      return (
        <a href={href} className={`${styles}`}>
          {children}
        </a>
      );
    }

    if (typeof href === "string") {
      return (
        <Link href={href}>
          <a className={`${styles}`}>{children}</a>
        </Link>
      );
    }

    return <span>{children}</span>;
  },
};

export function CustomMDX(props: MDXRemoteProps) {
  return (
    <MDXRemote
      {...props}
      components={{
        ...components,
        ...(props.components || {}),
      }}
    />
  );
}
