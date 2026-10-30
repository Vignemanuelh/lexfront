import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import FAQPage from "@/app/faq/page";

describe("FAQPage component", () => {
  it("renders page header and search input", async () => {
    render(<FAQPage />);
    expect(screen.getByText("Foire aux questions officielles")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Rechercher par situation/i)).toBeInTheDocument();
  });

  it("renders pre-validated official questions and expands accordion on click", async () => {
    render(<FAQPage />);
    
    await waitFor(() => {
      expect(
        screen.getByText(/Puis-je publier la photo d'une personne sans son accord préalable \?/i)
      ).toBeInTheDocument();
    });

    const questionButton = screen.getByText(
      /Puis-je publier la photo d'une personne sans son accord préalable \?/i
    );
    fireEvent.click(questionButton);

    expect(screen.getByText(/Article 552/i)).toBeInTheDocument();
  });

  it("filters questions according to search input", async () => {
    render(<FAQPage />);

    await waitFor(() => {
      expect(screen.getByText(/Puis-je publier la photo d'une personne/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Rechercher par situation/i);
    fireEvent.change(searchInput, { target: { value: "Signal" } });

    expect(screen.getByText(/Est-il permis d'utiliser des applications chiffrées/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/Puis-je publier la photo d'une personne sans son accord/i)
    ).not.toBeInTheDocument();
  });
});
