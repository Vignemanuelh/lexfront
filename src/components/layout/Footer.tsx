"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mic } from "lucide-react";

interface FooterProps {
  onQuickSearch?: (query: string) => void;
}

export default function Footer({ onQuickSearch }: FooterProps) {
  const [bottomQuery, setBottomQuery] = useState("");

  const handleBottomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bottomQuery.trim() && onQuickSearch) {
      onQuickSearch(bottomQuery);
    }
  };

  return (
    <footer className="w-full border-t border-[#E5E7EB]/60 pt-20 pb-16 px-6 flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Navigation éditoriale monumentale */}
        <nav className="flex flex-col items-center gap-3 sm:gap-4 mb-20" aria-label="Navigation secondaire">
          <Link
            href="#comment-ca-marche"
            className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[#0A0D14] hover:text-[#525866] transition-colors"
          >
            Comment ça fonctionne
          </Link>
          <Link
            href="#confidentialite"
            className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[#0A0D14] hover:text-[#525866] transition-colors"
          >
            Confidentialité
          </Link>
          <Link
            href="#a-propos"
            className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[#0A0D14] hover:text-[#525866] transition-colors"
          >
            À propos & Déontologie
          </Link>
          <Link
            href="#roadmap"
            className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[#0A0D14] hover:text-[#525866] transition-colors"
          >
            Feuille de route
          </Link>
          <Link
            href="#faq"
            className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[#0A0D14] hover:text-[#525866] transition-colors"
          >
            Foire aux questions (FAQ)
          </Link>
          <Link
            href="#contact"
            className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[#0A0D14] hover:text-[#525866] transition-colors"
          >
            Signaler une erreur
          </Link>
        </nav>

        {/* Immense lettrage mot-symbole "LexBénin" façon America.gov */}
        <div className="w-full text-center my-6 select-none">
          <h2 className="font-editorial text-7xl sm:text-9xl md:text-[140px] lg:text-[170px] leading-none text-[#0A0D14] tracking-[-0.04em] font-normal">
            LexBénin
          </h2>
        </div>

        {/* Mentions républicaines tripartites encadrées */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 items-center pt-8 pb-10 border-t border-b border-[#E5E7EB]/70 text-xs text-[#525866]">
          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <span className="inline-flex items-center h-4 w-6 overflow-hidden rounded-[2px] border border-black/10">
              <span className="w-1/3 h-full bg-[#008751]" />
              <span className="w-1/3 h-full bg-[#FCD116]" />
              <span className="w-1/3 h-full bg-[#E8112D]" />
            </span>
            <span className="text-left font-normal">Service d&apos;intérêt général pour les citoyens béninois</span>
          </div>
          <div className="text-center font-normal">
            En partenariat avec le Barreau du Bénin & l&apos;Université d&apos;Abomey-Calavi
          </div>
          <div className="text-center md:text-right font-mono text-[11px] text-[#525866]">
            Conforme Loi N° 2017-20 modifiée
          </div>
        </div>

        {/* Liens légaux */}
        <div className="pt-6 pb-12 flex flex-wrap items-center justify-center gap-6 text-xs text-[#525866]">
          <Link href="#mentions" className="hover:underline">Mentions légales</Link>
          <Link href="#donnees" className="hover:underline">Protection des données</Link>
          <Link href="#cgu" className="hover:underline">Conditions d&apos;utilisation</Link>
          <span>Français (Bénin)</span>
        </div>

        {/* Barre de recherche discrète en bas de page */}
        <div className="w-full max-w-md mx-auto pt-2">
          <form
            onSubmit={handleBottomSubmit}
            className="relative flex items-center bg-white rounded-full border border-[#E5E7EB] shadow-sm px-4 py-2 hover:border-black/30 transition-all"
          >
            <input
              type="text"
              value={bottomQuery}
              onChange={(e) => setBottomQuery(e.target.value)}
              placeholder="Posez votre question..."
              className="w-full bg-transparent text-xs text-[#0A0D14] placeholder:text-[#525866]/70 focus:outline-none border-none p-0 pr-2"
            />
            <button
              type="button"
              className="text-[#525866] hover:text-[#0A0D14] p-1"
              aria-label="Recherche vocale"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              type="submit"
              className="w-7 h-7 rounded-full bg-[#0F2942] text-white flex items-center justify-center ml-1 hover:bg-[#001428] transition-colors"
              aria-label="Lancer la recherche"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}
