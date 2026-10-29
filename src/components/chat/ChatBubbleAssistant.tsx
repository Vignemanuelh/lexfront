"use client";

import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, Copy, Check, Volume2, VolumeX, ArrowRight, Scale } from "lucide-react";
import Link from "next/link";
import { LegalQuestionResponse } from "@/lib/types";
import VerdictBadge from "@/components/ui/VerdictBadge";
import LawArticleBox from "@/components/ui/LawArticleBox";

export interface ChatBubbleAssistantProps {
  content: string;
  legalResponse?: LegalQuestionResponse;
}

/**
 * ChatBubbleAssistant — Réponse textuelle épurée calquée sur America.gov avec les enrichissements juridiques LexBénin.
 */
export default function ChatBubbleAssistant({
  content,
  legalResponse,
}: ChatBubbleAssistantProps) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleCopy = async () => {
    try {
      const textToCopy = legalResponse
        ? `${legalResponse.explication_vulgarisee}\n\nArticles cités : ${legalResponse.articles_cites.join(", ")}\n\nConseil pratique : ${legalResponse.conseil_pratique}`
        : content;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const toggleSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = legalResponse?.explication_vulgarisee || content;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = "fr-FR";
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  return (
    <div
      data-testid="chat-bubble-assistant"
      className="w-full flex flex-col items-start mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      {/* 1. Badge de qualification juridique si présent */}
      {legalResponse && (
        <div className="mb-3">
          <VerdictBadge status={legalResponse.statut_legal} />
        </div>
      )}

      {/* 2. Texte de vulgarisation épuré façon America.gov */}
      <div className="text-[#0A0D14] dark:text-white text-base sm:text-lg leading-relaxed max-w-2xl text-left">
        {content}
      </div>

      {/* 3. Encadré d'article officiel si disponible */}
      {legalResponse && legalResponse.articles_cites && legalResponse.articles_cites.length > 0 && (
        <div className="w-full max-w-2xl mt-4">
          <LawArticleBox
            articleNumber={legalResponse.articles_cites[0]}
            articleText={legalResponse.conseil_pratique || "Conformité stricte aux dispositions du Code du numérique béninois."}
          />
        </div>
      )}

      {/* 4. Conseil pratique & orientation vers juriste si escalade nécessaire */}
      {legalResponse?.necessite_escalade && (
        <div className="w-full max-w-2xl mt-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
            <span>Cette question relève d&apos;une zone d&apos;ambiguïté juridique nécessitant un avis d&apos;avocat.</span>
          </div>
          <Link
            href="/escalade"
            className="inline-flex items-center gap-1.5 font-semibold text-[#0F2942] dark:text-amber-300 hover:underline shrink-0"
          >
            <span>Parler à un juriste</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 5. Barre d'actions sous la réponse (exactement calquée sur America.gov) */}
      <div className="flex items-center gap-1.5 sm:gap-2 mt-4 select-none">
        {/* Pouce haut */}
        <button
          type="button"
          onClick={() => setFeedback(feedback === "up" ? null : "up")}
          title="Réponse utile"
          aria-label="Réponse utile"
          className={`p-2 rounded-full border transition-all ${
            feedback === "up"
              ? "bg-[#0F2942] text-white dark:bg-[#0066C5] border-transparent"
              : "bg-white/80 dark:bg-white/5 text-[#525866] dark:text-white/70 border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
          }`}
        >
          <ThumbsUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* Pouce bas */}
        <button
          type="button"
          onClick={() => setFeedback(feedback === "down" ? null : "down")}
          title="Réponse peu claire ou inexacte"
          aria-label="Réponse peu claire"
          className={`p-2 rounded-full border transition-all ${
            feedback === "down"
              ? "bg-red-600 text-white border-transparent"
              : "bg-white/80 dark:bg-white/5 text-[#525866] dark:text-white/70 border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
          }`}
        >
          <ThumbsDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* Copier */}
        <button
          type="button"
          onClick={handleCopy}
          title="Copier la réponse"
          aria-label="Copier la réponse"
          className="p-2 rounded-full border bg-white/80 dark:bg-white/5 text-[#525866] dark:text-white/70 border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          )}
        </button>

        {/* Écouter la réponse vocale */}
        <button
          type="button"
          onClick={toggleSpeech}
          title={isPlayingAudio ? "Arrêter la lecture" : "Écouter la réponse"}
          aria-label={isPlayingAudio ? "Arrêter la lecture" : "Écouter la réponse"}
          className={`p-2 rounded-full border transition-all ${
            isPlayingAudio
              ? "bg-[#0F2942] text-white dark:bg-[#0066C5] border-transparent animate-pulse"
              : "bg-white/80 dark:bg-white/5 text-[#525866] dark:text-white/70 border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
          }`}
        >
          {isPlayingAudio ? (
            <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
