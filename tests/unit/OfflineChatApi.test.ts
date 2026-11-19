import { describe, it, expect, vi, afterEach } from "vitest";
import { askLegalQuestion } from "@/lib/api";

describe("askLegalQuestion honest offline fallback in production/development", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("returns explicit offline notice with no fabricated legal articles when backend is down in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("Failed to fetch")) as unknown as typeof fetch
    );

    const res = await askLegalQuestion({
      question: "Puis-je vendre les numéros de téléphone de mes clients ?",
      channel: "WEB",
    });

    expect(res.interaction_id).toMatch(/^offline-/);
    expect(res.statut_legal).toBe("zone grise");
    expect(res.articles_cites).toEqual([]);
    expect(res.explication_vulgarisee).toMatch(/hors ligne|injoignable/i);
    expect(res.explication_vulgarisee).not.toContain("photo");
    expect(res.necessite_escalade).toBe(false);
  });
});
