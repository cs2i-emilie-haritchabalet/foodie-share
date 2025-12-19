import React from "react";
import { render, screen, fireEvent} from "@testing-library/preact";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock router
const navigateMock = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
  useLocation: () => ({ state: { successMessage: "Ajout OK !" } }),
}));

// Mock icons
vi.mock("react-icons/fa", () => ({
  FaHeart: () => null,
  FaAngleDoubleLeft: () => null,
  FaHandPointer: () => null,
}));

// Mock RecipeForm (sinon tu testes aussi le form)
vi.mock("../../../src/components/RecipeForm", () => ({
  default: ({ onRecipeAdded }: { onRecipeAdded: () => void }) => (
    <button onClick={onRecipeAdded}>MockForm</button>
  ),
}));


import RecipesList from "../../../src/components/RecipesList";

const mockRecipes = [
  {
    id: 1,
    title: "Salade",
    description: "Desc",
    tag: "Entrée",
    ingredients: [],
    steps: [],
    likes: 10,
    imagePath: "/images/recipes/a.jpg",
  },
  {
    id: 2,
    title: "Burger",
    description: "Desc",
    tag: "Plat",
    ingredients: [],
    steps: [],
    likes: 50,
  },
  {
    id: 3,
    title: "Tarte",
    description: "Desc",
    tag: "Dessert",
    ingredients: [],
    steps: [],
    likes: 30,
  },
];

let fetchSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  navigateMock.mockClear();

  fetchSpy = vi
  .spyOn(globalThis, "fetch")
  .mockResolvedValue({
    ok: true,
    json: async () => mockRecipes,
  } as Response);

});

afterEach(() => {
  fetchSpy?.mockRestore();
  vi.restoreAllMocks();
});

describe("RecipesList", () => {
  it("affiche le titre et charge les recettes via fetch", async () => {
    render(<RecipesList />);

    expect(screen.getByText("Toutes nos recettes")).toBeInTheDocument();

    expect(await screen.findByText("Burger")).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledWith("../data/recipes.json");
  });

  it("affiche le message de succès venant de location.state", async () => {
    render(<RecipesList />);
    expect(await screen.findByText("Ajout OK !")).toBeInTheDocument();
  });

 

  it("clic sur Retour appelle navigate(-1)", async () => {
    render(<RecipesList />);
    await screen.findByText("Burger");

    fireEvent.click(screen.getByText(/retour/i));
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });

  it("clic sur une carte navigue vers /recipes/:id", async () => {
    render(<RecipesList />);
    await screen.findByText("Burger");

    fireEvent.click(screen.getByText("Burger"));
    expect(navigateMock).toHaveBeenCalledWith("/recipes/2");
  });

  it("affiche une image par défaut si imagePath est absent", async () => {
    render(<RecipesList />);
    await screen.findByText("Burger");

    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThan(0);

    const burgerImg = images.find((img) => img.getAttribute("alt") === "Burger");
    expect(burgerImg).toBeTruthy();
    expect(burgerImg?.getAttribute("src")).toBe(
      "/foodie-share/images/recipes/livre_recette.png"
    );
  });

  it("en cas d'erreur fetch, affiche le message d'erreur", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      json: async () => [],
    } as Response);

    render(<RecipesList />);

    expect(
      await screen.findByText("Erreur lors de la récupération des recettes.")
    ).toBeInTheDocument();
  });

  it("le bouton MockForm déclenche onRecipeAdded -> relance fetch", async () => {
    render(<RecipesList />);
    await screen.findByText("Burger");

    const callsBefore = fetchSpy.mock.calls.length;
    fireEvent.click(screen.getByRole("button", { name: "MockForm" }));

    expect(fetchSpy.mock.calls.length).toBeGreaterThan(callsBefore);
  });
});
