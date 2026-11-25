import React from "react";

export interface CivicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  elevated?: boolean;
  className?: string;
}

/**
 * CivicCard — Primitif de carte officielle LexBénin.
 * Garantit l'absence de fond blanc en mode sombre (bascule automatiquement sur #0F1217 ou #14171D).
 */
export default function CivicCard({
  children,
  elevated = false,
  className = "",
  ...props
}: CivicCardProps) {
  return (
    <div
      className={`w-full rounded-3xl p-6 sm:p-8 transition-all duration-200 border ${
        elevated
          ? "bg-[#F7F7F5] dark:bg-[#14171D] border-[#E5E7EB] dark:border-white/10 shadow-md"
          : "bg-white dark:bg-[#0F1217] border-[#E5E7EB] dark:border-white/10 shadow-sm"
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
