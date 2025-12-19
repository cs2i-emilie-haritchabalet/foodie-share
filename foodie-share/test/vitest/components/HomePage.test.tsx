import React from "react";
import { render, screen } from "@testing-library/preact";
import { describe, it, expect, vi } from "vitest";
import HomePage from "../../../src/components/HomePage";
import type { PropsWithChildren } from "react";

/* -------------------------------------------------------------------------- */
/*                                   Mocks                                    */
/* -------------------------------------------------------------------------- */

// Router
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children }: PropsWithChildren) => <span>{children}</span>,
}));

// Icons
vi.mock("react-icons/fa", () => ({
  FaHeart: () => null,
  FaHandPointer: () => null,
}));

// RecipeForm (on ne le teste pas ici)
vi.mock("../../../src/components/RecipeForm", () => ({
  default: () => <div data-testid="recipe-form-mock" />,
}));

/* -------------------------------------------------------------------------- */
/*                          Mock du JSON (INLINE !)                            */
/* -------------------------------------------------------------------------- */

vi.mock("../../../src/data/recipes.json", () => ({
  default: [
    { id: 1, title: "Recette A", likes: 1000, imagePath: "/img/a.jpg" },
    { id: 2, title: "Recette B", likes: 5000, imagePath: "/img/b.jpg" },
    { id: 3, title: "Recette C", likes: 3000, imagePath: "/img/c.jpg" },
    { id: 4, title: "Recette D", likes: 500, imagePath: "/img/d.jpg" },
  ],
}));

/* -------------------------------------------------------------------------- */
/*                                   Tests                                    */
/* -------------------------------------------------------------------------- */

describe("HomePage", () => {
  it("affiche le titre principal", () => {
    render(<HomePage />);
    expect(
      screen.getByText("Recettes les mieux notées")
    ).toBeInTheDocument();
  });

  it("affiche les 3 recettes avec le plus de likes", async () => {
    render(<HomePage />);

    expect(await screen.findByText("Recette B")).toBeInTheDocument();
    expect(screen.getByText("Recette C")).toBeInTheDocument();
    expect(screen.getByText("Recette A")).toBeInTheDocument();

    // La 4e (moins likée) ne doit pas apparaître
    expect(screen.queryByText("Recette D")).not.toBeInTheDocument();
  });

  it("affiche le formulaire d’ajout de recette", () => {
    render(<HomePage />);
    expect(screen.getByTestId("recipe-form-mock")).toBeInTheDocument();
  });
});
