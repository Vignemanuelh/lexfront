"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
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
      className="fixed inset-0 z-50 flex justify-end items-stretch p-3 sm:p-5 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Menu principal"
      onClick={onClose}
    >
      {/* Carte flottante sombre arrondie façon America.gov */}
      <div
        className="relative w-full max-w-[340px] sm:max-w-[360px] bg-[#0A0D14] text-white rounded-[32px] sm:rounded-[36px] border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.65)] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right-8 duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. En-tête de la carte : sélecteur de langue & bouton fermer circulaire */}
        <div className="flex items-center justify-between pb-4">
          <div className="inline-flex items-center gap-1 bg-white/10 rounded-full p-1 border border-white/10">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white text-[#0A0D14]">
              FR
            </span>
            <button
              type="button"
              className="text-xs font-medium px-2 py-1 rounded-full text-white/70 hover:text-white transition-colors"
              title="Langue Fɔngbe (Bientôt disponible)"
            >
              Fɔn
            </button>
            <button
              type="button"
              className="text-xs font-medium px-2 py-1 rounded-full text-white/70 hover:text-white transition-colors"
              title="Langue Yorùbá (Bientôt disponible)"
            >
              Yor
            </button>
            <button
              type="button"
              className="text-xs font-medium px-2 py-1 rounded-full text-white/70 hover:text-white transition-colors"
              title="English"
            >
              EN
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
            aria-label="Fermer le menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Liste centrale des liens épurés et centrés façon America.gov */}
        <nav
          className="flex flex-col items-center gap-4 sm:gap-5 my-auto py-6"
          aria-label="Navigation du menu"
        >
          <Link
            href="/"
            onClick={onClose}
            className="font-sans text-base sm:text-lg font-medium text-white hover:text-white/80 transition-colors underline underline-offset-8 decoration-white/40"
          >
            Accueil
          </Link>

          <Link
            href="#comment-ca-marche"
            onClick={onClose}
            className="font-sans text-base sm:text-lg font-medium text-white/80 hover:text-white transition-colors"
          >
            Comment ça fonctionne
          </Link>

          <Link
            href="#confidentialite"
            onClick={onClose}
            className="font-sans text-base sm:text-lg font-medium text-white/80 hover:text-white transition-colors"
          >
            Protection de la vie privée (APDP)
          </Link>

          <Link
            href="#a-propos"
            onClick={onClose}
            className="font-sans text-base sm:text-lg font-medium text-white/80 hover:text-white transition-colors"
          >
            À propos & Déontologie
          </Link>

          <Link
            href="#roadmap"
            onClick={onClose}
            className="font-sans text-base sm:text-lg font-medium text-white/80 hover:text-white transition-colors"
          >
            Feuille de route 2026
          </Link>

          <Link
            href="#faq"
            onClick={onClose}
            className="font-sans text-base sm:text-lg font-medium text-white/80 hover:text-white transition-colors"
          >
            Foire aux questions (FAQ)
          </Link>

          <Link
            href="#infraction"
            onClick={onClose}
            className="font-sans text-base sm:text-lg font-medium text-[#FF6B6B] hover:text-[#FF8787] transition-colors"
          >
            Signaler une arnaque (OCRC)
          </Link>

          <Link
            href="#escalade"
            onClick={onClose}
            className="font-sans text-base sm:text-lg font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Parler à un juriste référent
          </Link>
        </nav>

        {/* 3. Carte inférieure de réassurance avec drapeau béninois */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-center flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2 mb-0.5">
            <BeninFlag className="h-3.5 w-5" />
            <span className="text-xs font-semibold tracking-wide text-white">
              LexBénin
            </span>
          </div>

          <p className="text-[11px] text-white/65 leading-snug">
            Assistant citoyen indépendant sur le Code du numérique du Bénin.
          </p>

          <span className="text-[10px] font-medium text-emerald-400/90 pt-1">
            Vie privée protégée • Gratuit & sans publicité
          </span>
        </div>
      </div>
    </div>
  );
}
