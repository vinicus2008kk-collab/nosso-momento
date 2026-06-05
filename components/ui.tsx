"use client";

import Link from "next/link";
import { CSSProperties, ReactNode } from "react";

export function PrimaryButton({
  children,
  href,
  type = "button",
  className = "",
  onClick,
  style
}: {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
}) {
  const baseClass =
    "inline-flex items-center justify-center rounded-full bg-[#8b1a2a] px-6 py-3 font-semibold text-white shadow-[0_8px_24px_rgba(139,26,42,0.35)] transition-all duration-300 hover:scale-[1.03] hover:bg-[#a0202f] hover:shadow-[0_14px_36px_rgba(139,26,42,0.45)]";

  if (href) {
    return (
      <Link href={href} className={`${baseClass} ${className}`} style={style}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={`${baseClass} ${className}`} style={style}>
      {children}
    </button>
  );
}

export function SectionTitle({
  title,
  subtitle
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="space-y-2 text-center">
      <h2 className="text-2xl font-bold text-white md:text-3xl">{title}</h2>
      <p className="text-sm text-cream/80 md:text-base">{subtitle}</p>
    </div>
  );
}
