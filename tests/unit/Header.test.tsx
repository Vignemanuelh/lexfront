import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Header from "@/components/layout/Header";

describe("Header component", () => {
  it("renders LexBénin brand title and republic badge", () => {
    render(<Header />);
    expect(screen.getByText("LexBénin")).toBeInTheDocument();
    expect(screen.getByText("République du Bénin")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sélectionner la langue/i })).toBeInTheDocument();
  });

  it("renders call to action link for questions", () => {
    render(<Header />);
    const cta = screen.getByRole("link", { name: /Poser une question/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute("href", "#recherche");
  });
});
