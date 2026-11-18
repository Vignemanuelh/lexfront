"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ChatBubbleUser from "@/components/chat/ChatBubbleUser";
import ChatBubbleAssistant from "@/components/chat/ChatBubbleAssistant";
import ChatInputBar from "@/components/chat/ChatInputBar";
import ChatEmptyState from "@/components/chat/ChatEmptyState";
import {
  askLegalQuestion,
  askLegalQuestionStream,
  askLegalQuestionMultimodal,
} from "@/lib/api";
import { LegalQuestionResponse } from "@/lib/types";
import { Loader2, RotateCcw } from "lucide-react";

const CHAT_STORAGE_KEY = "lexbenin_chat_messages";
const PENDING_MEDIA_KEY = "lexbenin_pending_media";

interface MessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  mediaType?: "audio" | "image";
  mediaPreviewUrl?: string;
  mediaName?: string;
  legalResponse?: LegalQuestionResponse;
}

function dataUrlToFile(dataUrl: string, name: string, mimeType: string): File {
  const parts = dataUrl.split(",");
  const byteStr = atob(parts[1] || "");
  const bytes = new Uint8Array(byteStr.length);
  for (let i = 0; i < byteStr.length; i++) {
    bytes[i] = byteStr.charCodeAt(i);
  }
  return new File([bytes], name, { type: mimeType });
}

