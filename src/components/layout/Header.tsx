"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import MenuDrawer from "./MenuDrawer";
import BeninFlag from "@/components/ui/BeninFlag";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-40 w-full flex flex-col bg-[#F7F7F5]/90 dark:bg-[#0B0D12]/90 backdrop-blur-md border-b border-black/[0.04] dark:border-white/[0.06]">
        {/* Barre de navigation principale */}
        <header className="w-full pt-4 pb-3.5 px-6 md:px-12 flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-editorial text-2xl md:text-3xl font-normal tracking-tight text-[#0A0D14] dark:text-white">
                LexBénin
              </span>
              <BeninFlag className="h-3.5 w-5 ml-0.5" />
            </Link>
            <span className="text-xs text-[#525866] dark:text-white/60 font-normal hidden sm:inline pl-1">
              Guide citoyen du Code du numérique
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/partenaire"
              className="hidden md:inline-flex items-center gap-1.5 font-medium rounded-full h-11 px-4 text-xs font-sans text-[#525866] hover:text-[#0A0D14] dark:text-white/70 dark:hover:text-white border border-black/10 dark:border-white/15 hover:border-black/25 dark:hover:border-white/25 transition-all cursor-pointer"
            >
              <span>Espace Partenaire</span>
            </Link>

            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "22900000000"}?text=Bonjour%20LexB%C3%A9nin`}
              target="_blank"
              rel="noopener noreferrer"
              title="Consulter LexBénin sur WhatsApp"
              className="hidden sm:inline-flex items-center gap-1.5 font-medium rounded-full h-11 px-4 text-xs font-sans bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#008751] dark:text-[#25D366] border border-[#25D366]/30 transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={isMenuOpen}
              className="inline-flex items-center justify-center font-medium rounded-full h-11 px-6 text-sm bg-[#0F2942] hover:bg-[#001428] active:bg-[#0F2942] text-white shadow-sm transition-all duration-200 active:scale-95 cursor-pointer"
            >
              Menu
            </button>
          </div>
        </header>
      </div>

      {/* 3. Tiroir de navigation latéral (Drawer) hors du conteneur backdrop-blur */}
      <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
