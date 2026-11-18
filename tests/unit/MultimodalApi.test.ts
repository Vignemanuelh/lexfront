import { describe, it, expect, vi, afterEach } from "vitest";
import { askLegalQuestionMultimodal } from "@/lib/api";

describe("askLegalQuestionMultimodal error and prompt fallback", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throws backend error detail instead of returning fake mock when media analysis fails without textPrompt", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        status: 503,
        json: async () => ({
          detail: "Le service d'analyse multimodale est temporairement surchargé.",
        }),
      })) as unknown as typeof fetch
    );

    const file = new File(["png"], "capture.png", { type: "image/png" });
    await expect(askLegalQuestionMultimodal(file, "", "WEB")).rejects.toThrow(
      /temporairement surchargé/i
    );
  });

  it("falls back to asking the user's actual textPrompt rather than fabricated OCR text", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
        json: async () => ({ detail: "OCR indisponible" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          interaction_id: "int-1",
          statut_legal: "interdit",
          articles_cites: ["Article 552"],
          explication_vulgarisee: "Réponse basée sur la question écrite.",
          conseil_pratique: "Conservez les captures.",
          avertissement_legal: "Outil informatif.",
          necessite_escalade: false,
        }),
      });

    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);

    const file = new File(["png"], "capture.png", { type: "image/png" });
    const res = await askLegalQuestionMultimodal(file, "Est-ce du chantage ?", "WEB");

    expect(res.explication_vulgarisee).toBe("Réponse basée sur la question écrite.");
    const secondBody = JSON.parse(fetchMock.mock.calls[1][1].body as string);
    expect(secondBody.question).toBe("Est-ce du chantage ?");
    expect(secondBody.question).not.toContain("150.000 FCFA");
  });
});
