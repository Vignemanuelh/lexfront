import React from "react";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  className?: string;
}

/**
 * PageHeader — Entête monumental et solennel pour toutes les pages secondaires de LexBénin.
 * Utilise la police Newsreader (font-editorial) façon America.gov pour conférer autorité et clarté.
 */
export default function PageHeader({
  title,
  subtitle,
  badge,
  className = "",
}: PageHeaderProps) {
  return (
    <header className={`w-full text-center mb-12 sm:mb-16 flex flex-col items-center ${className}`}>
      {badge && (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-medium mb-4 bg-black/5 dark:bg-white/10 text-[#0F2942] dark:text-amber-400 border border-black/10 dark:border-white/10">
          {badge}
        </span>
      )}
      <h1 className="font-editorial text-5xl sm:text-6xl md:text-7xl font-normal text-[#0A0D14] dark:text-white tracking-[-0.03em] leading-[1.08] mb-4 text-balance">
        {title}
      </h1>
      {subtitle && (
        <p className="text-base sm:text-lg md:text-xl text-[#525866] dark:text-white/70 font-normal max-w-2xl mx-auto text-balance">
          {subtitle}
        </p>
      )}
    </header>
  );
}
