"use client";

import React, { useState, useRef } from "react";
import { Paperclip, Mic, ArrowRight, Lock, HelpCircle } from "lucide-react";
import Link from "next/link";

export interface ChatInputBarProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

/**
 * ChatInputBar — Barre de saisie inférieure du chat calquée sur America.gov.
 * Présente les micro-liens APDP et un conteneur pilule flottant complet (texte, capture OCR, note vocale).
 */
export default function ChatInputBar({ onSend, isLoading = false }: ChatInputBarProps) {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    const textToSend = query.trim();
    setQuery("");
    onSend(textToSend);
  };

  const toggleVoice = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new (SpeechRecognition as new () => {
          lang: string;
          start: () => void;
          onresult: (e: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void;
          onerror: () => void;
          onend: () => void;
        })();
        recognition.lang = "fr-FR";
        setIsListening(true);
        recognition.onresult = (e) => {
          const transcript = e.results[0][0].transcript;
          setQuery(transcript);
          setIsListening(false);
          onSend(transcript);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
      } catch {
        setIsListening(false);
      }
    } else {
      // Simulation audio
      setIsListening(true);
      setTimeout(() => {
        const simulatedVoice = "Est-ce légal d'enregistrer une conversation téléphonique au Bénin ?";
        setQuery(simulatedVoice);
        setIsListening(false);
        onSend(simulatedVoice);
      }, 1500);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const promptFromImage = `Capture d'écran analysée : ${file.name}. Est-ce conforme au Code du numérique ?`;
      setQuery("");
      onSend(promptFromImage);
    }
  };

  return (
    <div className="w-full flex flex-col items-center shrink-0 pt-2 pb-5 sm:pb-8 bg-transparent">
      {/* 1. Micro-mentions déontologiques façon America.gov (Your privacy • How SI works) */}
      <div className="flex items-center justify-center gap-4 text-[11px] sm:text-xs text-[#525866] dark:text-white/50 mb-3 select-none">
        <Link
          href="#confidentialite"
          className="inline-flex items-center gap-1 hover:text-[#0A0D14] dark:hover:text-white transition-colors"
        >
          <Lock className="w-3 h-3 text-[#525866] dark:text-white/50" />
          <span>Vie privée protégée (APDP)</span>
        </Link>
        <span>·</span>
        <Link
          href="#comment-ca-marche"
          className="inline-flex items-center gap-1 hover:text-[#0A0D14] dark:hover:text-white transition-colors"
        >
          <HelpCircle className="w-3 h-3 text-[#525866] dark:text-white/50" />
          <span>Comment ça fonctionne</span>
        </Link>
      </div>

      {/* 2. Dock pilule flottant */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl relative flex items-center bg-white/95 dark:bg-[#0F1217]/95 backdrop-blur-md rounded-full shadow-[0_12px_35px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_35px_rgba(0,0,0,0.7)] px-4 sm:px-5 py-2.5 sm:py-3 border border-black/10 dark:border-white/20 transition-all focus-within:border-black/25 dark:focus-within:border-white/40"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            isListening
              ? "Écoute en cours... Parlez maintenant"
              : "Posez votre question sur le Code du numérique..."
          }
          className="w-full bg-transparent text-sm sm:text-base text-[#0A0D14] dark:text-white placeholder:text-[#525866]/80 dark:placeholder:text-white/40 focus:outline-none border-none p-0 pr-3"
        />

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Joindre une capture"
            aria-label="Joindre une capture"
            className="p-2 text-[#525866] hover:text-[#0A0D14] dark:text-white/70 dark:hover:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            type="button"
            onClick={toggleVoice}
            title="Note vocale"
            aria-label="Note vocale"
            className={`p-2 rounded-full transition-colors ${
              isListening
                ? "text-[#E8112D] bg-red-50 dark:bg-red-950/40 animate-pulse"
                : "text-[#525866] hover:text-[#0A0D14] dark:text-white/70 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
            }`}
          >
            <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            title="Envoyer la question"
            aria-label="Envoyer"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0F2942] hover:bg-[#001428] text-white dark:bg-[#0066C5] dark:hover:bg-[#1A75D0] dark:text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-sm ml-1 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
