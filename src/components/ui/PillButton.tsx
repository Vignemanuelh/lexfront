import React from "react";
import Link from "next/link";

export interface PillButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "accent";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  title?: string;
  "aria-label"?: string;
}

/**
 * PillButton — Primitif officiel de bouton pilule arrondi (rounded-full).
 * Adopte les tokens officiels LexBénin / America.gov.
 */
export default function PillButton({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  disabled = false,
  type = "button",
  className = "",
  title,
  "aria-label": ariaLabel,
}: PillButtonProps) {
  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs sm:text-sm gap-1.5",
    md: "px-5 py-2.5 text-sm sm:text-base gap-2",
    lg: "px-7 py-3 text-base sm:text-lg gap-2.5",
  };

  const variantClasses = {
    primary:
      "bg-[#0F2942] hover:bg-[#001428] text-white dark:bg-[#0066C5] dark:hover:bg-[#1A75D0] dark:text-white shadow-sm",
    secondary:
      "bg-white dark:bg-[#14171D] hover:bg-black/5 dark:hover:bg-white/10 text-[#0A0D14] dark:text-white border border-[#E5E7EB] dark:border-white/10 shadow-xs",
    ghost:
      "bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-[#0A0D14] dark:text-white",
    accent:
      "bg-[#008751] hover:bg-[#006e42] text-white shadow-sm",
  };

  const combinedClasses = `inline-flex items-center justify-center font-sans font-medium rounded-full transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:pointer-events-none select-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses} title={title} aria-label={ariaLabel} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      title={title}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
