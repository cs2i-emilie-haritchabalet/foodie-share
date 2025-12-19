import React from "react";
import { render, screen, fireEvent } from "@testing-library/preact";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock du JSON pour ce test spécifique
vi.mock('../../../src/data/recipes.json', () => ({
  default: [
    { id: 47,
      title: "Tarte aux pommes",
      description: "Desc",
      tag: "Dessert",
      ingredients: [],
      steps: [],
      likes: 10,
    }, // pas de imagePath
  ],
}));

// mock router
const navigateMock = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
  useLocation: () => ({ state: { successMessage: "Ajout OK !" } }),
}));

// mock icons
vi.mock("react-icons/fa", () => ({
  FaHeart: () => null,
  FaAngleDoubleLeft: () => null,
  FaHandPointer: () => null,
}));

// mock RecipeForm
vi.mock("../../../src/components/RecipeForm", () => ({
  default: ({ onRecipeAdded }: { onRecipeAdded: () => void }) => (
    <button onClick={onRecipeAdded}>MockForm</button>
  ),
}));

import RecipesList from "../../../src/components/RecipesList";

beforeEach(() => {
  navigateMock.mockClear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("RecipesList", () => {
  it("affiche le titre et charge les recettes via import JSON", async () => {
    render(<RecipesList />);
    expect(screen.getByText("Toutes nos recettes")).toBeInTheDocument();
    expect(await screen.findByText("Tarte aux pommes")).toBeInTheDocument();
  });

  it("affiche le message de succès venant de location.state", async () => {
    render(<RecipesList />);
    expect(await screen.findByText("Ajout OK !")).toBeInTheDocument();
  });

  it("clic sur Retour appelle navigate(-1)", async () => {
    render(<RecipesList />);
    await screen.findByText("Tarte aux pommes");
    fireEvent.click(screen.getByText(/retour/i));
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });

  it("clic sur une carte navigue vers /recipes/:id", async () => {
    render(<RecipesList />);
    await screen.findByText("Tarte aux pommes");
    fireEvent.click(screen.getByText("Tarte aux pommes"));
    expect(navigateMock).toHaveBeenCalledWith("/recipes/47");
  });

  it("affiche une image par défaut si imagePath est absent", async () => {
    render(<RecipesList />);
    await screen.findByText("Tarte aux pommes");

    const images = screen.getAllByRole("img");
    const tarteImg = images.find(img => img.getAttribute("alt") === "Tarte aux pommes");

    expect(tarteImg).toBeTruthy();
    expect(tarteImg?.getAttribute("src")).toBe("/images/recipes/livre_recette.png");
  });


  it("le bouton MockForm déclenche onRecipeAdded", async () => {
    render(<RecipesList />);
    await screen.findByText("Tarte aux pommes");
    fireEvent.click(screen.getByRole("button", { name: "MockForm" }));
    // ici tu peux tester un effet attendu, par ex un state ou un re-render
    expect(screen.getByText("Toutes nos recettes")).toBeInTheDocument();
  });
});
