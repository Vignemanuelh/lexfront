"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X, ArrowRight, ShieldCheck, Scale, ExternalLink } from "lucide-react";

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuDrawer({ isOpen, onClose }: MenuDrawerProps) {
  // Verrouillage du scroll quand le tiroir est ouvert
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
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Menu principal">
      {/* Arrière-plan flouté */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Conteneur coulissant du tiroir */}
      <div className="relative w-full sm:max-w-md md:max-w-lg bg-white h-full z-10 shadow-2xl p-6 sm:p-10 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300 ease-out">
        <div>
          {/* En-tête du tiroir avec sélecteur de langue et bouton fermer */}
          <div className="flex items-center justify-between pb-6 border-b border-[#E5E7EB] mb-8">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#0F2942] text-white">
                FR
              </span>
              <button
                type="button"
                className="text-xs font-medium px-2.5 py-1 rounded-full text-[#525866] hover:bg-black/5 transition-colors"
                title="Langue Fon (Bientôt)"
              >
                Fɔngbe
              </button>
              <button
                type="button"
                className="text-xs font-medium px-2.5 py-1 rounded-full text-[#525866] hover:bg-black/5 transition-colors"
                title="Langue Yorùbá (Bientôt)"
              >
                Yorùbá
              </button>
              <button
                type="button"
                className="text-xs font-medium px-2.5 py-1 rounded-full text-[#525866] hover:bg-black/5 transition-colors"
                title="English"
              >
                EN
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#525866] hover:text-[#0A0D14] hover:bg-black/5 rounded-full transition-colors"
              aria-label="Fermer le menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation éditoriale monumentale */}
          <nav className="flex flex-col gap-5 sm:gap-6" aria-label="Navigation du menu">
            <Link
              href="#recherche"
              onClick={onClose}
              className="font-editorial text-3xl sm:text-4xl text-[#0A0D14] hover:text-[#0F2942] transition-colors flex items-center justify-between group"
            >
              <span>Poser une question</span>
              <ArrowRight className="w-5 h-5 text-[#525866] group-hover:translate-x-1 group-hover:text-[#0F2942] transition-all" />
            </Link>

            <Link
              href="#comment-ca-marche"
              onClick={onClose}
              className="font-editorial text-3xl sm:text-4xl text-[#0A0D14] hover:text-[#0F2942] transition-colors flex items-center justify-between group"
            >
              <span>Comment ça fonctionne</span>
              <ArrowRight className="w-5 h-5 text-[#525866] group-hover:translate-x-1 group-hover:text-[#0F2942] transition-all" />
            </Link>

            <Link
              href="#confidentialite"
              onClick={onClose}
              className="font-editorial text-3xl sm:text-4xl text-[#0A0D14] hover:text-[#0F2942] transition-colors flex items-center justify-between group"
            >
              <span>Protection de la vie privée (APDP)</span>
              <ArrowRight className="w-5 h-5 text-[#525866] group-hover:translate-x-1 group-hover:text-[#0F2942] transition-all" />
            </Link>

            <Link
              href="#roadmap"
              onClick={onClose}
              className="font-editorial text-3xl sm:text-4xl text-[#0A0D14] hover:text-[#0F2942] transition-colors flex items-center justify-between group"
            >
              <span>Feuille de route 2026</span>
              <ArrowRight className="w-5 h-5 text-[#525866] group-hover:translate-x-1 group-hover:text-[#0F2942] transition-all" />
            </Link>

            <Link
              href="#faq"
              onClick={onClose}
              className="font-editorial text-3xl sm:text-4xl text-[#0A0D14] hover:text-[#0F2942] transition-colors flex items-center justify-between group"
            >
              <span>Foire aux questions (FAQ)</span>
              <ArrowRight className="w-5 h-5 text-[#525866] group-hover:translate-x-1 group-hover:text-[#0F2942] transition-all" />
            </Link>

            <Link
              href="#infraction"
              onClick={onClose}
              className="font-editorial text-3xl sm:text-4xl text-[#E8112D] hover:text-red-700 transition-colors flex items-center justify-between group"
            >
              <span>Signaler une arnaque / cyber-infraction</span>
              <ExternalLink className="w-5 h-5 text-[#E8112D] group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="#escalade"
              onClick={onClose}
              className="font-editorial text-3xl sm:text-4xl text-[#0F2942] hover:underline transition-colors flex items-center justify-between group"
            >
              <span>Parler à un juriste référent</span>
              <ArrowRight className="w-5 h-5 text-[#0F2942] group-hover:translate-x-1 transition-all" />
            </Link>
          </nav>
        </div>

        {/* Pied du tiroir avec réassurance républicaine */}
        <div className="pt-8 border-t border-[#E5E7EB] mt-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center h-4 w-6 overflow-hidden rounded-[2px] border border-black/10">
              <span className="w-1/3 h-full bg-[#008751]" />
              <span className="w-1/3 h-full bg-[#FCD116]" />
              <span className="w-1/3 h-full bg-[#E8112D]" />
            </span>
            <span className="text-xs font-semibold text-[#0A0D14]">
              République du Bénin
            </span>
          </div>

          <p className="text-xs text-[#525866] leading-relaxed mb-4">
            Service d&apos;intérêt général pour les citoyens béninois, en partenariat avec le Barreau du Bénin. Conforme à la Loi N° 2017-20 modifiée du Code du numérique.
          </p>

          <div className="flex items-center gap-4 text-xs font-medium text-[#0F2942]">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#008751]" />
              <span>Données confidentielles</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Scale className="w-3.5 h-3.5" />
              <span>Sources officielles</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
