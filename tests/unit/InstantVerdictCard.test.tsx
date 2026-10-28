import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import InstantVerdictCard from "@/components/home/InstantVerdictCard";
import { LegalQuestionResponse } from "@/lib/types";

describe("InstantVerdictCard component", () => {
  const mockResponse: LegalQuestionResponse = {
    interaction_id: "int-123",
    statut_legal: "interdit",
    articles_cites: ["Article 567 du Code du numérique"],
    explication_vulgarisee: "Diffuser la photo sans accord est puni pénalement.",
    conseil_pratique: "Demandez toujours l'accord écrit de la personne.",
    avertissement_legal: "Ne remplace pas un avocat.",
    necessite_escalade: false,
  };

  it("renders status badge and plain language explanation", () => {
    const handleClose = vi.fn();
    render(
      <InstantVerdictCard
        response={mockResponse}
        isLoading={false}
        onClose={handleClose}
      />
    );

    expect(screen.getByText(/Strictement encadré • Risque pénal/i)).toBeInTheDocument();
    expect(screen.getByText("Diffuser la photo sans accord est puni pénalement.")).toBeInTheDocument();
    expect(screen.getByText(/— Article 567 du Code du numérique/i)).toBeInTheDocument();
    expect(screen.getByText("Ne remplace pas un avocat.")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    render(
      <InstantVerdictCard
        response={mockResponse}
        isLoading={false}
        onClose={handleClose}
      />
    );

    const closeBtn = screen.getByRole("button", { name: /Fermer la réponse/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledOnce();
  });
});
