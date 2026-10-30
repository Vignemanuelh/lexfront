"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X, Laptop, Sun, Moon } from "lucide-react";
import BeninFlag from "@/components/ui/BeninFlag";
import { useTheme } from "@/lib/theme";

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuDrawer({ isOpen, onClose }: MenuDrawerProps) {
  const { theme, setTheme } = useTheme();

  // Verrouillage du scroll quand le menu est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Fermeture par touche Echap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end items-center sm:items-stretch p-3 sm:p-6 bg-black/40 dark:bg-black/60 backdrop-blur-md transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Menu principal"
      onClick={onClose}
    >
      {/* Carte flottante réactive au thème (blanche en mode clair, sombre en mode sombre) */}
      <div
        className="relative w-full max-w-[320px] sm:max-w-[340px] bg-white dark:bg-[#0A0D14] text-[#0A0D14] dark:text-white rounded-[32px] sm:rounded-[38px] border border-[#E5E7EB] dark:border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.18)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.75)] p-6 sm:p-7 flex flex-col justify-between my-auto h-[min(94vh,760px)] animate-in slide-in-from-right-8 duration-300 ease-out select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. En-tête : sélecteur de mode fonctionnel en pilule & bouton circulaire (X) */}
        <div className="flex items-center justify-between w-full pt-1">
          <div className="inline-flex items-center gap-1 bg-[#F0EFEA] dark:bg-white/10 rounded-full p-1 border border-black/5 dark:border-white/10 text-[#525866] dark:text-white/70">
            <button
              type="button"
              onClick={() => setTheme("system")}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                theme === "system"
                  ? "bg-white text-[#0A0D14] dark:bg-white dark:text-[#0A0D14] shadow-xs"
                  : "hover:text-[#0A0D14] dark:hover:text-white"
              }`}
              title="Thème automatique (système)"
              aria-label="Thème système"
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                theme === "light"
                  ? "bg-white text-[#0A0D14] shadow-xs"
                  : "hover:text-[#0A0D14] dark:hover:text-white"
              }`}
              title="Thème clair"
              aria-label="Thème clair"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                theme === "dark"
                  ? "bg-[#0A0D14] text-white dark:bg-white dark:text-[#0A0D14] shadow-xs"
                  : "hover:text-[#0A0D14] dark:hover:text-white"
              }`}
              title="Thème sombre"
              aria-label="Thème sombre"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <span className="w-px h-3 bg-black/15 dark:bg-white/20 mx-0.5" />
            <span className="text-[11px] font-semibold text-[#0A0D14] dark:text-white px-1">FR</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 active:scale-95 text-[#0A0D14] dark:text-white flex items-center justify-center transition-all cursor-pointer border border-black/10 dark:border-white/15"
            aria-label="Fermer le menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Liste centrale des liens épurés et centrés façon America.gov */}
        <nav
          className="flex flex-col items-center gap-3.5 sm:gap-4 my-auto py-4"
          aria-label="Navigation du menu"
        >
          <Link
            href="/"
            onClick={onClose}
            className="font-sans text-xl sm:text-[22px] font-medium text-[#0A0D14] dark:text-white hover:opacity-80 transition-opacity"
          >
            Accueil
          </Link>

          <Link
            href="/chat"
            onClick={onClose}
            className="font-sans text-xl sm:text-[22px] font-medium text-[#0A0D14]/90 dark:text-white/90 hover:text-[#0A0D14] dark:hover:text-white transition-colors text-center"
          >
            Consulter l&apos;assistant
          </Link>

          <Link
            href="/faq"
            onClick={onClose}
            className="font-sans text-xl sm:text-[22px] font-medium text-[#0A0D14]/90 dark:text-white/90 hover:text-[#0A0D14] dark:hover:text-white transition-colors text-center"
          >
            Foire aux questions (FAQ)
          </Link>

          <Link
            href="/a-propos"
            onClick={onClose}
            className="font-sans text-xl sm:text-[22px] font-medium text-[#0A0D14]/90 dark:text-white/90 hover:text-[#0A0D14] dark:hover:text-white transition-colors text-center"
          >
            À propos &amp; Déontologie
          </Link>

          <Link
            href="/a-propos#confidentialite"
            onClick={onClose}
            className="font-sans text-xl sm:text-[22px] font-medium text-[#0A0D14]/90 dark:text-white/90 hover:text-[#0A0D14] dark:hover:text-white transition-colors text-center"
          >
            Protection de la vie privée (APDP)
          </Link>

          <Link
            href="/escalade"
            onClick={onClose}
            className="font-sans text-xl sm:text-[22px] font-medium text-[#0A0D14]/90 dark:text-white/90 hover:text-[#0A0D14] dark:hover:text-white transition-colors text-center"
          >
            Parler à un juriste
          </Link>

          {/* Câble direct WhatsApp */}
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "22900000000"}?text=Bonjour%20LexB%C3%A9nin`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-sans font-semibold bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xs transition-transform active:scale-95"
          >
            <span>Ouvrir sur WhatsApp</span>
          </a>
        </nav>

        {/* 3. Carte inférieure de réassurance avec drapeau béninois façon America.gov */}
        <div className="rounded-2xl bg-black/[0.04] dark:bg-white/[0.05] border border-black/10 dark:border-white/10 p-3.5 text-center flex flex-col items-center gap-1.5 w-full max-w-[260px] mx-auto mb-1">
          <BeninFlag className="h-3 w-4.5" />
          <div className="text-[11px] text-[#525866] dark:text-white/60 leading-tight">
            <span className="font-semibold text-[#0A0D14] dark:text-white/90 block text-xs">LexBénin</span>
            Guide citoyen indépendant
            <br />
            Code du numérique du Bénin
          </div>
        </div>
      </div>
    </div>
  );
}
