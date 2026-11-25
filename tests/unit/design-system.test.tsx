import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import React from "react";
import {
  CivicCard,
  PillButton,
  VerdictBadge,
  LawArticleBox,
  PageHeader,
  PageContainer,
} from "@/components/ui";
import { DESIGN_TOKENS, getVerdictConfig } from "@/lib/design-tokens";

describe("LexBénin Design System Primitives", () => {
  describe("DESIGN_TOKENS", () => {
    it("contains official America.gov dark mode tokens and light mode tokens", () => {
      expect(DESIGN_TOKENS.colors.canvas.dark).toBe("#0B0D12");
      expect(DESIGN_TOKENS.colors.canvas.light).toBe("#F7F7F5");
      expect(DESIGN_TOKENS.colors.card.dark).toBe("#0F1217");
      expect(DESIGN_TOKENS.colors.cardElevated.dark).toBe("#14171D");
      expect(DESIGN_TOKENS.colors.accent.blue.dark).toBe("#0066C5");
      expect(DESIGN_TOKENS.colors.accent.navy).toBe("#0F2942");
      expect(DESIGN_TOKENS.colors.beninFlag.green).toBe("#008751");
      expect(DESIGN_TOKENS.spacing.dockSafeBottomPadding).toBe("pb-24 sm:pb-28");
    });

    it("resolves verdict configurations for all 4 legal statuses", () => {
      expect(getVerdictConfig("autorisé").label).toBe("Autorisé");
      expect(getVerdictConfig("interdit").label).toBe("Interdit");
      expect(getVerdictConfig("à risque").label).toBe("À risque");
      expect(getVerdictConfig("zone grise").label).toBe("Zone grise");
    });
  });

  describe("CivicCard component", () => {
    it("renders with rounded-3xl and dual-theme background classes", () => {
      const { container } = render(
        <CivicCard data-testid="card">
          <p>Contenu civique</p>
        </CivicCard>
      );
      const card = screen.getByTestId("card");
      expect(card).toBeInTheDocument();
      expect(card.className).toContain("rounded-3xl");
      expect(card.className).toContain("bg-white");
      expect(card.className).toContain("dark:bg-[#0F1217]");
      expect(container.textContent).toContain("Contenu civique");
    });

    it("renders with elevated dark background when elevated is true", () => {
      render(
        <CivicCard data-testid="card-elevated" elevated>
          <p>Contenu élevé</p>
        </CivicCard>
      );
      const card = screen.getByTestId("card-elevated");
      expect(card.className).toContain("dark:bg-[#14171D]");
    });
  });

  describe("PillButton component", () => {
    it("renders primary button with rounded-full and dark blue accent", () => {
      render(<PillButton variant="primary">Agir maintenant</PillButton>);
      const btn = screen.getByRole("button", { name: /Agir maintenant/i });
      expect(btn).toBeInTheDocument();
      expect(btn.className).toContain("rounded-full");
      expect(btn.className).toContain("bg-[#0F2942]");
      expect(btn.className).toContain("dark:bg-[#0066C5]");
    });

    it("renders as Link when href is provided", () => {
      render(
        <PillButton href="/chat" variant="secondary">
          Consulter
        </PillButton>
      );
      const link = screen.getByRole("link", { name: /Consulter/i });
      expect(link).toHaveAttribute("href", "/chat");
      expect(link.className).toContain("rounded-full");
    });
  });

  describe("VerdictBadge component", () => {
    it("renders badge with appropriate label and status dot", () => {
      render(<VerdictBadge status="autorisé" />);
      const badge = screen.getByTestId("verdict-badge");
      expect(badge).toBeInTheDocument();
      expect(badge.textContent).toContain("Autorisé");
    });

    it("renders prohibited badge with red accents", () => {
      render(<VerdictBadge status="interdit" />);
      const badge = screen.getByTestId("verdict-badge");
      expect(badge.textContent).toContain("Interdit");
      expect(badge.className).toContain("text-red-800");
    });
  });

  describe("LawArticleBox component", () => {
    it("renders exact article citation with JetBrains Mono font", () => {
      render(
        <LawArticleBox
          articleNumber="550"
          articleText="Est puni quiconque accède sans droit à un système de traitement automatisé."
        />
      );
      const box = screen.getByTestId("law-article-box");
      expect(box).toBeInTheDocument();
      expect(screen.getByText(/Article 550/i)).toHaveClass("font-mono");
      expect(screen.getByText(/Texte officiel en vigueur/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Est puni quiconque accède sans droit/i)
      ).toBeInTheDocument();
    });
  });

  describe("PageHeader component", () => {
    it("renders monumental heading with font-editorial and optional badge", () => {
      render(
        <PageHeader
          title="Foire aux questions"
          subtitle="Toutes les réponses officielles sur le Code du numérique."
          badge="Aide citoyenne"
        />
      );
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveClass("font-editorial");
      expect(heading.textContent).toBe("Foire aux questions");
      expect(screen.getByText("Aide citoyenne")).toBeInTheDocument();
      expect(
        screen.getByText(/Toutes les réponses officielles/i)
      ).toBeInTheDocument();
    });
  });

  describe("PageContainer component", () => {
    it("renders max-w-4xl centered container", () => {
      render(
        <PageContainer>
          <div>Page content</div>
        </PageContainer>
      );
      const container = screen.getByTestId("page-container");
      expect(container.className).toContain("max-w-4xl");
      expect(container.className).toContain("mx-auto");
    });
  });
});
