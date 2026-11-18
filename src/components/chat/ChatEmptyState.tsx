import React from "react";
import BeninFlag from "@/components/ui/BeninFlag";

export interface ChatEmptyStateProps {
  onSelectPrompt: (prompt: string) => void;
}

const STARTER_PROMPTS = [
  "Est-ce légal d'enregistrer une conversation téléphonique au Bénin ?",
  "Puis-je diffuser la photo d'un ami sans son accord préalable ?",
  "Quels sont mes droits de suppression de mes données selon l'APDP ?",
  "L'utilisation d'outils de chiffrement est-elle libre en droit béninois ?",
];

/**
 * ChatEmptyState — Écran d'accueil de la conversation calqué sur le ton sobre d'America.gov.
 */
export default function ChatEmptyState({ onSelectPrompt }: ChatEmptyStateProps) {
  return (
    <div
      data-testid="chat-empty-state"
      className="w-full max-w-2xl my-auto py-4 flex flex-col items-center text-center animate-in fade-in duration-300"
    >
      <div className="flex items-center gap-2 mb-4">
        <BeninFlag className="h-4 w-6 shadow-xs" />
        <span className="font-mono text-xs uppercase tracking-wider text-[#525866] dark:text-white/60">
          République du Bénin • Loi N° 2017-20
        </span>
      </div>

      <h2 className="font-editorial text-4xl sm:text-5xl font-normal text-[#0A0D14] dark:text-white tracking-[-0.03em] mb-3">
        Bonjour. Je suis LexBénin.
      </h2>

      <p className="font-sans text-base sm:text-lg text-[#525866] dark:text-white/70 max-w-lg mb-6 text-balance">
        Comment puis-je vous éclairer sur le Code du numérique ou la conformité de vos démarches ?
      </p>

      <div className="w-full flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2.5">
        {STARTER_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt(prompt)}
            className="text-left text-xs sm:text-sm font-sans px-4 py-2 rounded-full bg-white dark:bg-[#14171D] hover:bg-black/5 dark:hover:bg-white/10 text-[#0A0D14] dark:text-white border border-[#E5E7EB] dark:border-white/10 shadow-2xs transition-all hover:scale-[1.02] active:scale-95"
          >
            « {prompt} »
          </button>
        ))}
      </div>
    </div>
  );
}
