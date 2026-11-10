import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import PartenairePage from "@/app/partenaire/page";
import FAQPage from "@/app/faq/page";
import ChatInputBar from "@/components/chat/ChatInputBar";
import { askLegalQuestionStream, askLegalQuestion } from "@/lib/api";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/partenaire"),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

// Mock API functions for instantaneous reactivity tests
vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();
  return {
    ...actual,
    fetchPartnerEscalations: vi.fn(async () => [
      {
        id: "dossier-1",
        reference_number: "#BEN-2026-0001",
        citizen_contact: "+229 97 00 11 22",
        question_summary: "Diffusion photo sans consentement sur TikTok",
        reason: "ZONE_GRISE",
        status: "PENDING",
        assigned_jurist: "Me Karen Houndété",
        jurist_response: null,
        created_at: "2026-11-10T10:00:00Z",
        resolved_at: null,
        interaction_context: {
          statut_legal: "interdit",
          articles_cites: ["Article 567"],
          explication_vulgarisee: "La diffusion sans consentement est interdite.",
        },
      },
    ]),
    fetchPartnerMetrics: vi.fn(async () => ({
      total_escalations: 10,
      pending_escalations: 2,
      in_review_escalations: 3,
      resolved_escalations: 5,
      average_sla_hours: 2.1,
      accuracy_rate: 98.5,
      zero_hallucination_rate: 100,
      escalation_rate: 5.0,
      active_jurists_count: 4,
    })),
    fetchFAQ: vi.fn(async () => [
      {
        question: "LexBénin est-il gratuit ?",
        reponse: "Oui, l'accès à LexBénin est 100 % gratuit pour tous les citoyens.",
        resume: "Oui, 100 % gratuit.",
        categorie: "Général & Mission",
        statut_legal: "autorisé",
      },
      {
        question: "Comment utiliser WhatsApp ?",
        reponse: "Envoyez simplement un message au numéro officiel.",
        resume: "WhatsApp disponible 24/7.",
        categorie: "Formats & WhatsApp",
        statut_legal: "autorisé",
      },
    ]),
  };
});

