"use client";

import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, Copy, Check, Volume2, VolumeX, ArrowRight, Scale } from "lucide-react";
import Link from "next/link";
import { LegalQuestionResponse } from "@/lib/types";
import { submitFeedback } from "@/lib/api";
import VerdictBadge from "@/components/ui/VerdictBadge";
import LawArticleBox from "@/components/ui/LawArticleBox";

export interface ChatBubbleAssistantProps {
  content: string;
  userQuestion?: string;
  legalResponse?: LegalQuestionResponse;
}

/**
 * ChatBubbleAssistant — Réponse textuelle épurée calquée sur America.gov avec les enrichissements juridiques LexBénin.
 */
export default function ChatBubbleAssistant({
  content,
  userQuestion,
  legalResponse,
}: ChatBubbleAssistantProps) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleFeedback = async (type: "up" | "down") => {
    if (feedback === type) {
      setFeedback(null);
      setFeedbackMessage(null);
      return;
    }
    setFeedback(type);
    setFeedbackMessage(type === "up" ? "Merci pour votre évaluation !" : "Signalement pris en compte.");
    setTimeout(() => setFeedbackMessage(null), 3000);

    if (legalResponse?.interaction_id) {
      try {
        await submitFeedback({
          interaction_id: legalResponse.interaction_id,
          rating: type === "up" ? 1 : -1,
        });
      } catch {
        // Ignorer silencieusement
      }
    }
  };

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

  const cleanedExtracted =
    legalResponse?.extracted_content &&
    legalResponse.extracted_content.trim().length > 5 &&
    !/^\d{2}:\d{2}$/.test(legalResponse.extracted_content.trim())
      ? legalResponse.extracted_content.trim()
      : "";

  const escalationQuery = (
    userQuestion?.trim() ||
    cleanedExtracted ||
    "Demande d'assistance juridique depuis le chat LexBénin"
  ).slice(0, 140);

  const primaryArticle = legalResponse?.articles_cites?.[0];
  const normalizeRef = (val: string) => val.toLowerCase().replace(/[^a-z0-9]/g, "");
  const matchedSource =
    primaryArticle && legalResponse?.sources && legalResponse.sources.length > 0
      ? legalResponse.sources.find((src) => {
          const target = normalizeRef(primaryArticle);
          const candidate = normalizeRef(src.article_number);
          return candidate.includes(target) || target.includes(candidate);
        }) || legalResponse.sources[0]
      : undefined;

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
        <div className="w-full max-w-2xl mt-4 flex flex-col gap-2">
          <LawArticleBox
            articleNumber={legalResponse.articles_cites[0]}
            lawTitle={matchedSource?.structure_title || undefined}
            articleText={
              matchedSource?.content ||
              "Dispositions officielles applicables du Code du numérique (Loi N° 2017-20 modifiée)."
            }
          />
          {legalResponse.articles_cites.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs text-[#525866] dark:text-white/50">
                Autres articles cités :
              </span>
              {legalResponse.articles_cites.slice(1).map((art) => (
                <span
                  key={art}
                  className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#F7F7F5] dark:bg-[#14171D] border border-[#E5E7EB] dark:border-white/10 text-[#0F2942] dark:text-white/80"
                >
                  {art}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3.bis Conseil pratique explicite (toujours affiché, y compris pour les zones grises sans article) */}
      {legalResponse?.conseil_pratique && (
        <div
          data-testid="practical-advice"
          className="w-full max-w-2xl mt-3 px-4 py-3 rounded-2xl bg-[#F7F7F5] dark:bg-[#14171D] border border-[#E5E7EB] dark:border-white/10 text-xs sm:text-sm text-[#0A0D14] dark:text-white/90 leading-relaxed text-left"
        >
          <span className="font-semibold text-[#0F2942] dark:text-[#58A6FF] mr-1.5">
            Conseil pratique :
          </span>
          <span>{legalResponse.conseil_pratique}</span>
        </div>
      )}

      {/* 4. Orientation vers juriste si escalade nécessaire */}
      {legalResponse?.necessite_escalade && (
        <div className="w-full max-w-2xl mt-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
            <span>Cette question relève d&apos;une zone d&apos;ambiguïté juridique nécessitant un avis d&apos;avocat.</span>
          </div>
          <Link
            href={`/escalade?interaction_id=${encodeURIComponent(legalResponse?.interaction_id || "")}&q=${encodeURIComponent(escalationQuery)}`}
            className="inline-flex items-center gap-1.5 font-semibold text-[#0F2942] dark:text-amber-300 hover:underline shrink-0"
          >
            <span>Parler à un juriste</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 5. Avertissement légal obligatoire (RG-JUR6 / RG-DESIGN7) */}
      {legalResponse?.avertissement_legal && (
        <p
          data-testid="legal-disclaimer"
          className="mt-3 text-xs italic text-[#525866] dark:text-white/50 max-w-2xl text-left"
        >
          {legalResponse.avertissement_legal}
        </p>
      )}

      {/* 5. Barre d'actions sous la réponse (exactement calquée sur America.gov) */}
      <div className="flex items-center gap-1.5 sm:gap-2 mt-4 select-none">
        {/* Pouce haut */}
        <button
          type="button"
          onClick={() => handleFeedback("up")}
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
          onClick={() => handleFeedback("down")}
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

        {feedbackMessage && (
          <span className="text-xs font-sans text-[#525866] dark:text-white/70 animate-in fade-in pl-1">
            {feedbackMessage}
          </span>
        )}

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
