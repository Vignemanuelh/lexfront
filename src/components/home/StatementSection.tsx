"use client";

import React, { useState } from "react";
import { ArrowRight, ShieldCheck, Scale, Check } from "lucide-react";
import BeninFlag from "@/components/ui/BeninFlag";

const AGENCY_SEALS = [
  { id: "barreau", name: "Barreau du Bénin", badge: "⚖️ Barreau" },
  { id: "apdp", name: "APDP Données Personnelles", badge: "🛡️ APDP" },
  { id: "ocrc", name: "OCRC Cybercriminalité", badge: "🚨 OCRC" },
];

export default function StatementSection() {
  const [sealIndex, setSealIndex] = useState(0);
  const [isPrivacyClicked, setIsPrivacyClicked] = useState(false);

  const cycleSeal = () => {
    setSealIndex((prev) => (prev + 1) % AGENCY_SEALS.length);
  };

  const handlePrivacyClick = () => {
    setIsPrivacyClicked(true);
    setTimeout(() => setIsPrivacyClicked(false), 2000);
  };

  const currentSeal = AGENCY_SEALS[sealIndex];

  return (
    <section className="w-full max-w-4xl mx-auto px-6 py-20 text-center">
      <p className="font-editorial text-3xl sm:text-5xl md:text-[54px] leading-[1.22] tracking-[-0.025em] text-[#0A0D14] dark:text-white text-balance">
        LexBénin{" "}
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById("recherche");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          title="Poser une question"
          className="inline-flex items-center justify-center w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[#0F2942] hover:bg-[#001428] text-white text-base sm:text-xl align-middle mx-1 -mt-1 shadow-sm transition-transform hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>{" "}
        utilise l&apos;IA pour apporter des réponses simples issues uniquement des{" "}
        <button
          type="button"
          onClick={cycleSeal}
          title="Cliquez pour changer d'organisme officiel"
          className="inline-flex items-center gap-1.5 align-middle mx-1 px-3 py-1 rounded-full bg-white dark:bg-[#121620] border border-[#E5E7EB] dark:border-white/10 hover:border-[#0F2942]/40 text-sm sm:text-base font-sans font-medium text-[#0A0D14] dark:text-white shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <BeninFlag className="h-3.5 w-5" />
          <Scale className="w-4 h-4 text-[#0F2942] dark:text-amber-400" />
          <span className="font-semibold text-[#0F2942] dark:text-white">{currentSeal.badge}</span>
        </button>{" "}
        de la République du Bénin. C&apos;est gratuit, sans publicité, et{" "}
        <button
          type="button"
          onClick={handlePrivacyClick}
          title="En savoir plus sur la protection de la vie privée"
          className={`inline-flex items-center gap-1.5 align-middle mx-1 px-3 py-1 rounded-full border text-sm sm:text-base font-sans font-medium transition-all active:scale-95 cursor-pointer ${
            isPrivacyClicked
              ? "bg-emerald-100 border-emerald-400 text-emerald-900"
              : "bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46] hover:bg-emerald-100/60"
          }`}
        >
          {isPrivacyClicked ? (
            <>
              <Check className="w-4 h-4 text-emerald-700 animate-in zoom-in" />
              <span>Conforme APDP vérifié</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Vie privée protégée</span>
            </>
          )}
        </button>.
      </p>
    </section>
  );
}
