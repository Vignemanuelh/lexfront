import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import React from "react";
import FAQPage from "@/app/faq/page";

describe("FAQPage component (America.gov platform style)", () => {
  it("renders page header and search input", async () => {
    render(<FAQPage />);
    expect(screen.getByText("Foire aux questions sur LexBénin")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Rechercher une question d'utilisation/i)
    ).toBeInTheDocument();
  });

  it("renders platform usage questions and expands accordion on click", async () => {
    render(<FAQPage />);

    await waitFor(() => {
      expect(
        screen.getByText(/Qu'est-ce que LexBénin et quelle est sa mission \?/i)
      ).toBeInTheDocument();
    });

    const questionButton = screen.getByText(
      /Qu'est-ce que LexBénin et quelle est sa mission \?/i
    );
    fireEvent.click(questionButton);

    expect(
      screen.getByText(/service civique d'intérêt général dédié à la vulgarisation/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Découvrir la mission & déontologie/i)
    ).toBeInTheDocument();
  });

  it("filters questions according to search input", async () => {
    render(<FAQPage />);

    await waitFor(() => {
      expect(
        screen.getByText(/Qu'est-ce que LexBénin et quelle est sa mission \?/i)
      ).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Rechercher une question d'utilisation/i);
    fireEvent.change(searchInput, { target: { value: "litige" } });

    expect(
      screen.getByText(/Que faire si ma situation est ambiguë ou si je fais face à un litige \?/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/LexBénin est-il un service entièrement gratuit \?/i)
    ).not.toBeInTheDocument();
  });

  it("filters questions when clicking a category filter button", async () => {
    render(<FAQPage />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Confidentialité & APDP" })
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Confidentialité & APDP" }));

    expect(
      screen.getByText(/Comment mes données personnelles et ma vie privée sont-elles protégées/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/Comment utiliser LexBénin directement sur WhatsApp \?/i)
    ).not.toBeInTheDocument();
  });
});
