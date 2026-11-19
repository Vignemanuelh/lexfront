"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, Paperclip, Mic, ArrowRight } from "lucide-react";
import { useVoiceRecognition } from "@/lib/useVoiceRecognition";

interface StickyBottomSearchProps {
  onSearch: (query: string) => void;
  onMediaSearch?: (file: File, prompt: string) => void;
  isLoading?: boolean;
  forceVisible?: boolean;
}

export default function StickyBottomSearch({
  onSearch,
  onMediaSearch,
  isLoading = false,
  forceVisible = false,
}: StickyBottomSearchProps) {
  const [isVisible, setIsVisible] = useState(forceVisible);
  const [query, setQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVoiceTranscript = useCallback(
    (transcript: string) => {
      setQuery(transcript);
      onSearch(transcript);
    },
    [onSearch]
  );

  const { isListening, toggleVoice } = useVoiceRecognition({
    onTranscript: handleVoiceTranscript,
  });

  useEffect(() => {
    if (forceVisible) {
      setIsVisible(true);
      return;
    }

    const checkVisibility = () => {
      const heroForm =
        document.getElementById("hero-search-form") || document.getElementById("recherche");
      if (!heroForm) {
        setIsVisible(window.scrollY > 180);
        return;
      }

      const rect = heroForm.getBoundingClientRect();
      // Reste visible de la sortie du champ héro jusqu'en bas de page (protégé par pb-24 sm:pb-28 du Footer)
      const isPastHero = rect.bottom <= 0 || window.scrollY > 180;
      setIsVisible(isPastHero);
    };

    checkVisibility();

    window.addEventListener("scroll", checkVisibility, { passive: true });
    window.addEventListener("resize", checkVisibility, { passive: true });

    return () => {
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
    };
  }, [forceVisible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const textToSubmit = query.trim();
    onSearch(textToSubmit);

    // Défilement doux vers la section résultat
    const resultEl = document.getElementById("resultat");
    if (resultEl) {
      resultEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (onMediaSearch) {
        onMediaSearch(file, query.trim());
        e.target.value = "";
        return;
      }
      const promptFromImage = `Capture d'écran analysée : ${file.name}. Est-ce conforme au Code du numérique ?`;
      setQuery(promptFromImage);
      onSearch(promptFromImage);
    }
  };

  return (
    <div
      data-testid="sticky-bottom-search"
      className={`fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-[92%] sm:w-[88%] max-w-2xl z-40 transition-all duration-300 ease-out transform ${
        isVisible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-20 opacity-0 pointer-events-none"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center bg-white/95 dark:bg-[#0B0D12]/95 backdrop-blur-md rounded-full shadow-[0_16px_45px_rgba(0,20,40,0.18)] dark:shadow-[0_16px_45px_rgba(0,0,0,0.7)] px-4 sm:px-5 py-2.5 sm:py-3 border border-black/10 dark:border-white/20 hover:border-black/20 dark:hover:border-white/30 transition-all"
      >
        <Search className="w-5 h-5 text-[#525866] dark:text-white/70 mr-2.5 hidden sm:inline shrink-0" />

        <input
          id="sticky-search-input"
          name="sticky_query"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Posez votre question sur le Code du numérique"
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
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            aria-label="Sélectionner une capture d'écran"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Joindre une capture"
            aria-label="Joindre une capture"
            className="p-2 text-[#525866] hover:text-[#0A0D14] dark:text-white/70 dark:hover:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <Paperclip className="w-5 h-5" />
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
            <Mic className="w-5 h-5" />
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0F2942] hover:bg-[#001428] text-white dark:bg-[#0066C5] dark:hover:bg-[#1A75D0] dark:text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-sm ml-1 disabled:opacity-50"
            aria-label="Poser la question"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
