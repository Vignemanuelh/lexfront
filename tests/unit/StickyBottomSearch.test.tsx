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

  it("hides when footer is within viewport so footer links are never covered", () => {
    const footer = document.createElement("footer");
    let footerTop = 1200;
    footer.getBoundingClientRect = () =>
      ({
        top: footerTop,
        bottom: footerTop + 200,
        left: 0,
        right: 1200,
        width: 1200,
        height: 200,
        x: 0,
        y: footerTop,
        toJSON: () => ({}),
      }) as DOMRect;
    document.body.appendChild(footer);

    const originalScrollY = window.scrollY;
    const originalInnerHeight = window.innerHeight;
    Object.defineProperty(window, "scrollY", { value: 400, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 800, configurable: true });

    try {
      render(<StickyBottomSearch onSearch={vi.fn()} />);
      const dock = screen.getByTestId("sticky-bottom-search");
      expect(dock.className).toContain("opacity-100");

      footerTop = 720;
      fireEvent.scroll(window);

      expect(dock.className).toContain("opacity-0");
      expect(dock.className).toContain("pointer-events-none");
    } finally {
      Object.defineProperty(window, "scrollY", { value: originalScrollY, configurable: true });
      Object.defineProperty(window, "innerHeight", { value: originalInnerHeight, configurable: true });
      footer.remove();
    }
  });
});
