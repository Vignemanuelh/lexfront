"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface SpeechRecognitionResultEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionInstance {
  lang: string;
  start: () => void;
  stop?: () => void;
  onresult: (event: SpeechRecognitionResultEvent) => void;
  onerror: () => void;
  onend: () => void;
}

export interface UseVoiceRecognitionOptions {
  onTranscript: (transcript: string) => void;
  fallbackQuery?: string;
}

const DEFAULT_FALLBACK_VOICE_QUERY =
  "Est-ce légal d'enregistrer une conversation téléphonique au Bénin ?";

/**
 * Hook partagé gérant la reconnaissance vocale Web Speech API (avec repli simulé)
 * afin d'unifier exactement le comportement micro entre les deux barres d'accueil.
 */
export function useVoiceRecognition({
  onTranscript,
  fallbackQuery = DEFAULT_FALLBACK_VOICE_QUERY,
}: UseVoiceRecognitionOptions) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      try {
        recognitionRef.current?.stop?.();
      } catch {
        // Ignorer si déjà arrêté
      }
    };
  }, []);

  const toggleVoice = useCallback(() => {
    if (isListening) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      try {
        recognitionRef.current?.stop?.();
      } catch {
        // Ignorer
      }
      setIsListening(false);
      return;
    }

    const win =
      typeof window !== "undefined"
        ? (window as unknown as {
            SpeechRecognition?: new () => SpeechRecognitionInstance;
            webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
          })
        : undefined;

    const SpeechRecognition = win?.SpeechRecognition || win?.webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = "fr-FR";
        setIsListening(true);
        recognition.onresult = (event) => {
          const transcript = event.results?.[0]?.[0]?.transcript?.trim();
          setIsListening(false);
          if (transcript) {
            onTranscript(transcript);
          }
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
        return;
      } catch {
        setIsListening(false);
      }
    }

    setIsListening(true);
    timeoutRef.current = setTimeout(() => {
      setIsListening(false);
      onTranscript(fallbackQuery);
    }, 1500);
  }, [fallbackQuery, isListening, onTranscript]);

  return { isListening, toggleVoice };
}
