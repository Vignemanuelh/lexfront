import React from "react";

interface BeninFlagProps {
  className?: string;
  width?: number;
  height?: number;
}

/**
 * Drapeau officiel de la République du Bénin :
 * - Bande verticale verte à la hampe (gauche) : 40 % de la largeur, pleine hauteur.
 * - Deux bandes horizontales au battant (droite) : jaune en haut (50 % hauteur), rouge en bas (50 % hauteur).
 * Ratio officiel : 2:3.
 */
export default function BeninFlag({ className = "h-3.5 w-5", width, height }: BeninFlagProps) {
  return (
    <span
      className={`inline-block relative overflow-hidden rounded-[2px] border border-black/15 shadow-2xs shrink-0 select-none ${className}`}
      style={width && height ? { width, height } : undefined}
      role="img"
      aria-label="Drapeau du Bénin"
      title="République du Bénin"
    >
      {/* 1. Bande verticale verte à gauche (40% de la largeur) */}
      <span className="absolute left-0 top-0 bottom-0 w-[40%] bg-[#008751]" />

      {/* 2. Bande horizontale jaune en haut à droite (60% de la largeur, 50% de la hauteur) */}
      <span className="absolute right-0 top-0 w-[60%] h-[50%] bg-[#FCD116]" />

      {/* 3. Bande horizontale rouge en bas à droite (60% de la largeur, 50% de la hauteur) */}
      <span className="absolute right-0 bottom-0 w-[60%] h-[50%] bg-[#E8112D]" />
    </span>
  );
}
