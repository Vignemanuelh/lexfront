import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import PartenairePage from "@/app/partenaire/page";
import { PartnerAuthError, getPartnerKey } from "@/lib/api";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/partenaire"),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

const fetchEsc = vi.fn();
const fetchMetrics = vi.fn();

vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();
  return {
    ...actual,
    fetchPartnerEscalations: (...args: unknown[]) => fetchEsc(...args),
    fetchPartnerMetrics: (...args: unknown[]) => fetchMetrics(...args),
  };
});

describe("Espace partenaire protégé par clé", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    fetchEsc.mockReset();
    fetchMetrics.mockReset();
  });

  it("affiche le formulaire de clé quand l'API répond 401, sans données de démonstration", async () => {
    fetchEsc.mockRejectedValue(new PartnerAuthError());
    fetchMetrics.mockRejectedValue(new PartnerAuthError());
    render(<PartenairePage />);

    expect(await screen.findByLabelText(/Clé d'accès partenaire/i)).toBeInTheDocument();
    expect(screen.queryByText(/File d'attente Citoyenne/i)).not.toBeInTheDocument();
  });

  it("mémorise la clé dans sessionStorage et recharge les données", async () => {
    fetchEsc.mockRejectedValueOnce(new PartnerAuthError());
    fetchMetrics.mockRejectedValueOnce(new PartnerAuthError());
    fetchEsc.mockResolvedValue([]);
    fetchMetrics.mockResolvedValue({
      total_escalations: 1,
      pending_escalations: 0,
      in_review_escalations: 0,
      resolved_escalations: 1,
      average_sla_hours: 1,
      accuracy_rate: 99,
      zero_hallucination_rate: 100,
      escalation_rate: 1,
      active_jurists_count: 1,
    });
    render(<PartenairePage />);

    const input = await screen.findByLabelText(/Clé d'accès partenaire/i);
    fireEvent.change(input, { target: { value: "ma-cle-partenaire" } });
    fireEvent.click(screen.getByRole("button", { name: /Accéder/i }));

    await waitFor(() => expect(getPartnerKey()).toBe("ma-cle-partenaire"));
    await waitFor(() => expect(fetchEsc).toHaveBeenCalledTimes(2));
    expect(await screen.findByText(/Se déconnecter/i)).toBeInTheDocument();
  });
});