function ChatContent() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>(
    "LexBénin consulte le Code du numérique..."
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitializedFromUrl = useRef(false);
  const hasHydratedStorage = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, statusMessage]);

  useEffect(() => {
    if (!hasHydratedStorage.current) return;
    try {
      const serializable = messages.map((msg) => ({
        ...msg,
        mediaPreviewUrl:
          msg.mediaPreviewUrl && msg.mediaPreviewUrl.startsWith("blob:")
            ? undefined
            : msg.mediaPreviewUrl,
      }));
      sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(serializable));
    } catch {
      // Ignorer les erreurs de quota sessionStorage
    }
  }, [messages]);

  const handleResetConversation = () => {
    if (isLoading) return;
    setMessages([]);
    try {
      sessionStorage.removeItem(CHAT_STORAGE_KEY);
    } catch {
      // Ignorer
    }
    if (typeof window !== "undefined" && window.location.search) {
      window.history.replaceState(null, "", "/chat");
    }
  };

  const handleSendMessage = async (text: string, file?: File | Blob) => {
    const trimmed = text.trim();
    if (!trimmed && !file) return;
    if (isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const assistantMsgId = `assistant-${Date.now()}`;

    // Cas 1 : Requête multimodale (Note vocale ou capture d'écran)
    if (file) {
      const isAudio =
        file.type.startsWith("audio/") ||
        (file instanceof File && /\.(ogg|mp3|wav|m4a|webm)$/i.test(file.name));

      let mediaPreviewUrl: string | undefined;
      let mediaName: string = isAudio ? "Note vocale" : "Capture d'écran";

      if (!isAudio) {
        mediaPreviewUrl = URL.createObjectURL(file);
        if (file instanceof File) {
          mediaName = file.name;
        }
      }

      const userMsg: MessageItem = {
        id: userMsgId,
        role: "user",
        content: trimmed,
        mediaType: isAudio ? "audio" : "image",
        mediaPreviewUrl,
        mediaName,
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);
      setStatusMessage(
        isAudio
          ? "Transcription de la note vocale et analyse juridique..."
          : "Analyse visuelle et extraction OCR des articles applicables..."
      );

      try {
        const response = await askLegalQuestionMultimodal(file, trimmed, "WEB");
        setMessages((prev) => [
          ...prev,
          {
            id: assistantMsgId,
            role: "assistant",
            content: response.explication_vulgarisee,
            legalResponse: response,
          },
        ]);
      } catch (err) {
        const errorText =
          err instanceof Error && err.message
            ? err.message
            : "Désolé, une difficulté est survenue lors de l'analyse de votre média. Vous pouvez réessayer ou reformuler votre question sous forme de texte.";
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: "assistant",
            content: errorText,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Cas 2 : Requête textuelle classique avec flux streaming SSE
    const userMsg: MessageItem = {
      id: userMsgId,
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setStatusMessage("Recherche dans les 646 articles du Code du numérique...");

    let streamedContent = "";
    let isStreamStarted = false;

    try {
      await askLegalQuestionStream(
        { question: trimmed, channel: "WEB" },
        {
          onStatus: (msg) => {
            setStatusMessage(msg);
          },
          onSources: (articles) => {
            if (articles && articles.length > 0) {
              setStatusMessage(`Articles trouvés : ${articles.join(", ")}`);
            }
          },
          onToken: (token) => {
            streamedContent += token;
            if (!isStreamStarted) {
              isStreamStarted = true;
              setMessages((prev) => [
                ...prev,
                {
                  id: assistantMsgId,
                  role: "assistant",
                  content: streamedContent,
                },
              ]);
            } else {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId ? { ...m, content: streamedContent } : m
                )
              );
            }
          },
          onComplete: (response) => {
            setMessages((prev) => {
              const exists = prev.some((m) => m.id === assistantMsgId);
              if (exists) {
                return prev.map((m) =>
                  m.id === assistantMsgId
                    ? {
                        ...m,
                        content: response.explication_vulgarisee,
                        legalResponse: response,
                      }
                    : m
                );
              }
              return [
                ...prev,
                {
                  id: assistantMsgId,
                  role: "assistant",
                  content: response.explication_vulgarisee,
                  legalResponse: response,
                },
              ];
            });
            setIsLoading(false);
          },
          onError: () => {
            // Basculer sur la méthode classique
            askLegalQuestion({ question: trimmed, channel: "WEB" })
              .then((fallbackRes) => {
                setMessages((prev) => [
                  ...prev.filter((m) => m.id !== assistantMsgId),
                  {
                    id: assistantMsgId,
                    role: "assistant",
                    content: fallbackRes.explication_vulgarisee,
                    legalResponse: fallbackRes,
                  },
                ]);
              })
              .catch(() => {
                setMessages((prev) => [
                  ...prev.filter((m) => m.id !== assistantMsgId),
                  {
                    id: `error-${Date.now()}`,
                    role: "assistant",
                    content:
                      "Désolé, une difficulté temporaire est survenue lors de la consultation du Code du numérique. Veuillez réessayer dans quelques instants.",
                  },
                ]);
              })
              .finally(() => {
                setIsLoading(false);
              });
          },
        }
      );
    } catch {
      setIsLoading(false);
    }
  };

  // Restauration de session + traitement de la requête initiale (?media=pending ou ?q=...)
  useEffect(() => {
    if (hasInitializedFromUrl.current) return;
    hasInitializedFromUrl.current = true;

    let restored: MessageItem[] = [];
    try {
      const rawHistory = sessionStorage.getItem(CHAT_STORAGE_KEY);
      if (rawHistory) {
        const parsed = JSON.parse(rawHistory) as MessageItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          restored = parsed;
          setMessages(restored);
        }
      }
    } catch {
      // Ignorer JSON corrompu
    }
    hasHydratedStorage.current = true;

    const mediaFlag = searchParams.get("media");
    if (mediaFlag === "pending") {
      try {
        const rawPending = sessionStorage.getItem(PENDING_MEDIA_KEY);
        sessionStorage.removeItem(PENDING_MEDIA_KEY);
        if (typeof window !== "undefined") {
          window.history.replaceState(null, "", "/chat");
        }
        if (rawPending) {
          const pending = JSON.parse(rawPending) as {
            name: string;
            type: string;
            dataUrl: string;
            prompt?: string;
          };
          if (pending?.dataUrl) {
            const mediaFile = dataUrlToFile(
              pending.dataUrl,
              pending.name || "capture.png",
              pending.type || "image/png"
            );
            handleSendMessage(pending.prompt || "", mediaFile);
            return;
          }
        }
      } catch {
        // Ignorer erreur décodage média
      }
    }

    const initialQuery = searchParams.get("q");
    const trimmedQ = initialQuery?.trim();
    if (trimmedQ) {
      const alreadyInHistory = restored.some(
        (m) => m.role === "user" && m.content.trim() === trimmedQ
      );
      if (!alreadyInHistory) {
        handleSendMessage(trimmedQ);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="w-full flex-1 flex flex-col justify-between items-center max-w-3xl mx-auto px-4 sm:px-6 min-h-[calc(100dvh-84px)]">
      {/* Flux de messages ou écran d'accueil */}
      <div className="w-full flex-1 flex flex-col justify-start pt-4 sm:pt-6 pb-4">
        {messages.length === 0 && !isLoading ? (
          <ChatEmptyState onSelectPrompt={(prompt) => handleSendMessage(prompt)} />
        ) : (
          <div className="w-full flex flex-col">
            {messages.length > 0 && !isLoading && (
              <div className="w-full flex justify-end mb-4">
                <button
                  type="button"
                  onClick={handleResetConversation}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans text-[#525866] dark:text-white/70 hover:text-[#0A0D14] dark:hover:text-white bg-[#F7F7F5] dark:bg-[#14171D] border border-[#E5E7EB] dark:border-white/10 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Nouvelle discussion</span>
                </button>
              </div>
            )}
            {messages.map((msg, idx) => {
              if (msg.role === "user") {
                return (
                  <ChatBubbleUser
                    key={msg.id}
                    content={msg.content}
                    mediaType={msg.mediaType}
                    mediaPreviewUrl={msg.mediaPreviewUrl}
                    mediaName={msg.mediaName}
                  />
                );
              }

              const precedingUser = messages
                .slice(0, idx)
                .reverse()
                .find((m) => m.role === "user");

              return (
                <ChatBubbleAssistant
                  key={msg.id}
                  content={msg.content}
                  userQuestion={precedingUser?.content}
                  legalResponse={msg.legalResponse}
                />
              );
            })}

            {/* Indicateur de réflexion en cours (masqué dès l'arrivée des premiers tokens dans la bulle) */}
            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex items-center gap-2.5 text-sm text-[#525866] dark:text-white/60 mb-6 py-2 animate-in fade-in">
                <Loader2 className="w-4 h-4 animate-spin text-[#0F2942] dark:text-[#0066C5]" />
                <span className="font-sans">{statusMessage}</span>
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
