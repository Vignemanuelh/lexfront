"use client";

import React, { useState } from "react";
import Link from "next/link";
import GovBanner from "./GovBanner";
import MenuDrawer from "./MenuDrawer";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="w-full flex flex-col">
      {/* 1. Bannière officielle républicaine supérieure extensible */}
      <GovBanner />

      {/* 2. Barre de navigation principale */}
      <header className="w-full pt-4 pb-4 px-6 md:px-12 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-editorial text-2xl md:text-3xl font-normal tracking-tight text-[#0A0D14]">
              LexBénin
            </span>
            <span
              className="inline-flex items-center h-3.5 w-5 overflow-hidden rounded-[2px] shadow-2xs ml-0.5 border border-black/10"
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
            onClick={() => setIsMenuOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={isMenuOpen}
            className="inline-flex items-center justify-center font-medium rounded-full h-11 px-6 text-sm bg-[#0F2942] hover:bg-[#001428] active:bg-[#0F2942] text-white shadow-sm transition-all duration-200 active:scale-95"
          >
            Menu
          </button>
        </div>
      </header>

      {/* 3. Tiroir de navigation latéral (Drawer) */}
      <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
}
