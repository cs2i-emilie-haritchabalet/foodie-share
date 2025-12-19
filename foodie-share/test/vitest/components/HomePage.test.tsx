import React from "react";
import { render, screen } from "@testing-library/preact";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import HomePage from "../../../src/components/HomePage";
import type { PropsWithChildren } from "react";


// 1) Router mock
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
 Link: ({ children }: PropsWithChildren) => <span>{children}</span>,
}));

// 2) Icons mock (évite l'erreur "object is not extensible" dans certains setups)
vi.mock("react-icons/fa", () => ({
  FaHeart: () => null,
  FaHandPointer: () => null,
}));

// 3) Mock RecipeForm (sinon il peut injecter du comportement, et ici on veut tester HomePage)
vi.mock("../../../src/components/RecipeForm", () => ({
  default: () => <div data-testid="recipe-form-mock" />,
}));

const mockRecipes = [
  { id: 1, title: "Recette A", likes: 10, imagePath: "/img/a.jpg" },
  { id: 2, title: "Recette B", likes: 50, imagePath: "/img/b.jpg" },
  { id: 3, title: "Recette C", likes: 30, imagePath: "/img/c.jpg" },
  { id: 4, title: "Recette D", likes: 5 },
];

let fetchSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
 fetchSpy = vi
  .spyOn(globalThis, "fetch")
  .mockResolvedValue({
    ok: true,
    json: async () => mockRecipes,
  } as Response);
});

afterEach(() => {
  fetchSpy?.mockRestore();
  vi.clearAllMocks();
});

describe("HomePage", () => {
  it("affiche le titre principal", () => {
    render(<HomePage />);
    expect(screen.getByText("Recettes les mieux notées")).toBeInTheDocument();
  });

  it("appelle l'API de recettes au montage", async () => {
    render(<HomePage />);
    // on attend que fetch soit bien appelé
    await vi.waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    expect(fetchSpy.mock.calls[0][0]).toBe("/foodie-share/data/recipes.json");
  });

  it("affiche les 3 recettes avec le plus de likes", async () => {
    render(<HomePage />);

    // attend que la liste soit remplie
    expect(await screen.findByText("Recette B")).toBeInTheDocument();
    expect(screen.getByText("Recette C")).toBeInTheDocument();
    expect(screen.getByText("Recette A")).toBeInTheDocument();
    expect(screen.queryByText("Recette D")).not.toBeInTheDocument();
  });
});
