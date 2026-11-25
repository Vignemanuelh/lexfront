"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Paperclip,
  Mic,
  ArrowRight,
  Lock,
  HelpCircle,
  X,
  Square,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useAudioRecorder } from "@/lib/useAudioRecorder";

export interface ChatInputBarProps {
  onSend: (message: string, file?: File | Blob) => void;
  isLoading?: boolean;
}

/**
 * ChatInputBar — Barre de saisie inférieure du chat calquée sur America.gov.
 * Présente les micro-liens APDP vérifiés et un conteneur pilule flottant complet :
 * - Texte direct
 * - Capture d'écran (OCR / Vision) avec prévisualisation et suppression
 * - Note vocale en direct via useAudioRecorder (MediaRecorder) avec timer et indicateur visuel
 */
export default function ChatInputBar({ onSend, isLoading = false }: ChatInputBarProps) {
  const [query, setQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearSelectedImage = useCallback(() => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setSelectedImage(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [imagePreviewUrl]);

  // Nettoyage de l'URL objet d'image
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleAudioReady = useCallback(
    (audioBlob: Blob) => {
      const userText = query.trim();
      setQuery("");
      clearSelectedImage();
      onSend(userText, audioBlob);
    },
    [query, clearSelectedImage, onSend]
  );

  const {
    isRecording,
    isRequestingMic,
    recordingSeconds,
    audioError,
    clearAudioError,
    startRecording,
    stopRecording,
    cancelRecording,
    formatTimer,
  } = useAudioRecorder({ onAudioReady: handleAudioReady });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      clearAudioError();
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      setSelectedImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (isRecording) {
      stopRecording();
      return;
    }

    if (!query.trim() && !selectedImage) return;

    const textToSend = query.trim();
    const imageToSend = selectedImage;

    setQuery("");
    clearSelectedImage();
    if (imageToSend) {
      onSend(textToSend, imageToSend);
    } else {
      onSend(textToSend);
    }
  };

  return (
    <div
      data-testid="chat-input-bar-dock"
      className="sticky bottom-0 z-30 w-full flex flex-col items-center shrink-0 pt-3 pb-4 sm:pb-6 bg-[#F7F7F5]/95 dark:bg-[#0B0D12]/95 backdrop-blur-md border-t border-black/5 dark:border-white/10"
    >
      {/* 1. Micro-mentions déontologiques façon America.gov avec liens fonctionnels vers /a-propos et /faq */}
      <div className="flex items-center justify-center gap-4 text-[11px] sm:text-xs text-[#525866] dark:text-white/50 mb-3 select-none">
        <Link
          href="/a-propos#confidentialite"
          className="inline-flex items-center gap-1 hover:text-[#0A0D14] dark:hover:text-white transition-colors"
        >
          <Lock className="w-3 h-3 text-[#525866] dark:text-white/50" />
          <span>Vie privée protégée (APDP)</span>
        </Link>
        <span>·</span>
        <Link
          href="/faq"
          className="inline-flex items-center gap-1 hover:text-[#0A0D14] dark:hover:text-white transition-colors"
        >
          <HelpCircle className="w-3 h-3 text-[#525866] dark:text-white/50" />
          <span>Comment ça fonctionne</span>
        </Link>
      </div>

      {/* 2. Dock pilule flottant */}
      <div className="w-full max-w-2xl relative flex flex-col">
        {audioError && (
          <div
            role="alert"
            className="mb-2 flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-red-50/95 dark:bg-[#1C1215]/95 border border-red-200 dark:border-red-900/50 text-xs text-[#B91C1C] dark:text-red-300 shadow-xs"
          >
            <div className="flex items-center gap-2 min-w-0">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{audioError}</span>
            </div>
            <button
              type="button"
              onClick={clearAudioError}
              aria-label="Fermer l'alerte"
              className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Prévisualisation de l'image sélectionnée */}
        {selectedImage && imagePreviewUrl && (
          <div className="mb-2 flex items-center gap-2.5 px-3 py-1.5 bg-white dark:bg-[#0F1217] border border-black/10 dark:border-white/20 rounded-xl shadow-xs w-fit max-w-full animate-in fade-in slide-in-from-bottom-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreviewUrl}
              alt="Prévisualisation capture"
              className="w-8 h-8 rounded object-cover border border-black/10 dark:border-white/10"
            />
            <div className="flex flex-col min-w-0 pr-1">
              <span className="text-xs font-medium text-[#0A0D14] dark:text-white truncate max-w-[200px] sm:max-w-[280px]">
                {selectedImage.name}
              </span>
              <span className="text-[10px] text-[#525866] dark:text-white/50">
                {(selectedImage.size / 1024).toFixed(0)} Ko • Analyse OCR prête
              </span>
            </div>
            <button
              type="button"
              onClick={clearSelectedImage}
              className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#525866] hover:text-[#0A0D14] dark:text-white/60 dark:hover:text-white transition-colors ml-1"
              title="Supprimer la capture"
              aria-label="Supprimer la capture"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Barre principale */}
        <form
          onSubmit={handleSubmit}
          className="w-full relative flex items-center bg-white/95 dark:bg-[#0F1217]/95 backdrop-blur-md rounded-full shadow-[0_12px_35px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_35px_rgba(0,0,0,0.7)] px-4 sm:px-5 py-2.5 sm:py-3 border border-black/10 dark:border-white/20 transition-all focus-within:border-black/25 dark:focus-within:border-white/40"
        >
          {isRecording ? (
            <div className="w-full flex items-center justify-between py-0.5">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8112D] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E8112D]"></span>
                </span>
                <span className="text-sm font-medium text-[#0A0D14] dark:text-white">
                  Enregistrement vocal : {formatTimer(recordingSeconds)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={cancelRecording}
                  className="px-2.5 py-1 text-xs text-[#525866] hover:text-[#0A0D14] dark:text-white/60 dark:hover:text-white rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={stopRecording}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E8112D] hover:bg-[#C50D24] text-white text-xs font-semibold rounded-full shadow-xs transition-colors"
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>Envoyer l&apos;audio</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <input
                id="chat-text-input"
                name="chat_query"
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (audioError) clearAudioError();
                }}
                placeholder={
                  selectedImage
                    ? "Ajoutez une question sur cette capture (optionnel)..."
                    : "Posez votre question sur le Code du numérique..."
                }
                className="w-full bg-transparent text-sm sm:text-base text-[#0A0D14] dark:text-white placeholder:text-[#525866]/80 dark:placeholder:text-white/40 focus:outline-none border-none p-0 pr-3"
              />

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <input
                  id="chat-file-input"
                  name="chat_media"
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
                  title="Joindre une capture d'écran"
                  aria-label="Joindre une capture d'écran"
                  className={`p-2.5 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center rounded-full transition-all active:scale-95 ${
                    selectedImage
                      ? "text-[#0066C5] bg-blue-50 dark:bg-blue-950/40"
                      : "text-[#525866] hover:text-[#0A0D14] dark:text-white/70 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                  }`}
                >
                  <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <button
                  type="button"
                  onClick={startRecording}
                  disabled={isRequestingMic}
                  title={
                    isRequestingMic
                      ? "Autorisez l'accès au microphone dans votre navigateur..."
                      : "Enregistrer une note vocale"
                  }
                  aria-label="Enregistrer une note vocale"
                  className={`p-2.5 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center rounded-full transition-all active:scale-95 ${
                    isRequestingMic
                      ? "text-[#0066C5] bg-blue-50 dark:bg-blue-950/40 animate-pulse"
                      : "text-[#525866] hover:text-[#0A0D14] dark:text-white/70 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                  }`}
                >
                  <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <button
                  type="submit"
                  disabled={isLoading || (!query.trim() && !selectedImage)}
                  title="Envoyer la question"
                  aria-label="Envoyer"
                  className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0F2942] hover:bg-[#001428] text-white dark:bg-[#0066C5] dark:hover:bg-[#1A75D0] dark:text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm ml-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
