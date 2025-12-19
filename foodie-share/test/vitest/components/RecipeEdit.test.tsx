import React from "react";
import { render, screen, fireEvent } from "@testing-library/preact";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { PropsWithChildren } from "react";
import { RecipesProvider, recipesReducer } from '../../../src/context/RecipesContext';
import RecipeDetail from "../../../src/components/RecipeDetails";
import recipesData from '../../../src/data/recipes.json';

// Router mocks
const navigateMock = vi.fn();
vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "1" }),
  useNavigate: () => navigateMock,
  useLocation: () => ({ state: { successMessage: "Recette modifiée !" } }),
  Link: ({ children }: PropsWithChildren) => <span>{children}</span>,
}));

// Mock icons
vi.mock("react-icons/fa", () => ({
  FaHeart: () => null,
  FaAngleDoubleLeft: () => null,
  FaTrashAlt: () => null,
  FaPenNib: () => null,
  FaRegComment: () => null,
}));

beforeEach(() => {
  // Spy sur fetch pour retourner le JSON réel
  vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: true,
    json: async () => recipesData,
  } as Response);

  navigateMock.mockClear();
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("RecipeDetail (page détail)", () => {
  it("affiche la recette et le message de succès", async () => {
    render(<RecipeDetail />);

    // Vérifie que le titre de la recette est affiché
    expect(await screen.findByText(recipesData[0].title)).toBeInTheDocument();
    expect(screen.getByText(`Catégorie: ${recipesData[0].tag}`)).toBeInTheDocument();
    expect(screen.getByText(recipesData[0].description)).toBeInTheDocument();
  });

  it("le bouton Retour appelle navigate(-1)", async () => {
    render(<RecipeDetail />);
    await screen.findByText(recipesData[0].title);

    fireEvent.click(screen.getByRole("button", { name: /retour/i }));
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });

  it("ADD_LIKE incrémente les likes", () => {
    const state = { recipes: [recipesData[0]] };
    const newState = recipesReducer(state, { type: "ADD_LIKE", payload: { id: recipesData[0].id } });
    expect(newState.recipes[0].likes).toBe(state.recipes[0].likes + 1);
  });

  it("soumettre un commentaire l'ajoute à la liste", async () => {
    render(
      <RecipesProvider>
        <RecipeDetail />
      </RecipesProvider>
    );

    await screen.findByText(recipesData[0].title);

    fireEvent.input(screen.getByPlaceholderText("Votre nom"), { target: { value: "Aluce" } });
    fireEvent.input(screen.getByPlaceholderText("Votre commentaire"), { target: { value: "zz Top !" } });

    fireEvent.submit(screen.getByRole("button", { name: /commenter/i }));

    expect(await screen.findByText("Aluce")).toBeInTheDocument();
    expect(await screen.findByText("zz Top !")).toBeInTheDocument();
  });
});
