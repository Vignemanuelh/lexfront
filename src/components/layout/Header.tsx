import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full pt-6 pb-4 px-6 md:px-12 flex items-center justify-between max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-editorial text-2xl md:text-3xl font-normal tracking-tight text-[#0A0D14]">
            LexBénin
          </span>
          <span
            className="inline-flex items-center h-3.5 w-5 overflow-hidden rounded-[2px] shadow-sm ml-0.5 border border-black/10"
            title="République du Bénin"
            aria-label="Drapeau de la République du Bénin"
          >
            <span className="w-1/3 h-full bg-[#008751]" />
            <span className="w-1/3 h-full bg-[#FCD116]" />
            <span className="w-1/3 h-full bg-[#E8112D]" />
          </span>
        </Link>
        <span className="text-xs text-[#525866] font-normal hidden sm:inline pl-1">
          République du Bénin
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/5 hover:bg-black/10 text-[#525866] transition-colors"
          aria-label="Sélectionner la langue"
        >
          FR
        </button>
        <Link
          href="#recherche"
          className="text-xs font-medium px-4 py-1.5 rounded-full bg-white border border-[#E5E7EB] shadow-sm hover:border-black/30 transition-all text-[#0A0D14]"
        >
          Poser une question
        </Link>
      </div>
    </header>
  );
}
