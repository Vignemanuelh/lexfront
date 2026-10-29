import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Header from "@/components/layout/Header";

describe("Header component", () => {
  it("renders LexBénin brand title, republic banner, and Menu button", () => {
    render(<Header />);
    expect(screen.getByText("LexBénin")).toBeInTheDocument();
    expect(screen.getByText("Un site officiel de la République du Bénin")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Menu" })).toBeInTheDocument();
  });

  it("opens the MenuDrawer when clicking the Menu button", () => {
    render(<Header />);
    const menuBtn = screen.getByRole("button", { name: "Menu" });
    fireEvent.click(menuBtn);

    expect(screen.getByRole("dialog", { name: /Menu principal/i })).toBeInTheDocument();
    expect(screen.getByText("Protection de la vie privée (APDP)")).toBeInTheDocument();
  });
});

