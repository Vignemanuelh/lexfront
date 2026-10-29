"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X, Laptop, Sun, Moon } from "lucide-react";
import BeninFlag from "@/components/ui/BeninFlag";

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuDrawer({ isOpen, onClose }: MenuDrawerProps) {
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
      className="fixed inset-0 z-50 flex justify-end items-center sm:items-stretch p-3 sm:p-6 bg-black/60 backdrop-blur-md transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Menu principal"
      onClick={onClose}
    >
      {/* Carte flottante sombre très arrondie fidèle à America.gov */}
      <div
        className="relative w-full max-w-[320px] sm:max-w-[340px] bg-[#0A0D14] text-white rounded-[32px] sm:rounded-[38px] border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.75)] p-6 sm:p-7 flex flex-col justify-between my-auto h-[min(94vh,760px)] animate-in slide-in-from-right-8 duration-300 ease-out select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. En-tête : sélecteur de mode/langue en pilule & bouton circulaire (X) */}
        <div className="flex items-center justify-between w-full pt-1">
          <div className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-2.5 py-1.5 border border-white/10 text-white/70">
            <button
              type="button"
              className="p-1 hover:text-white transition-colors cursor-pointer"
              title="Thème automatique"
              aria-label="Thème système"
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="p-1 hover:text-white transition-colors cursor-pointer"
              title="Thème clair"
              aria-label="Thème clair"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="p-1 hover:text-white transition-colors cursor-pointer"
              title="Thème sombre"
              aria-label="Thème sombre"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <span className="w-px h-3 bg-white/20 mx-0.5" />
            <span className="text-[11px] font-semibold text-white px-1">FR</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer border border-white/15"
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
            className="font-sans text-xl sm:text-[22px] font-medium text-white hover:text-white/80 transition-colors underline underline-offset-8 decoration-white/50"
          >
            Accueil
          </Link>

          <Link
            href="#comment-ca-marche"
            onClick={onClose}
            className="font-sans text-xl sm:text-[22px] font-medium text-white/90 hover:text-white transition-colors text-center"
          >
            Comment ça fonctionne
          </Link>

          <Link
            href="#confidentialite"
            onClick={onClose}
            className="font-sans text-xl sm:text-[22px] font-medium text-white/90 hover:text-white transition-colors text-center"
          >
            Protection de la vie privée (APDP)
          </Link>

          <Link
            href="#a-propos"
            onClick={onClose}
            className="font-sans text-xl sm:text-[22px] font-medium text-white/90 hover:text-white transition-colors text-center"
          >
            À propos & Déontologie
          </Link>

          <Link
            href="#roadmap"
            onClick={onClose}
            className="font-sans text-xl sm:text-[22px] font-medium text-white/90 hover:text-white transition-colors text-center"
          >
            Feuille de route
          </Link>

          <Link
            href="#faq"
            onClick={onClose}
            className="font-sans text-xl sm:text-[22px] font-medium text-white/90 hover:text-white transition-colors text-center"
          >
            Foire aux questions (FAQ)
          </Link>

          <Link
            href="#infraction"
            onClick={onClose}
            className="font-sans text-xl sm:text-[22px] font-medium text-white/90 hover:text-white transition-colors text-center"
          >
            Signaler une arnaque (OCRC)
          </Link>

          <Link
            href="#escalade"
            onClick={onClose}
            className="font-sans text-xl sm:text-[22px] font-medium text-white/90 hover:text-white transition-colors text-center"
          >
            Parler à un juriste
          </Link>
        </nav>

        {/* 3. Carte inférieure de réassurance avec drapeau béninois façon America.gov */}
        <div className="rounded-2xl bg-white/[0.05] border border-white/10 p-3.5 text-center flex flex-col items-center gap-1.5 w-full max-w-[260px] mx-auto mb-1">
          <BeninFlag className="h-3 w-4.5" />
          <div className="text-[11px] text-white/60 leading-tight">
            <span className="font-semibold text-white/90 block text-xs">LexBénin</span>
            Guide citoyen indépendant
            <br />
            Code du numérique du Bénin
          </div>
        </div>
      </div>
    </div>
  );
}
