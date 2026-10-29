import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MenuDrawer from "@/components/layout/MenuDrawer";

describe("MenuDrawer component", () => {
  it("does not render when isOpen is false", () => {
    const handleClose = vi.fn();
    render(<MenuDrawer isOpen={false} onClose={handleClose} />);
    expect(screen.queryByRole("dialog", { name: /Menu principal/i })).not.toBeInTheDocument();
  });

  it("renders navigation links and languages when isOpen is true", () => {
    const handleClose = vi.fn();
    render(<MenuDrawer isOpen={true} onClose={handleClose} />);

    expect(screen.getByRole("dialog", { name: /Menu principal/i })).toBeInTheDocument();
    expect(screen.getByText("Poser une question")).toBeInTheDocument();
    expect(screen.getByText("Comment ça fonctionne")).toBeInTheDocument();
    expect(screen.getByText("Protection de la vie privée (APDP)")).toBeInTheDocument();
    expect(screen.getByText("Signaler une arnaque / cyber-infraction")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    render(<MenuDrawer isOpen={true} onClose={handleClose} />);

    const closeBtn = screen.getByRole("button", { name: /Fermer le menu/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledOnce();
  });
});
