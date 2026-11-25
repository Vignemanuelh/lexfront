import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BeninFlag from "@/components/ui/BeninFlag";

describe("BeninFlag component", () => {
  it("renders the flag with accessible label", () => {
    render(<BeninFlag />);
    const flag = screen.getByRole("img", { name: /Drapeau du Bénin/i });
    expect(flag).toBeInTheDocument();
    expect(flag).toHaveAttribute("title", "République du Bénin");
  });
});
