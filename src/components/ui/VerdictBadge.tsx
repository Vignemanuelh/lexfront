import React from "react";
import { getVerdictConfig, LegalStatusType } from "@/lib/design-tokens";

export interface VerdictBadgeProps {
  status: LegalStatusType | string;
  size?: "sm" | "md";
  className?: string;
}

/**
 * VerdictBadge — Badge officiel pour la qualification juridique du Code du numérique (RG-JUR4).
 * Affiche la pastille lumineuse et respecte strictement le contraste en mode clair et sombre.
 */
export default function VerdictBadge({
  status,
  size = "md",
  className = "",
}: VerdictBadgeProps) {
  const config = getVerdictConfig(status);

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs gap-1.5",
    md: "px-3.5 py-1.5 text-xs sm:text-sm gap-2",
  };

  const dotSizes = {
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
  };

  return (
    <span
      data-testid="verdict-badge"
      className={`inline-flex items-center font-sans font-semibold rounded-full border shadow-xs select-none transition-colors ${
        sizeClasses[size]
      } ${config.bg} ${config.border} ${config.text} ${className}`}
    >
      <span
        className={`rounded-full shrink-0 ${dotSizes[size]}`}
        style={{ backgroundColor: config.dot }}
        aria-hidden="true"
      />
      <span>{config.label}</span>
    </span>
  );
}
