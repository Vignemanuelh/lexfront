import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import EscaladePage from "@/app/escalade/page";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(() => new URLSearchParams("?interaction_id=sess-999&q=Montage+photo+involontaire")),
}));

describe("EscaladePage component", () => {
  it("renders header and pre-fills interaction ID and query from URL", async () => {
    render(<EscaladePage />);

    expect(screen.getByText("Orientation vers un juriste référent")).toBeInTheDocument();
    expect(screen.getByText(/Session de consultation #sess-999/i)).toBeInTheDocument();
    
    const textarea = screen.getByLabelText(/Précisions sur les faits/i);
    expect(textarea).toHaveValue("Montage photo involontaire");
  });

  it("shows error if contact or APDP consent is missing", async () => {
    render(<EscaladePage />);

    const submitBtn = screen.getByRole("button", { name: /Transmettre ma demande d'assistance/i });
    fireEvent.click(submitBtn);

    expect(
      screen.getByText(/Veuillez renseigner un moyen de contact/i)
    ).toBeInTheDocument();
  });

  it("successfully submits when contact is filled and APDP consent is checked", async () => {
    render(<EscaladePage />);

    const contactInput = screen.getByLabelText(/Vos coordonnées pour la réponse/i);
    fireEvent.change(contactInput, { target: { value: "+229 97 00 00 00" } });

    const consentCheckbox = screen.getByRole("checkbox");
    fireEvent.click(consentCheckbox);

    const submitBtn = screen.getByRole("button", { name: /Transmettre ma demande d'assistance/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/Votre demande d'assistance a bien été transmise/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Dossier N° #BEN-2026/i)).toBeInTheDocument();
    });
  });
});
