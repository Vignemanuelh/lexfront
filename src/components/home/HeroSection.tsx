"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Paperclip, Mic, ArrowRight, ChevronLeft, ChevronRight, Pause } from "lucide-react";

interface HeroSectionProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export default function HeroSection({ onSearch, isLoading = false }: HeroSectionProps) {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      // Simulation ou support Web Speech API
      if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const SpeechRecognition = (window as any).webkitSpeechRecognition;
          const recognition = new SpeechRecognition();
          recognition.lang = "fr-FR";
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setQuery(transcript);
            setIsListening(false);
            onSearch(transcript);
          };
          recognition.onerror = () => setIsListening(false);
          recognition.start();
          return;
        } catch {
          // Fallback simulation
        }
      }

      // Fallback après 2 secondes si reconnaissance vocale non supportée
      setTimeout(() => {
        const simulatedVoice = "Puis-je diffuser une capture d'écran sans consentement au Bénin ?";
        setQuery(simulatedVoice);
        setIsListening(false);
        onSearch(simulatedVoice);
      }, 1800);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const promptFromImage = `Capture d'écran analysée : ${file.name}. Est-ce légal selon le Code du numérique ?`;
      setQuery(promptFromImage);
      onSearch(promptFromImage);
    }
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 pt-10 pb-16 flex flex-col items-center text-center">
      {/* 1. Titre monumental façon America.gov */}
      <h1 className="font-editorial text-6xl sm:text-7xl md:text-8xl font-normal text-[#0A0D14] tracking-[-0.03em] leading-[1.05] mb-4">
        Bonjour, Bénin.
      </h1>

      <p className="text-lg md:text-xl text-[#525866] font-normal max-w-xl mx-auto mb-10 text-balance">
        Tout ce dont vous avez besoin pour le Code du numérique, commencez ici.
      </p>

      {/* 2. Grande Carte Média avec Barre de Recherche Flottante */}
      <div
        id="recherche"
        className="w-full relative rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,20,40,0.12)] border border-black/5 bg-[#EAE8E1]"
      >
        <div className="relative h-[340px] sm:h-[420px] md:h-[460px] w-full overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1400&q=80"
            alt="Citoyens échangeant en sérénité"
            fill
            priority
            className="object-cover object-center filter saturate-[0.9] contrast-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30 pointer-events-none" />

          {/* Barre de recherche pilule flottante intégrée en haut de l'image */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[92%] sm:w-[86%] max-w-2xl z-20">
            <form
              onSubmit={handleSubmit}
              className="relative flex items-center bg-white rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.22)] px-4 sm:px-5 py-2.5 sm:py-3 border border-white/80"
            >
              <Search className="w-5 h-5 text-[#525866] mr-2.5 hidden sm:inline flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  isListening
                    ? "Écoute en cours... Parlez maintenant"
                    : "Ex. Puis-je partager la photo d'une personne dans un groupe WhatsApp ?"
                }
                className="w-full bg-transparent text-sm sm:text-base text-[#0A0D14] placeholder:text-[#525866]/70 focus:outline-none border-none p-0 pr-3"
              />

              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
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
                  className="p-2 text-[#525866] hover:text-[#0A0D14] rounded-full hover:bg-black/5 transition-colors"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={toggleVoice}
                  title="Note vocale"
                  className={`p-2 rounded-full transition-colors ${
                    isListening
                      ? "text-[#E8112D] bg-red-50 animate-pulse"
                      : "text-[#525866] hover:text-[#0A0D14] hover:bg-black/5"
                  }`}
                >
                  <Mic className="w-5 h-5" />
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0F2942] hover:bg-[#001428] text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-sm ml-1 disabled:opacity-50"
                  aria-label="Poser la question"
                >
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Légende sur l'image */}
          <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-white/90 text-xs">
            <span className="font-medium drop-shadow">Cotonou • Littoral, République du Bénin</span>
            <span className="hidden sm:inline bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[11px] border border-white/10">
              Loi N° 2017-20 modifiée
            </span>
          </div>
        </div>
      </div>

      {/* 3. Contrôles carrousel minimaux (< || >) et pill d'annonce */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-3xl mt-5 px-2 gap-4">
        <Link
          href="#roadmap"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E5E7EB] hover:border-black/30 shadow-sm text-xs text-[#0A0D14] transition-all hover:scale-[1.01]"
        >
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#0F2942] text-white">
            Nouveau
          </span>
          <span>Signaler une arnaque, diffamation ou usurpation →</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="w-7 h-7 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#525866] hover:text-[#0A0D14] hover:border-black/30 transition-all text-xs"
            title="Précédent"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#525866] hover:text-[#0A0D14] hover:border-black/30 transition-all text-xs"
            title="Pause"
          >
            <Pause className="w-3 h-3" />
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#525866] hover:text-[#0A0D14] hover:border-black/30 transition-all text-xs"
            title="Suivant"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
