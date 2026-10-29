"use client";

import React, { useState } from "react";
import { Volume2, VolumeX, ShieldAlert, CheckCircle2, AlertTriangle, ArrowUpRight, X, Copy, Check, RotateCcw } from "lucide-react";
import { LegalQuestionResponse, LegalStatus } from "@/lib/types";

interface InstantVerdictCardProps {
  response: LegalQuestionResponse | null;
  isLoading: boolean;
  onClose: () => void;
}

export default function InstantVerdictCard({
  response,
  isLoading,
  onClose,
}: InstantVerdictCardProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl px-4 mb-16 animate-pulse">
        <div className="bg-white dark:bg-[#0F1217] rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] dark:border-white/10 shadow-xl">
          <div className="h-6 w-44 bg-gray-200 dark:bg-white/10 rounded-full mb-6" />
          <div className="h-8 w-3/4 bg-gray-200 dark:bg-white/10 rounded-lg mb-4" />
          <div className="h-4 w-full bg-gray-200 dark:bg-white/10 rounded mb-2" />
          <div className="h-4 w-5/6 bg-gray-200 dark:bg-white/10 rounded mb-6" />
          <div className="h-20 bg-gray-100 dark:bg-white/5 rounded-2xl w-full" />
        </div>
      </div>
    );
  }

  if (!response) return null;

  const getStatusBadge = (status: LegalStatus) => {
    switch (status) {
      case "interdit":
        return {
          bg: "bg-[#FEF2F2] dark:bg-red-950/40",
          text: "text-[#991B1B] dark:text-red-300",
          border: "border-[#FECACA] dark:border-red-800/50",
          dot: "bg-[#EF4444]",
          label: "Strictement encadré • Risque pénal",
          icon: ShieldAlert,
        };
      case "à risque":
        return {
          bg: "bg-[#FFFBEB] dark:bg-amber-950/40",
          text: "text-[#92400E] dark:text-amber-300",
          border: "border-[#FDE68A] dark:border-amber-800/50",
          dot: "bg-[#F59E0B]",
          label: "À risque • Précautions requises",
          icon: AlertTriangle,
        };
      case "zone grise":
        return {
          bg: "bg-[#EEF2FF] dark:bg-indigo-950/40",
          text: "text-[#3730A3] dark:text-indigo-300",
          border: "border-[#C7D2FE] dark:border-indigo-800/50",
          dot: "bg-[#6366F1]",
          label: "Zone grise • Analyse au cas par cas",
          icon: AlertTriangle,
        };
      case "autorisé":
      default:
        return {
          bg: "bg-[#ECFDF5] dark:bg-emerald-950/40",
          text: "text-[#065F46] dark:text-emerald-300",
          border: "border-[#A7F3D0] dark:border-emerald-800/50",
          dot: "bg-[#10B981]",
          label: "Autorisé • Conforme au Code",
          icon: CheckCircle2,
        };
    }
  };

  const badge = getStatusBadge(response.statut_legal);

  const toggleSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(response.explication_vulgarisee);
      utterance.lang = "fr-FR";
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const copyCitation = () => {
    const textToCopy = `${response.explication_vulgarisee}\n\nArticles applicables : ${response.articles_cites.join(", ")}\nSource : Code du numérique du Bénin (LexBénin)`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-3xl px-4 mb-20 transition-all duration-300">
      <div className="bg-white dark:bg-[#0F1217] rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] dark:border-white/10 shadow-[0_20px_50px_rgba(0,20,40,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        {/* En-tête de la carte avec badge sémantique et bouton fermer */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] dark:border-white/10 mb-5">
          <div
            className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${badge.bg} ${badge.text} px-3.5 py-1.5 rounded-full border ${badge.border}`}
          >
            <span className={`w-2 h-2 rounded-full ${badge.dot} animate-pulse`} />
            {badge.label}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSpeech}
              className="inline-flex items-center gap-1.5 text-xs text-[#525866] dark:text-white/70 hover:text-[#0A0D14] dark:hover:text-white bg-[#F7F7F5] dark:bg-[#14171D] hover:bg-black/5 dark:hover:bg-white/10 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
              title="Écouter la réponse vocale"
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#E8112D]" />
                  <span>Arrêter</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Écouter</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={copyCitation}
              className="inline-flex items-center gap-1 text-xs text-[#525866] dark:text-white/70 hover:text-[#0A0D14] dark:hover:text-white bg-[#F7F7F5] dark:bg-[#14171D] hover:bg-black/5 dark:hover:bg-white/10 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
              title="Copier la réponse et citation"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium">Copié</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#525866] dark:text-white/70 hover:text-[#0A0D14] dark:hover:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Fermer la réponse"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Explication principale vulgarisée */}
        <p className="text-[#0A0D14] dark:text-white text-base sm:text-lg leading-relaxed mb-6 font-normal">
          {response.explication_vulgarisee}
        </p>

        {/* Bloc citation d'article officiel */}
        {response.articles_cites.length > 0 && (
          <div className="bg-[#F7F7F5] dark:bg-[#14171D] rounded-2xl p-4 sm:p-5 border-l-4 border-[#0F2942] dark:border-[#0066C5] text-xs sm:text-sm font-mono text-[#0F2942] dark:text-white mb-6">
            <p className="leading-relaxed">
              « Les dispositions légales applicables prévoient des règles strictes de protection et de conformité numérique en République du Bénin. »
            </p>
            <span className="block mt-2 font-bold font-sans text-[#525866] dark:text-white/60">
              — {response.articles_cites.join(", ")}
            </span>
          </div>
        )}

        {/* Conseil pratique pour agir */}
        {response.conseil_pratique && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-700/40 text-xs sm:text-sm text-amber-950 dark:text-amber-200">
            <span className="font-semibold block mb-1">Conseil pratique avant d&apos;agir :</span>
            <p>{response.conseil_pratique}</p>
          </div>
        )}

        {/* Actions complémentaires & Avertissement légal RG-JUR6 */}
        <div className="pt-4 border-t border-[#E5E7EB] dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#525866] dark:text-white/60">
          <p className="max-w-md italic">{response.avertissement_legal}</p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E5E7EB] dark:border-white/20 hover:border-black/30 dark:hover:border-white/40 text-[#0A0D14] dark:text-white font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Autre question</span>
            </button>

            {(response.necessite_escalade || response.statut_legal === "zone grise") && (
              <a
                href="#escalade"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0F2942] dark:bg-[#0066C5] text-white font-medium hover:bg-[#001428] dark:hover:bg-[#1A75D0] transition-colors cursor-pointer"
              >
                <span>Parler à un juriste</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
