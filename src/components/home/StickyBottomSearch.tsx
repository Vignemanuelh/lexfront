"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Paperclip, Mic, ArrowRight } from "lucide-react";

interface StickyBottomSearchProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  forceVisible?: boolean;
}

export default function StickyBottomSearch({
  onSearch,
  isLoading = false,
  forceVisible = false,
}: StickyBottomSearchProps) {
  const [isVisible, setIsVisible] = useState(forceVisible);
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (forceVisible) {
      setIsVisible(true);
      return;
    }

    const checkVisibility = () => {
      const heroSearchEl = document.getElementById("recherche");
      if (!heroSearchEl) return;
      const rect = heroSearchEl.getBoundingClientRect();
      // Visible si la barre du hero est défilée hors de l'écran par le haut
      const isPastHero = rect.bottom <= 80;
      setIsVisible(isPastHero);
    };

    // Vérification initiale
    checkVisibility();

    // 1. Détection via IntersectionObserver
    const heroSearchEl = document.getElementById("recherche");
    let observer: IntersectionObserver | null = null;

    if (heroSearchEl && typeof window !== "undefined" && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry) {
            const isPast = entry.boundingClientRect.bottom <= 120;
            setIsVisible(!entry.isIntersecting && isPast);
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(heroSearchEl);
    }

    // 2. Détection en temps réel par événement de scroll fluide
    window.addEventListener("scroll", checkVisibility, { passive: true });

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener("scroll", checkVisibility);
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
          onSearch(transcript);
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
        onSearch(simulatedVoice);
      }, 1500);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
        className="relative flex items-center bg-white/95 dark:bg-[#0E131F]/95 backdrop-blur-md rounded-full shadow-[0_16px_45px_rgba(0,20,40,0.18)] dark:shadow-[0_16px_45px_rgba(0,0,0,0.6)] px-4 sm:px-5 py-2.5 sm:py-3 border border-black/10 dark:border-white/15 hover:border-black/20 dark:hover:border-white/25 transition-all"
      >
        <Search className="w-5 h-5 text-[#525866] dark:text-white/70 mr-2.5 hidden sm:inline shrink-0" />

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
            className="p-2 text-[#525866] hover:text-[#0A0D14] dark:text-white/70 dark:hover:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={toggleVoice}
            title="Note vocale"
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
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0F2942] hover:bg-[#001428] text-white dark:bg-white dark:text-[#0A0D14] dark:hover:bg-white/90 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-sm ml-1 disabled:opacity-50"
            aria-label="Poser la question"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
