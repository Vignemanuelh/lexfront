import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MenuDrawer from "@/components/layout/MenuDrawer";
import { ThemeProvider } from "@/lib/theme";

describe("MenuDrawer component", () => {
  it("does not render when isOpen is false", () => {
    const handleClose = vi.fn();
    render(
      <ThemeProvider>
        <MenuDrawer isOpen={false} onClose={handleClose} />
      </ThemeProvider>
    );
    expect(screen.queryByRole("dialog", { name: /Menu principal/i })).not.toBeInTheDocument();
  });

  it("renders navigation links and languages when isOpen is true", () => {
    const handleClose = vi.fn();
    render(
      <ThemeProvider>
        <MenuDrawer isOpen={true} onClose={handleClose} />
      </ThemeProvider>
    );

    expect(screen.getByRole("dialog", { name: /Menu principal/i })).toBeInTheDocument();
    expect(screen.getByText("Accueil")).toBeInTheDocument();
    expect(screen.getByText(/Consulter l'assistant/i)).toBeInTheDocument();
    expect(screen.getByText("Foire aux questions (FAQ)")).toBeInTheDocument();
    expect(screen.getByText("À propos & Déontologie")).toBeInTheDocument();
    expect(screen.getByText("Protection de la vie privée (APDP)")).toBeInTheDocument();
    expect(screen.getByText("Parler à un juriste")).toBeInTheDocument();
    expect(screen.getByText("Ouvrir sur WhatsApp")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    render(
      <ThemeProvider>
        <MenuDrawer isOpen={true} onClose={handleClose} />
      </ThemeProvider>
    );

    const closeBtn = screen.getByRole("button", { name: /Fermer le menu/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledOnce();
  });

  it("allows switching theme between light and dark", () => {
    const handleClose = vi.fn();
    render(
      <ThemeProvider>
        <MenuDrawer isOpen={true} onClose={handleClose} />
      </ThemeProvider>
    );

    const darkBtn = screen.getByRole("button", { name: /Thème sombre/i });
    fireEvent.click(darkBtn);
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    const lightBtn = screen.getByRole("button", { name: /Thème clair/i });
    fireEvent.click(lightBtn);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
