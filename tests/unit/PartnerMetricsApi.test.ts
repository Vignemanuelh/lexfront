import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchPartnerMetrics } from "@/lib/api";

describe("fetchPartnerMetrics backend normalization", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("maps backend PartnerMetricsResponse fields into frontend PartnerMetrics", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          sla_average_hours: 4.25,
          monthly_requests: 47,
          accuracy_rate: 96.4,
          citation_verification_rate: 99.1,
          grey_zone_escalation_rate: 8.2,
          pending_audits_count: 12,
          active_law_reference: "Code du numérique",
          total_indexed_articles: 646,
          apdp_encrypted: true,
        }),
      })) as unknown as typeof fetch
    );

    const metrics = await fetchPartnerMetrics();

    expect(metrics.average_sla_hours).toBe(4.25);
    expect(metrics.total_escalations).toBe(47);
    expect(metrics.pending_escalations).toBe(12);
    expect(metrics.accuracy_rate).toBe(96.4);
    expect(metrics.zero_hallucination_rate).toBe(99.1);
    expect(metrics.escalation_rate).toBe(8.2);
  });

  it("preserves frontend-shaped metrics when returned directly", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          total_escalations: 120,
          pending_escalations: 15,
          in_review_escalations: 10,
          resolved_escalations: 95,
          average_sla_hours: 2.9,
          accuracy_rate: 97.5,
          zero_hallucination_rate: 99.8,
          escalation_rate: 6.4,
          active_jurists_count: 8,
        }),
      })) as unknown as typeof fetch
    );

    const metrics = await fetchPartnerMetrics();

    expect(metrics.average_sla_hours).toBe(2.9);
    expect(metrics.pending_escalations).toBe(15);
    expect(metrics.total_escalations).toBe(120);
    expect(metrics.active_jurists_count).toBe(8);
  });
});
