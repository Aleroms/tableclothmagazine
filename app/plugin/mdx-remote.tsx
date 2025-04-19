import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";

import Link from "next/link";
import Image from "next/image";

import React from "react";

import {
  ComponentImageProps,
  ComponetAnchorProps,
  ComponentProps,
} from "./definitions";

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
  a: (props: ComponetAnchorProps) => {
    const { href, children } = props;
    const styles =
      "font-bold text-lg underline underline-offset-3 decoration-2 hover:decoration-3 decoration-[var(--table-1)]";

    if (typeof href === "string" && href.startsWith("https")) {
      return (
        <a href={href} className={`${styles}`}>
          {children}
        </a>
      );
    }

    if (typeof href === "string") {
      return (
        <Link href={href} className={`${styles}`}>
          {children}
        </Link>
      );
    }

    return <span>{children}</span>;
  },
  img: ({ src, alt }: ComponentImageProps) => {
    return <Image src={src} alt={alt} width={300} height={300} />;
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
