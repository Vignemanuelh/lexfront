"use client";

import React, { useState } from "react";
import Link from "next/link";
import MenuDrawer from "./MenuDrawer";
import BeninFlag from "@/components/ui/BeninFlag";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="w-full flex flex-col">
      {/* Barre de navigation principale */}
      <header className="w-full pt-5 pb-4 px-6 md:px-12 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-editorial text-2xl md:text-3xl font-normal tracking-tight text-[#0A0D14]">
              LexBénin
            </span>
            <BeninFlag className="h-3.5 w-5 ml-0.5" />
          </Link>
          <span className="text-xs text-[#525866] font-normal hidden sm:inline pl-1">
            Guide citoyen du Code du numérique
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
