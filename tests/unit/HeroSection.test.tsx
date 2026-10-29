import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HeroSection from "@/components/home/HeroSection";

describe("HeroSection component", () => {
  it("renders monument greeting 'Bonjour, Bénin.' and input field", () => {
    const handleSearch = vi.fn();
    render(<HeroSection onSearch={handleSearch} />);

    expect(screen.getByRole("heading", { level: 1, name: /Bonjour, Bénin\./i })).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Puis-je partager la photo d'une personne dans un groupe WhatsApp/i)
    ).toBeInTheDocument();
  });

  it("submits the query when user submits the form", () => {
    const handleSearch = vi.fn();
    render(<HeroSection onSearch={handleSearch} />);

    const input = screen.getByPlaceholderText(/Puis-je partager la photo d'une personne dans un groupe WhatsApp/i);
    fireEvent.change(input, { target: { value: "Est-ce légal d'enregistrer un appel ?" } });

    const submitBtn = screen.getByRole("button", { name: /Poser la question/i });
    fireEvent.click(submitBtn);

    expect(handleSearch).toHaveBeenCalledWith("Est-ce légal d'enregistrer un appel ?");
  });
});
