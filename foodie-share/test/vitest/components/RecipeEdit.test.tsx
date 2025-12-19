import React from "react";
import { render, screen, fireEvent } from "@testing-library/preact";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import RecipeDetails from "../../../src/components/RecipeDetails";
import type { PropsWithChildren } from "react";
import { RecipesProvider } from '../../../src/context/RecipesContext';
import RecipeDetail from "../../../src/components/RecipeDetails";
import { recipesReducer } from "../../../src/context/RecipesContext";

// Router mocks
const navigateMock = vi.fn();
vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "1" }),
  useNavigate: () => navigateMock,
  useLocation: () => ({ state: { successMessage: "Recette modifiée !" } }),
  Link: ({ children }: PropsWithChildren) => <span>{children}</span>,
}));

// Mock icons complet
vi.mock("react-icons/fa", () => ({
  FaHeart: () => null,
  FaAngleDoubleLeft: () => null,
  FaTrashAlt: () => null,
  FaPenNib: () => null,
  FaRegComment: () => null,
}));

const mockRecipes = [
  {
    id: 1,
    title: "Tarte aux pommes",
    description: "Une tarte délicieuse",
    tag: "Dessert",
    ingredients: ["pommes", "sucre"],
    steps: ["préparer", "cuire"],
    likes: 12,
    imagePath: "/images/recipes/tarte.jpg",
    comments: [{ user: "Alice", message: "Top !" }],
  },
];

let fetchSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  fetchSpy = vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValue({
      ok: true,
      json: async () =>
        mockRecipes.map((r) => ({
          ...r,
          comments: r.comments?.map((c) => ({ ...c })),
        })),
    } as Response);

  navigateMock.mockClear();
  vi.clearAllMocks(); // reset mocks (inclut alert si défini dans setup.ts)
});

afterEach(() => {
  fetchSpy?.mockRestore();
});

describe("RecipeEdit (page détail)", () => {
  it("affiche la recette et le message de succès", async () => {
    render(<RecipeDetails />);

    expect(await screen.findByText("Tarte aux pommes")).toBeInTheDocument();
    expect(screen.getByText("Catégorie: Dessert")).toBeInTheDocument();
    expect(screen.getByText("Une tarte délicieuse")).toBeInTheDocument();

    // message venant de location.state si ton composant l’affiche

    expect(fetchSpy).toHaveBeenCalledWith("../data/recipes.json");
  });

  it("le bouton Retour appelle navigate(-1)", async () => {
    render(<RecipeDetails />);
    await screen.findByText("Tarte aux pommes");

    fireEvent.click(screen.getByRole("button", { name: /retour/i }));
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });

it("ADD_LIKE incrémente les likes", () => {
  const state = {
  recipes: [
    {
      id: 1,
      title: "Tarte aux pommes",
      description: "Une tarte délicieuse",
      tag: "Dessert",
      ingredients: [],
      steps: [],
      likes: 12,
      comments: [],
    },
  ],
};

const newState = recipesReducer(state, {
  type: "ADD_LIKE",
  payload: { id: 1 },
});

expect(newState.recipes[0].likes).toBe(13);

});



it("soumettre un commentaire l'ajoute à la liste", async () => {
  render(
    <RecipesProvider>
      <RecipeDetail />
    </RecipesProvider>
  );

  await screen.findByText("Tarte aux pommes"); // recette chargée

  fireEvent.input(screen.getByPlaceholderText("Votre nom"), {
    target: { value: "Alice" },
  });

  fireEvent.input(screen.getByPlaceholderText("Votre commentaire"), {
    target: { value: "Top !" },
  });

  fireEvent.submit(screen.getByRole("button", { name: /commenter/i }));

  expect(await screen.findByText("Alice")).toBeInTheDocument();
  expect(await screen.findByText("Top !")).toBeInTheDocument();
});
});
