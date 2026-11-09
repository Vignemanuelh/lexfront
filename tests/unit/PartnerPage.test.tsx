import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import PartenairePage from "@/app/partenaire/page";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/partenaire"),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

// Mock API functions pour des tests instantanés sans dépendance réseau
vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();
  return {
    ...actual,
    fetchPartnerEscalations: vi.fn(async () => [
      {
        id: "e0a1b2c3-d4e5-4a6b-8c7d-9e0f1a2b3c4d",
        reference_number: "#BEN-2026-0842",
        citizen_contact: "+229 97 00 12 34",
        question_summary: "Atteinte à l'image & Trucage IA (Deepfake WhatsApp) menaçant un élève.",
        reason: "ZONE_GRISE",
        status: "PENDING",
        assigned_jurist: "Me Karen Houndété",
        jurist_response: null,
        created_at: "2026-11-09T14:15:00Z",
        resolved_at: null,
        interaction_context: {
          statut_legal: "à risque",
          articles_cites: ["Article 552", "Article 558"],
          explication_vulgarisee:
            "Le montage ou la diffusion d'images truquées sans consentement constitue un délit sévèrement puni.",
        },
      },
    ]),
    fetchPartnerMetrics: vi.fn(async () => ({
      total_escalations: 148,
      pending_escalations: 24,
      in_review_escalations: 18,
      resolved_escalations: 106,
      average_sla_hours: 3.4,
      accuracy_rate: 96.4,
      zero_hallucination_rate: 99.1,
      escalation_rate: 8.2,
      active_jurists_count: 7,
    })),
  };
});

describe("PartenairePage (Portal for Barreau du Bénin & Clinique UAC)", () => {
  it("renders page title and institutional banner", async () => {
    render(<PartenairePage />);

    expect(
      screen.getByRole("heading", { name: /Espace Partenaire Juridique & Audit/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Barreau du Bénin & Clinique Juridique UAC/i)
    ).toBeInTheDocument();
  });

  it("renders the 3 main partner tabs", () => {
    render(<PartenairePage />);

    expect(
      screen.getByRole("button", { name: /File d'attente Citoyenne/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Audit & Observabilité/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Administration du Corpus/i })
    ).toBeInTheDocument();
  });

  it("loads and displays citizen escalation dossiers in queue", async () => {
    render(<PartenairePage />);

    await waitFor(() => {
      const refNumbers = screen.getAllByText("#BEN-2026-0842");
      expect(refNumbers.length).toBeGreaterThanOrEqual(1);
    });

    expect(
      screen.getAllByText(/Atteinte à l'image & Trucage IA/i)[0]
    ).toBeInTheDocument();
  });

  it("switches to the Audit tab and displays the 4 quality KPIs", async () => {
    render(<PartenairePage />);

    const auditTabBtn = screen.getByRole("button", { name: /Audit & Observabilité/i });
    fireEvent.click(auditTabBtn);

    expect(screen.getByText(/Exactitude Juridique/i)).toBeInTheDocument();
    expect(screen.getByText(/96.4%/i)).toBeInTheDocument();
    expect(screen.getByText(/Zéro Hallucination/i)).toBeInTheDocument();
    expect(screen.getByText(/99.1%/i)).toBeInTheDocument();
    expect(screen.getByText(/Taux d'Escalade/i)).toBeInTheDocument();
    expect(screen.getByText(/SLA Moyen de Prise en Charge/i)).toBeInTheDocument();
  });

  it("switches to Corpus Administration and displays atomic chunking visualizer", async () => {
    render(<PartenairePage />);

    const corpusTabBtn = screen.getByRole("button", { name: /Administration du Corpus/i });
    fireEvent.click(corpusTabBtn);

    expect(
      screen.getByText(/Loi N° 2017-20 du 20 avril 2018/i)
    ).toBeInTheDocument();
    expect(screen.getByText("646")).toBeInTheDocument();
    expect(
      screen.getByText(/Visualiseur de Découpage Atomique/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Chunk #552/i)).toBeInTheDocument();
  });
});
