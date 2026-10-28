import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StatementSection from "@/components/home/StatementSection";

describe("StatementSection component", () => {
  it("renders statement text with official sources and privacy badges", () => {
    render(<StatementSection />);
    expect(screen.getByText(/Textes officiels/i)).toBeInTheDocument();
    expect(screen.getByText(/Vie privée protégée/i)).toBeInTheDocument();
    expect(screen.getByText(/République du Bénin/i)).toBeInTheDocument();
  });
});
