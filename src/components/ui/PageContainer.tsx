import React from "react";

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "max-w-3xl" | "max-w-4xl" | "max-w-5xl" | "max-w-6xl";
}

/**
 * PageContainer — Conteneur standard d'alignement pour toutes les pages citoyennes de LexBénin.
 * Assure un centrage parfait et une largeur de lecture idéale (max-w-4xl).
 */
export default function PageContainer({
  children,
  className = "",
  maxWidth = "max-w-4xl",
}: PageContainerProps) {
  return (
    <div
      data-testid="page-container"
      className={`w-full ${maxWidth} mx-auto px-4 sm:px-6 py-10 sm:py-16 flex flex-col items-center ${className}`}
    >
      {children}
    </div>
  );
}
