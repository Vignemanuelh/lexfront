import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import React from "react";
import AProposPage from "@/app/a-propos/page";

describe("AProposPage component", () => {
  it("renders key republican impact metrics (0 F CFA, 100%, 0 Donnée)", () => {
    render(<AProposPage />);
    expect(screen.getByText("0 F CFA")).toBeInTheDocument();
    expect(screen.getByText("Gratuité intégrale")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByText("Corpus légal vérifié")).toBeInTheDocument();
    expect(screen.getByText("0 Donnée")).toBeInTheDocument();
    expect(screen.getByText("Stockage souverain")).toBeInTheDocument();
  });

  it("renders the 3 architectural anti-hallucination pillars", () => {
    render(<AProposPage />);
    expect(screen.getByText("Source unique de vérité")).toBeInTheDocument();
    expect(screen.getByText("Zéro invention d'article")).toBeInTheDocument();
    expect(screen.getByText("Orientation humaine garantie")).toBeInTheDocument();
  });

  it("renders the deontological charter with what LexBénin guarantees and does not do", () => {
    render(<AProposPage />);
    expect(screen.getByText("Ce que LexBénin garantit")).toBeInTheDocument();
    expect(screen.getByText("Ce que LexBénin ne fait pas")).toBeInTheDocument();
    expect(screen.getByText(/Protection absolue de votre vie privée numérique/i)).toBeInTheDocument();
  });
});
