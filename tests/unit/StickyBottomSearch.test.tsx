import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import StickyBottomSearch from "@/components/home/StickyBottomSearch";

describe("StickyBottomSearch component", () => {
  it("renders when forceVisible is true and shows search placeholder", () => {
    const handleSearch = vi.fn();
    render(<StickyBottomSearch onSearch={handleSearch} forceVisible={true} />);

    expect(
      screen.getByPlaceholderText(/Posez votre question sur le Code du numérique\.\.\./i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Poser la question/i })).toBeInTheDocument();
  });

  it("submits the entered query when user submits the form", () => {
    const handleSearch = vi.fn();
    render(<StickyBottomSearch onSearch={handleSearch} forceVisible={true} />);

    const input = screen.getByPlaceholderText(/Posez votre question sur le Code du numérique\.\.\./i);
    fireEvent.change(input, { target: { value: "Quels sont mes droits selon l'APDP ?" } });

    const submitBtn = screen.getByRole("button", { name: /Poser la question/i });
    fireEvent.click(submitBtn);

    expect(handleSearch).toHaveBeenCalledWith("Quels sont mes droits selon l'APDP ?");
  });

  it("does not submit when the query is empty or whitespace only", () => {
    const handleSearch = vi.fn();
    render(<StickyBottomSearch onSearch={handleSearch} forceVisible={true} />);

    const submitBtn = screen.getByRole("button", { name: /Poser la question/i });
    fireEvent.click(submitBtn);

    expect(handleSearch).not.toHaveBeenCalled();
  });
});
