import React from "react";
import { render, screen } from "@testing-library/preact";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { PropsWithChildren } from "react";

// 1) Router mock
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children }: PropsWithChildren) => <span>{children}</span>,
}));

// 2) Icons mock
vi.mock("react-icons/fa", () => ({
  FaHeart: () => null,
  FaHandPointer: () => null,
}));

// 3) Mock RecipeForm
vi.mock("../../../src/components/RecipeForm", () => ({
  default: () => <div data-testid="recipe-form-mock" />,
}));

const mockRecipes = [
  { id: 1, title: "Recette A", likes: 10, imagePath: "img/a.jpg" },
  { id: 2, title: "Recette B", likes: 50, imagePath: "img/b.jpg" },
  { id: 3, title: "Recette C", likes: 30, imagePath: "img/c.jpg" },
  { id: 4, title: "Recette D", likes: 5 },
];

let fetchSpy: ReturnType<typeof vi.spyOn>;

beforeEach(async () => {
  // IMPORTANT : évite d'utiliser une version "cachée" du module déjà importée
  vi.resetModules();

  fetchSpy = vi
    .spyOn(globalThis, "fetch" as any)
    .mockResolvedValue({
      ok: true,
      json: async () => mockRecipes,
    } as any);
});

afterEach(() => {
  fetchSpy?.mockRestore();
  vi.restoreAllMocks();
});

describe("HomePage", () => {
  it("affiche le titre principal", async () => {
    const { default: HomePage } = await import("../../../src/components/HomePage");

    render(<HomePage />);
    expect(screen.getByText("Recettes les mieux notées")).toBeTruthy();
  });

  it("appelle l'API de recettes au montage", async () => {
    const { default: HomePage } = await import("../../../src/components/HomePage");

    render(<HomePage />);

    // Le plus fiable : attendre un élément issu du fetch
    await screen.findByText("Recette B");

    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy.mock.calls[0][0]).toBe("/data/recipes.json");
  });

  it("affiche les 3 recettes avec le plus de likes", async () => {
    const { default: HomePage } = await import("../../../src/components/HomePage");

    render(<HomePage />);

    expect(await screen.findByText("Recette B")).toBeTruthy();
    expect(screen.getByText("Recette C")).toBeTruthy();
    expect(screen.getByText("Recette A")).toBeTruthy();
    expect(screen.queryByText("Recette D")).toBeNull();
  });
});
