"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Paperclip, Mic, ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

interface HeroScenario {
  id: string;
  topic: string;
  question: string;
  location: string;
  lawRef: string;
  imageUrl: string;
}

const HERO_SCENARIOS: HeroScenario[] = [
  {
    id: "whatsapp-photo",
    topic: "Droit à l'image & WhatsApp",
    question: "Puis-je partager la photo d'une personne dans un groupe WhatsApp sans son accord ?",
    location: "Cotonou • Littoral",
    lawRef: "Loi N° 2017-20 • Art. 567",
    imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "phone-recording",
    topic: "Écoutes & Enregistrement d'appel",
    question: "Est-il légal d'enregistrer une conversation téléphonique à l'insu de mon interlocuteur ?",
    location: "Porto-Novo • Ouémé",
    lawRef: "Loi N° 2017-20 • Art. 566",
    imageUrl: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "mobile-money",
    topic: "Escroquerie Mobile Money",
    question: "Comment réagir face à une arnaque de faux message de transfert d'argent en ligne ?",
    location: "Parakou • Borgou",
    lawRef: "Loi N° 2017-20 • Art. 560",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "cyberbullying",
    topic: "Cyberharcèlement & Diffamation",
    question: "Quelles sont les sanctions pour diffamation et injure publique sur les réseaux sociaux ?",
    location: "Abomey-Calavi • Atlantique",
    lawRef: "Loi N° 2017-20 • Art. 550",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "privacy-apdp",
    topic: "Protection des données personnelles",
    question: "Comment faire supprimer mes données personnelles collectées par une entreprise selon l'APDP ?",
    location: "Ouidah • Atlantique",
    lawRef: "Loi N° 2017-20 • Art. 384",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=80",
  },
];

interface HeroSectionProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export default function HeroSection({ onSearch, isLoading = false }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeScenario = HERO_SCENARIOS[currentIndex];

  // Rotation automatique du carrousel et des suggestions toutes les 4 secondes
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SCENARIOS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? HERO_SCENARIOS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SCENARIOS.length);
  };

  const handleApplyScenario = (scenario: HeroScenario) => {
    setQuery(scenario.question);
    onSearch(scenario.question);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const textToSubmit = query.trim() || activeScenario.question;
    setQuery(textToSubmit);
    onSearch(textToSubmit);
  };

  const toggleVoice = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
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

      setTimeout(() => {
        const simulatedVoice = activeScenario.question;
        setQuery(simulatedVoice);
        setIsListening(false);
        onSearch(simulatedVoice);
      }, 1600);
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

      {/* 2. Cadre Fenêtre Média Carrousel avec Barre de Recherche Flottante */}
      <div
        id="recherche"
        className="w-full relative rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,20,40,0.14)] border border-black/5 bg-[#EAE8E1]"
      >
        <div className="relative h-[360px] sm:h-[430px] md:h-[480px] w-full overflow-hidden transition-all duration-700">
          <Image
            src={activeScenario.imageUrl}
            alt={activeScenario.topic}
            fill
            priority
            className="object-cover object-center filter saturate-[0.92] contrast-[1.02] transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30 pointer-events-none" />

          {/* Barre de recherche pilule flottante intégrée au sommet de la carte */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[92%] sm:w-[88%] max-w-2xl z-20">
            <form
              onSubmit={handleSubmit}
              className="relative flex items-center bg-white rounded-full shadow-[0_12px_35px_rgba(0,0,0,0.22)] px-4 sm:px-5 py-2.5 sm:py-3 border border-white/80"
            >
              <Search className="w-5 h-5 text-[#525866] mr-2.5 hidden sm:inline shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  isListening
                    ? "Écoute en cours... Parlez maintenant"
                    : `Essayez : « ${activeScenario.question} »`
                }
                className="w-full bg-transparent text-sm sm:text-base text-[#0A0D14] placeholder:text-[#525866]/80 focus:outline-none border-none p-0 pr-3"
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

          {/* Bandeau inférieur sur l'image avec sujet et question cliquable */}
          <div className="absolute bottom-5 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-center justify-between text-white text-xs gap-2">
            <div className="text-left">
              <span className="inline-block bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-white mb-1.5 border border-white/20">
                {activeScenario.topic}
              </span>
              <button
                type="button"
                onClick={() => handleApplyScenario(activeScenario)}
                className="block text-left text-sm font-medium hover:underline text-white/95 line-clamp-1"
              >
                « {activeScenario.question} »
              </button>
            </div>

            <div className="flex items-center gap-2 text-white/80 shrink-0">
              <span className="font-medium drop-shadow">{activeScenario.location}</span>
              <span className="hidden sm:inline bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[11px] border border-white/10 font-mono">
                {activeScenario.lawRef}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Contrôles carrousel minimaux (< || >) et pill d'annonce */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-3xl mt-5 px-2 gap-4">
        <Link
          href="#infraction"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E5E7EB] hover:border-black/30 shadow-sm text-xs text-[#0A0D14] transition-all hover:scale-[1.01]"
        >
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#0F2942] text-white">
            Nouveau
          </span>
          <span>Signaler une arnaque, diffamation ou usurpation →</span>
        </Link>

        {/* Contrôles carrousel America.gov (< || >) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="w-8 h-8 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#525866] hover:text-[#0A0D14] hover:border-black/30 transition-all text-xs active:scale-95"
            title="Exemple précédent"
            aria-label="Exemple précédent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#525866] hover:text-[#0A0D14] hover:border-black/30 transition-all text-xs active:scale-95"
            title={isPlaying ? "Mettre en pause les exemples" : "Reprendre la rotation"}
            aria-label={isPlaying ? "Mettre en pause" : "Reprendre"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="w-8 h-8 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#525866] hover:text-[#0A0D14] hover:border-black/30 transition-all text-xs active:scale-95"
            title="Exemple suivant"
            aria-label="Exemple suivant"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="text-[11px] font-mono text-[#525866] ml-1">
            {currentIndex + 1}/5
          </span>
        </div>
      </div>
    </section>
  );
}
