import React, { useReducer } from "react";
import type { ReactNode } from "react";
import { render, screen, fireEvent } from "@testing-library/preact";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import RecipeDetail from "../../../src/components/RecipeDetails";
import { RecipesContext, recipesReducer } from "../../../src/context/RecipesContext";
import type {Recipe, Action} from "../../../src/context/RecipesContext";

// --- Données de test ---
const mockRecipes: Recipe[] = [
  {
    id: 2,
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

// --- Test provider pour injecter dispatch mock ---

interface TestRecipesProviderProps {
  children: ReactNode;
  initialRecipes?: Recipe[];
  dispatchMock?: (action: Action) => void;
}

export const TestRecipesProvider = ({
  children,
  initialRecipes = [],
  dispatchMock,
}: TestRecipesProviderProps) => {
  const [state, dispatch] = useReducer(recipesReducer, { recipes: initialRecipes });
  const contextValue = dispatchMock ? { state, dispatch: dispatchMock } : { state, dispatch };

  return (
    <RecipesContext.Provider value={contextValue}>
      {children}
    </RecipesContext.Provider>
  );
};

// --- Mocks router ---
const navigateMock = vi.fn();
vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "2" }),
  useNavigate: () => navigateMock,
}));

// --- Mocks icons ---
vi.mock("react-icons/fa", () => ({
  FaHeart: () => null,
  FaAngleDoubleLeft: () => null,
  FaRegComment: () => null,
}));

// --- Mock fetch global ---
let fetchSpy: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: true,
    json: async () => mockRecipes,
  } as Response);

  vi.clearAllMocks();
  navigateMock.mockClear();
});

afterEach(() => {
  fetchSpy?.mockRestore();
});

// --- Tests ---
describe("RecipeDetail", () => {
  it("affiche le chargement au départ", () => {
    render(<RecipeDetail />);
    expect(screen.getByText("Chargement...")).toBeInTheDocument();
  });

  it("charge la recette et affiche ses infos", async () => {
    render(<RecipeDetail />);

    expect(await screen.findByText("Recette B")).toBeInTheDocument();
    expect(screen.getByText("Catégorie: Dessert")).toBeInTheDocument();
    expect(screen.getByText("Desc B")).toBeInTheDocument();

    expect(screen.getByText("sucre")).toBeInTheDocument();
    expect(screen.getByText("farine")).toBeInTheDocument();
    expect(screen.getByText("melanger")).toBeInTheDocument();
    expect(screen.getByText("cuire")).toBeInTheDocument();

    expect(fetchSpy).toHaveBeenCalledWith("/data/recipes.json");
  });

  it("le bouton Retour appelle navigate(-1)", async () => {
    render(<RecipeDetail />);
    await screen.findByText("Recette B");

    fireEvent.click(screen.getByRole("button", { name: /retour/i }));
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });

  it("cliquer sur J'aime déclenche dispatch ADD_LIKE", async () => {
    const dispatchMock = vi.fn();

    render(
  <TestRecipesProvider initialRecipes={mockRecipes} dispatchMock={dispatchMock}>
    <RecipeDetail />
  </TestRecipesProvider>
);


    await screen.findByText("Recette B");

    const likeButton = screen.getByRole("button", { name: /j'aime/i });
    fireEvent.click(likeButton);

    expect(dispatchMock).toHaveBeenCalledWith({
      type: "ADD_LIKE",
      payload: { id: 2 },
    });
  });

  it("soumettre un commentaire déclenche dispatch ADD_COMMENT", async () => {
    const dispatchMock = vi.fn();

    render(
  <TestRecipesProvider initialRecipes={mockRecipes} dispatchMock={dispatchMock}>
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
        id: 2,
        comment: { user: "Charlie", message: "Délicieux !" },
      },
    });
  });

  it("affiche les commentaires existants", async () => {
    render(<RecipeDetail />);

    await screen.findByText("Recette B");

    expect(screen.getByText("Commentaires (2)")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Top !")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Super recette")).toBeInTheDocument();
  });
});
