import React from "react";

export interface ChatBubbleUserProps {
  content: string;
}

/**
 * ChatBubbleUser — Bulle de message usager sobre calquée sur America.gov.
 * Alignée à droite avec fond doux (#EFECE6 en clair, #1A202C en sombre).
 */
export default function ChatBubbleUser({ content }: ChatBubbleUserProps) {
  return (
    <div className="w-full flex justify-end mb-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div
        data-testid="chat-bubble-user"
        className="max-w-[88%] sm:max-w-[75%] rounded-2xl sm:rounded-3xl rounded-tr-md px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-sans font-normal text-[#0A0D14] bg-[#EFECE6] dark:bg-[#1A202C] dark:text-white border border-transparent dark:border-white/10 shadow-xs text-balance"
      >
        {content}
      </div>
    </div>
  );
}
