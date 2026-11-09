import React from "react";
import { Mic, Image as ImageIcon } from "lucide-react";

export interface ChatBubbleUserProps {
  content: string;
  mediaType?: "audio" | "image";
  mediaPreviewUrl?: string;
  mediaName?: string;
}

/**
 * ChatBubbleUser — Bulle de message usager sobre calquée sur America.gov.
 * Alignée à droite avec fond doux (#EFECE6 en clair, #1A202C en sombre).
 * Supporte les badges audio et captures d'écran multimodales.
 */
export default function ChatBubbleUser({
  content,
  mediaType,
  mediaPreviewUrl,
  mediaName,
}: ChatBubbleUserProps) {
  return (
    <div className="w-full flex justify-end mb-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div
        data-testid="chat-bubble-user"
        className="max-w-[88%] sm:max-w-[75%] rounded-2xl sm:rounded-3xl rounded-tr-md px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-sans font-normal text-[#0A0D14] bg-[#EFECE6] dark:bg-[#1A202C] dark:text-white border border-transparent dark:border-white/10 shadow-xs text-balance flex flex-col gap-2"
      >
        {mediaType === "audio" && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 text-xs font-medium w-fit">
            <Mic className="w-3.5 h-3.5 text-[#0066C5]" />
            <span>Note vocale usager {mediaName ? `(${mediaName})` : ""}</span>
          </div>
        )}

        {mediaType === "image" && (
          <div className="flex flex-col gap-1.5">
            {mediaPreviewUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mediaPreviewUrl}
                alt="Capture citoyenne"
                className="max-h-48 rounded-lg object-contain bg-black/10 dark:bg-black/30 border border-black/5 dark:border-white/10"
              />
            )}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 text-xs font-medium w-fit">
              <ImageIcon className="w-3.5 h-3.5 text-[#0066C5]" />
              <span className="truncate max-w-[200px]">{mediaName || "Capture d'écran"}</span>
            </div>
          </div>
        )}

        {content && <p className="leading-relaxed">{content}</p>}
      </div>
    </div>
  );
}
