import React from "react";
import { CheckCircle2, BookOpen } from "lucide-react";

export interface LawArticleBoxProps {
  articleNumber: string | number;
  lawTitle?: string;
  articleText: string;
  sourceUrl?: string;
  className?: string;
}

/**
 * LawArticleBox — Encadré de citation d'article officiel du Code du numérique béninois.
 * Utilise la police JetBrains Mono pour l'article et garantit une présentation solennelle et vérifiée.
 */
export default function LawArticleBox({
  articleNumber,
  lawTitle = "Code du numérique (Loi N° 2017-20 modifiée)",
  articleText,
  sourceUrl,
  className = "",
}: LawArticleBoxProps) {
  const formattedArticle =
    typeof articleNumber === "string" && articleNumber.toLowerCase().startsWith("article")
      ? articleNumber
      : `Article ${articleNumber}`;

  return (
    <div
      data-testid="law-article-box"
      className={`w-full rounded-2xl bg-[#F7F7F5] dark:bg-[#14171D] border border-[#E5E7EB] dark:border-white/10 p-5 sm:p-6 transition-all ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-[#E5E7EB] dark:border-white/10">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#0F2942] dark:text-amber-400 shrink-0" />
          <span className="font-mono text-xs sm:text-sm font-semibold text-[#0F2942] dark:text-white">
            {formattedArticle}
          </span>
          <span className="text-xs text-[#525866] dark:text-white/60 hidden sm:inline">
            • {lawTitle}
          </span>
        </div>

        <div className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Texte officiel en vigueur</span>
        </div>
      </div>

      <blockquote className="font-serif italic text-sm sm:text-base leading-relaxed text-[#0A0D14] dark:text-white/90 pl-3 border-l-2 border-[#0F2942]/40 dark:border-white/30">
        « {articleText} »
      </blockquote>

      {sourceUrl && (
        <div className="mt-3 text-right">
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-sans text-[#0F2942] dark:text-[#0066C5] hover:underline"
          >
            Consulter au Journal Officiel →
          </a>
        </div>
      )}
    </div>
  );
}
