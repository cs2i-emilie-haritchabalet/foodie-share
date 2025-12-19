import React, { useReducer, type ReactNode } from "react";
import { render, screen, fireEvent } from "@testing-library/preact";
import { describe, it, expect, vi } from "vitest";

import RecipeDetail from "../../../src/components/RecipeDetails";
import {
  RecipesContext,
  recipesReducer,
  type Recipe,
  type Action,
} from "../../../src/context/RecipesContext";

/* -------------------------------------------------------------------------- */
/*                           Mock du fichier JSON                              */
/* -------------------------------------------------------------------------- */
/**
 * ⚠️ IMPORTANT :
 * - Le composant importe recipes.json
 * - Vitest hoiste vi.mock
 * - Donc données INLINE, export default
 */
vi.mock("../../../src/data/recipes.json", () => ({
  default: [
    {
      id: 55,
      title: "Recette B",
      description: "Desc B",
      tag: "Dessert",
      ingredients: ["sucre", "farine"],
      steps: ["melanger", "cuire"],
      likes: 42,
      imagePath: "/images/recipes/b.jpg",
      comments: [
        { user: "Alice", message: "Top !" },
        { user: "Bob", message: "Super recette" },
      ],
    },
  ],
}));

/* -------------------------------------------------------------------------- */
/*                       Données mock pour le Context                          */
/* -------------------------------------------------------------------------- */

const mockRecipes: Recipe[] = [
  {
    id: 55,
    title: "Recette B",
    description: "Desc B",
    tag: "Dessert",
    ingredients: ["sucre", "farine"],
    steps: ["melanger", "cuire"],
    likes: 42,
    imagePath: "/images/recipes/b.jpg",
    comments: [
      { user: "Alice", message: "Top !" },
      { user: "Bob", message: "Super recette" },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*                         Provider de test custom                              */
/* -------------------------------------------------------------------------- */

interface TestRecipesProviderProps {
  children: ReactNode;
  initialRecipes?: Recipe[];
  dispatchMock?: (action: Action) => void;
}

const TestRecipesProvider = ({
  children,
  initialRecipes = [],
  dispatchMock,
}: TestRecipesProviderProps) => {
  const [state, dispatch] = useReducer(recipesReducer, {
    recipes: initialRecipes,
  });

  return (
    <RecipesContext.Provider
      value={{
        state,
        dispatch: dispatchMock ?? dispatch,
      }}
    >
      {children}
    </RecipesContext.Provider>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   Mocks                                    */
/* -------------------------------------------------------------------------- */

// Router
const navigateMock = vi.fn();
vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "55" }),
  useNavigate: () => navigateMock,
}));

// Icônes
vi.mock("react-icons/fa", () => ({
  FaHeart: () => null,
  FaAngleDoubleLeft: () => null,
  FaRegComment: () => null,
}));

/* -------------------------------------------------------------------------- */
/*                                   Tests                                    */
/* -------------------------------------------------------------------------- */

describe("RecipeDetail", () => {
  it("affiche la recette et ses informations", async () => {
    render(
      <TestRecipesProvider initialRecipes={mockRecipes}>
        <RecipeDetail />
      </TestRecipesProvider>
    );

    expect(await screen.findByText("Recette B")).toBeInTheDocument();
    expect(screen.getByText("Catégorie: Dessert")).toBeInTheDocument();
    expect(screen.getByText("Desc B")).toBeInTheDocument();

    expect(screen.getByText("sucre")).toBeInTheDocument();
    expect(screen.getByText("farine")).toBeInTheDocument();
    expect(screen.getByText("melanger")).toBeInTheDocument();
    expect(screen.getByText("cuire")).toBeInTheDocument();
  });

  it("le bouton Retour appelle navigate(-1)", async () => {
    render(
      <TestRecipesProvider initialRecipes={mockRecipes}>
        <RecipeDetail />
      </TestRecipesProvider>
    );

    await screen.findByText("Recette B");

    fireEvent.click(screen.getByRole("button", { name: /retour/i }));
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });

  it("cliquer sur J'aime déclenche dispatch ADD_LIKE", async () => {
    const dispatchMock = vi.fn();

    render(
      <TestRecipesProvider
        initialRecipes={mockRecipes}
        dispatchMock={dispatchMock}
      >
        <RecipeDetail />
      </TestRecipesProvider>
    );

    await screen.findByText("Recette B");

    fireEvent.click(screen.getByRole("button", { name: /j'aime/i }));

    expect(dispatchMock).toHaveBeenCalledWith({
      type: "ADD_LIKE",
      payload: { id: 55 },
    });
  });

  it("soumettre un commentaire déclenche dispatch ADD_COMMENT", async () => {
    const dispatchMock = vi.fn();

    render(
      <TestRecipesProvider
        initialRecipes={mockRecipes}
        dispatchMock={dispatchMock}
      >
        <RecipeDetail />
      </TestRecipesProvider>
    );

    await screen.findByText("Recette B");

    fireEvent.input(screen.getByPlaceholderText("Votre nom"), {
      target: { value: "Charlie" },
    });

    fireEvent.input(screen.getByPlaceholderText("Votre commentaire"), {
      target: { value: "Délicieux !" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /commenter/i }));

    expect(dispatchMock).toHaveBeenCalledWith({
      type: "ADD_COMMENT",
      payload: {
        id: 55,
        comment: { user: "Charlie", message: "Délicieux !" },
      },
    });
  });

  it("affiche les commentaires existants", async () => {
    render(
      <TestRecipesProvider initialRecipes={mockRecipes}>
        <RecipeDetail />
      </TestRecipesProvider>
    );

    await screen.findByText("Recette B");

    expect(screen.getByText("Commentaires (2)")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Top !")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Super recette")).toBeInTheDocument();
  });
});
