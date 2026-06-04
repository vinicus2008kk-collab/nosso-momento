"use client";

import Link from "next/link";
import { ReactNode } from "react";

export function PrimaryButton({
  children,
  href,
  type = "button",
  className = "",
  onClick
}: {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  className?: string;
  onClick?: () => void;
}) {
  const baseClass =
    "inline-flex items-center justify-center rounded-full border border-[#d4af37]/45 bg-gradient-to-r from-[#7b2049] via-[#5a1f58] to-[#2a152b] px-6 py-3 font-semibold text-[#fff7ef] shadow-[0_14px_34px_rgba(3,2,8,0.55)] transition-all duration-300 hover:scale-[1.03] hover:border-[#d4af37]/70 hover:shadow-[0_0_26px_rgba(212,175,55,0.3)]";

  if (href) {
    return (
      <Link href={href} className={`${baseClass} ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={`${baseClass} ${className}`}>
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
