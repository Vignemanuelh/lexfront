import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import GovBanner from "@/components/layout/GovBanner";

describe("GovBanner component", () => {
  it("renders the official Republic of Benin banner title", () => {
    render(<GovBanner />);
    expect(screen.getByText("Un site officiel de la République du Bénin")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Comment le reconnaître/i })).toBeInTheDocument();
  });

  it("toggles the expandable security accordion on click", () => {
    render(<GovBanner />);
    const button = screen.getByRole("button", { name: /Comment le reconnaître/i });

    expect(screen.queryByText(/Les sites officiels utilisent le domaine \.bj/i)).not.toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.getByText(/Les sites officiels utilisent le domaine \.bj/i)).toBeInTheDocument();
    expect(screen.getByText(/Les sites officiels sont sécurisés par HTTPS/i)).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.queryByText(/Les sites officiels utilisent le domaine \.bj/i)).not.toBeInTheDocument();
  });
});