describe("360° Responsiveness & Reactivity Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("1. Mobile Master-Detail Navigation on /partenaire", () => {
    it("handles mobile master-detail toggle seamlessly without scrolling offscreen", async () => {
      const { container } = render(<PartenairePage />);

      // Attendre le chargement des dossiers
      await waitFor(() => {
        expect(screen.getAllByText("#BEN-2026-0001").length).toBeGreaterThanOrEqual(1);
      });

      // Colonnes master (liste) et detail
      const listColumn = container.querySelector(".lg\\:col-span-5");
      const detailColumn = container.querySelector(".lg\\:col-span-7");
      expect(listColumn).toBeInTheDocument();
      expect(detailColumn).toBeInTheDocument();

      // Initialement : la colonne détail est masquée sur mobile (hidden lg:block)
      expect(detailColumn).toHaveClass("hidden");
      expect(listColumn).not.toHaveClass("hidden");

      // Clic sur le dossier
      const dossierCard = screen.getAllByText("Diffusion photo sans consentement sur TikTok")[0];
      fireEvent.click(dossierCard);

      // Sur mobile, après sélection du dossier : la liste se masque et le détail s'affiche
      expect(detailColumn).not.toHaveClass("hidden");
      expect(detailColumn).toHaveClass("block");
      expect(listColumn).toHaveClass("hidden");

      // Clic sur le bouton de retour mobile
      const backBtn = screen.getByRole("button", {
        name: /Retour à la liste des dossiers/i,
      });
      fireEvent.click(backBtn);

      // Retour à la liste : la colonne détail redevient masquée sur mobile
      expect(detailColumn).toHaveClass("hidden");
      expect(listColumn).not.toHaveClass("hidden");
    });
  });

  describe("2. FAQ Accordion & Instant Search Filter", () => {
    it("toggles accordion smoothly with rotating chevron", async () => {
      render(<FAQPage />);

      await waitFor(() => {
        expect(screen.getByText("LexBénin est-il gratuit ?")).toBeInTheDocument();
      });

      // Le texte de réponse ne doit pas être visible initialement
      expect(
        screen.queryByText("Oui, l'accès à LexBénin est 100 % gratuit pour tous les citoyens.")
      ).not.toBeInTheDocument();

      // Clic sur la question pour déplier
      const questionBtn = screen.getByRole("button", {
        name: /LexBénin est-il gratuit \?/i,
      });
      fireEvent.click(questionBtn);

      // La réponse apparaît
      expect(
        screen.getByText("Oui, l'accès à LexBénin est 100 % gratuit pour tous les citoyens.")
      ).toBeInTheDocument();

      // Clic à nouveau pour replier
      fireEvent.click(questionBtn);
      expect(
        screen.queryByText("Oui, l'accès à LexBénin est 100 % gratuit pour tous les citoyens.")
      ).not.toBeInTheDocument();
    });

    it("filters questions instantly via live search input", async () => {
      render(<FAQPage />);

      await waitFor(() => {
        expect(screen.getByText("LexBénin est-il gratuit ?")).toBeInTheDocument();
        expect(screen.getByText("Comment utiliser WhatsApp ?")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/Rechercher une question d'utilisation/i);
      fireEvent.change(searchInput, { target: { value: "whatsapp" } });

      // Seule la question WhatsApp doit subsister
      expect(screen.getByText("Comment utiliser WhatsApp ?")).toBeInTheDocument();
      expect(screen.queryByText("LexBénin est-il gratuit ?")).not.toBeInTheDocument();
    });
  });

  describe("3. Mobile Touch Targets & Interaction Feedback", () => {
    it("provides accessible touch targets (>= 40px) and active scale animations", () => {
      const handleSend = vi.fn();
      render(<ChatInputBar onSend={handleSend} isLoading={false} />);

      // Bouton capture d'écran
      const clipBtn = screen.getByLabelText("Joindre une capture d'écran");
      expect(clipBtn).toHaveClass("min-w-[40px]");
      expect(clipBtn).toHaveClass("min-h-[40px]");
      expect(clipBtn).toHaveClass("active:scale-95");

      // Bouton note vocale
      const micBtn = screen.getByLabelText("Enregistrer une note vocale");
      expect(micBtn).toHaveClass("min-w-[40px]");
      expect(micBtn).toHaveClass("min-h-[40px]");
      expect(micBtn).toHaveClass("active:scale-95");

      // Bouton envoi
      const sendBtn = screen.getByLabelText("Envoyer");
      expect(sendBtn).toHaveClass("min-w-[40px]");
      expect(sendBtn).toHaveClass("min-h-[40px]");
      expect(sendBtn).toHaveClass("active:scale-95");
    });
  });

  describe("4. Fast Resilient Streaming & Fallback Reactivity", () => {
    it("simulates progressive token streaming smoothly when backend is unavailable", async () => {
      const onStatus = vi.fn();
      const onSources = vi.fn();
      const onToken = vi.fn();
      const onComplete = vi.fn();

      // Exécuter l'appel en mode streaming (qui bascule sur le fallback local ultra-rapide)
      await askLegalQuestionStream(
        { question: "Est-ce légal de publier une photo ?", channel: "WEB" },
        { onStatus, onSources, onToken, onComplete }
      );

      // Vérifier que le statut et les sources ont bien été émis
      expect(onStatus).toHaveBeenCalledWith("Recherche dans le Code du numérique...");
      expect(onSources).toHaveBeenCalled();
      expect(onToken).toHaveBeenCalled();
      expect(onComplete).toHaveBeenCalled();

      const lastResponse = onComplete.mock.calls[0][0];
      expect(lastResponse.statut_legal).toBe("interdit");
      expect(lastResponse.articles_cites).toContain("Article 567 du Code du numérique");
    });
  });
});
