import React from "react";
import Link from "next/link";

type NavButtonProps = {
  children: React.ReactNode;
  href?: string; // Can be internal or external
  onClick?: () => void;
  className?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
};

const baseStyles = "px-4 py-2 rounded-md drop-shadow[var(--dropShadow)]";

const NavButton: React.FC<NavButtonProps> = ({
  children,
  href,
  onClick,
  className = "",
  target,
}) => {
  const combinedClass = `${baseStyles} ${className}`;

  // If href is defined and starts with http, treat as external link
  const isExternal = href?.startsWith("http");

  if (href && isExternal) {
    return (
      <a
        href={href}
        target={target || "_blank"}
        rel="noopener noreferrer"
        className={combinedClass}
      >
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={combinedClass}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={combinedClass}>
      {children}
    </button>
  );
};

export default NavButton;
