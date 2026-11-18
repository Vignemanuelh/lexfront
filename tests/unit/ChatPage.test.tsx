import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import ChatBubbleUser from "@/components/chat/ChatBubbleUser";
import ChatBubbleAssistant from "@/components/chat/ChatBubbleAssistant";
import ChatInputBar from "@/components/chat/ChatInputBar";
import ChatEmptyState from "@/components/chat/ChatEmptyState";
import Footer from "@/components/layout/Footer";
import { LegalQuestionResponse } from "@/lib/types";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/chat"),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

const mockLegalResponse: LegalQuestionResponse = {
  interaction_id: "test-123",
  statut_legal: "interdit",
  articles_cites: ["Article 567 du Code du numérique"],
  explication_vulgarisee:
    "La diffusion de la photo d'un tiers sans son accord écrit préalable est punie par la loi.",
  conseil_pratique: "Demandez toujours un accord écrit.",
  avertissement_legal: "Ne remplace pas un avocat.",
  necessite_escalade: false,
};

describe("Chat components (America.gov style)", () => {
  describe("ChatBubbleUser", () => {
    it("renders user message in right-aligned bubble", () => {
      render(<ChatBubbleUser content="Est-ce légal de publier cette photo ?" />);
      const bubble = screen.getByTestId("chat-bubble-user");
      expect(bubble).toBeInTheDocument();
      expect(bubble.textContent).toContain("Est-ce légal de publier cette photo ?");
    });
  });

  describe("ChatBubbleAssistant", () => {
    it("renders explanation text and action buttons", () => {
      render(
        <ChatBubbleAssistant
          content={mockLegalResponse.explication_vulgarisee}
          legalResponse={mockLegalResponse}
        />
      );

      const assistantBubble = screen.getByTestId("chat-bubble-assistant");
      expect(assistantBubble).toBeInTheDocument();
      expect(
        screen.getByText(/La diffusion de la photo d'un tiers sans son accord/i)
      ).toBeInTheDocument();

      // Action buttons
      expect(screen.getByRole("button", { name: /Réponse utile/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Réponse peu claire/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Copier la réponse/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Écouter la réponse/i })).toBeInTheDocument();
    });

    it("renders legal status badge and article box", () => {
      render(
        <ChatBubbleAssistant
          content={mockLegalResponse.explication_vulgarisee}
          legalResponse={mockLegalResponse}
        />
      );

      expect(screen.getByTestId("verdict-badge")).toHaveTextContent(/Interdit/i);
      expect(screen.getByTestId("law-article-box")).toBeInTheDocument();
      expect(screen.getByTestId("legal-disclaimer")).toHaveTextContent(
        "Ne remplace pas un avocat."
      );
    });

    it("passes original userQuestion in escalation link rather than explanation body", () => {
      const userQuestion = "Est-ce légal de publier une capture WhatsApp ?";
      render(
        <ChatBubbleAssistant
          content={mockLegalResponse.explication_vulgarisee}
          userQuestion={userQuestion}
          legalResponse={{ ...mockLegalResponse, necessite_escalade: true }}
        />
      );

      const escalationLink = screen.getByRole("link", { name: /Parler à un juriste/i });
      expect(escalationLink).toHaveAttribute(
        "href",
        `/escalade?interaction_id=test-123&q=${encodeURIComponent(userQuestion)}`
      );
    });

    it("renders matched official source excerpt, extra cited articles, and practical advice even when articles_cites is empty", () => {
      const responseWithSources: LegalQuestionResponse = {
        ...mockLegalResponse,
        articles_cites: ["Article 491", "Article 627"],
        sources: [
          {
            article_number: "Article 491",
            structure_title: "Livre IV — Cryptologie",
            content: "La fourniture ou l'utilisation de moyens de cryptologie est encadrée.",
            relevance_score: 0.92,
          },
        ],
      };

      const { rerender } = render(
        <ChatBubbleAssistant
          content={responseWithSources.explication_vulgarisee}
          legalResponse={responseWithSources}
        />
      );

      expect(screen.getByTestId("law-article-box")).toHaveTextContent(
        "La fourniture ou l'utilisation de moyens de cryptologie est encadrée."
      );
      expect(screen.getByText("Article 627")).toBeInTheDocument();
      expect(screen.getByTestId("practical-advice")).toHaveTextContent(
        "Demandez toujours un accord écrit."
      );

      rerender(
        <ChatBubbleAssistant
          content="Cas ambigu."
          legalResponse={{
            ...mockLegalResponse,
            statut_legal: "zone grise",
            articles_cites: [],
            necessite_escalade: true,
            extracted_content: "Transcription vocale sur un litige SaaS",
          }}
        />
      );

      expect(screen.queryByTestId("law-article-box")).not.toBeInTheDocument();
      expect(screen.getByTestId("practical-advice")).toHaveTextContent(
        "Demandez toujours un accord écrit."
      );
      expect(screen.getByRole("link", { name: /Parler à un juriste/i })).toHaveAttribute(
        "href",
        `/escalade?interaction_id=test-123&q=${encodeURIComponent("Transcription vocale sur un litige SaaS")}`
      );
    });
  });

  describe("ChatInputBar", () => {
    it("renders input field, micro-privacy link, and submits query", () => {
      const handleSend = vi.fn();
      render(<ChatInputBar onSend={handleSend} />);

      expect(
        screen.getByPlaceholderText(/Posez votre question sur le Code du numérique\.\.\./i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Vie privée protégée \(APDP\)/i)).toBeInTheDocument();

      const input = screen.getByPlaceholderText(/Posez votre question sur le Code du numérique\.\.\./i);
      fireEvent.change(input, { target: { value: "Quels sont mes droits ?" } });

      const sendBtn = screen.getByRole("button", { name: /Envoyer/i });
      fireEvent.click(sendBtn);

      expect(handleSend).toHaveBeenCalledWith("Quels sont mes droits ?");
    });
  });

  describe("ChatEmptyState", () => {
    it("renders welcoming greeting and starter prompts", () => {
      const handleSelect = vi.fn();
      render(<ChatEmptyState onSelectPrompt={handleSelect} />);

      expect(screen.getByText(/Bonjour\. Je suis LexBénin\./i)).toBeInTheDocument();

      const promptBtn = screen.getByRole("button", {
        name: /Est-ce légal d'enregistrer une conversation téléphonique au Bénin \?/i,
      });
      fireEvent.click(promptBtn);

      expect(handleSelect).toHaveBeenCalledWith(
        "Est-ce légal d'enregistrer une conversation téléphonique au Bénin ?"
      );
    });
  });

  describe("Footer on /chat", () => {
    it("returns null on /chat route", () => {
      const { container } = render(<Footer />);
      expect(container.firstChild).toBeNull();
    });
  });
});
