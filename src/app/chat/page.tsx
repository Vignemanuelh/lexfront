"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ChatBubbleUser from "@/components/chat/ChatBubbleUser";
import ChatBubbleAssistant from "@/components/chat/ChatBubbleAssistant";
import ChatInputBar from "@/components/chat/ChatInputBar";
import ChatEmptyState from "@/components/chat/ChatEmptyState";
import { askLegalQuestion } from "@/lib/api";
import { LegalQuestionResponse } from "@/lib/types";
import { Loader2 } from "lucide-react";

interface MessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  legalResponse?: LegalQuestionResponse;
}

function ChatContent() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitializedFromUrl = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: MessageItem = {
      id: userMsgId,
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await askLegalQuestion({ question: trimmed, channel: "WEB" });
      const assistantMsg: MessageItem = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.explication_vulgarisee,
        legalResponse: response,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: MessageItem = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          "Désolé, une difficulté temporaire est survenue lors de la consultation du Code du numérique. Veuillez réessayer dans quelques instants.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Traitement de la question initiale transmise depuis la page d'accueil via ?q=...
  useEffect(() => {
    if (hasInitializedFromUrl.current) return;
    const initialQuery = searchParams.get("q");
    if (initialQuery && initialQuery.trim()) {
      hasInitializedFromUrl.current = true;
      handleSendMessage(initialQuery.trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="w-full flex-1 flex flex-col justify-between items-center max-w-3xl mx-auto px-4 sm:px-6 min-h-[calc(100vh-100px)]">
      {/* Flux de messages ou écran d'accueil */}
      <div className="w-full flex-1 flex flex-col justify-start py-6 sm:py-8 overflow-y-auto">
        {messages.length === 0 && !isLoading ? (
          <ChatEmptyState onSelectPrompt={handleSendMessage} />
        ) : (
          <div className="w-full flex flex-col">
            {messages.map((msg) =>
              msg.role === "user" ? (
                <ChatBubbleUser key={msg.id} content={msg.content} />
              ) : (
                <ChatBubbleAssistant
                  key={msg.id}
                  content={msg.content}
                  legalResponse={msg.legalResponse}
                />
              )
            )}

            {/* Indicateur de réflexion en cours */}
            {isLoading && (
              <div className="flex items-center gap-2.5 text-sm text-[#525866] dark:text-white/60 mb-6 py-2 animate-in fade-in">
                <Loader2 className="w-4 h-4 animate-spin text-[#0F2942] dark:text-[#0066C5]" />
                <span className="font-sans">LexBénin consulte le Code du numérique...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Dock de saisie bas arrondi avec liens APDP */}
      <ChatInputBar onSend={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full flex-1 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-6 h-6 animate-spin text-[#0F2942] dark:text-[#0066C5]" />
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
