import React from "react";
import { render, screen, fireEvent } from "@testing-library/preact";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import RecipeDetail from "../../../src/components/RecipeDetails";
import { RecipesProvider } from '../../../src/context/RecipesContext';

// Mock router
const navigateMock = vi.fn();
vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "2" }),
  useNavigate: () => navigateMock,
}));

// Mock icons (stabilité tests)
vi.mock("react-icons/fa", () => ({
  FaHeart: () => null,
  FaAngleDoubleLeft: () => null,
  FaRegComment: () => null,
}));

type Recipe = {
  id: number;
  title: string;
  description: string;
  tag: string;
  ingredients: string[];
  steps: string[];
  likes: number;
  imagePath?: string;
  comments?: { user: string; message: string }[];
};

const mockRecipes: Recipe[] = [
  {
    id: 1,
    title: "Recette A",
    description: "Desc A",
    tag: "Plat",
    ingredients: ["ing1"],
    steps: ["step1"],
    likes: 10,
    comments: [],
  },
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

let fetchSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  // fetch mock
  fetchSpy = vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValue({
      ok: true,
      json: async () =>
        mockRecipes.map((r) => ({
          ...r,
          comments: r.comments?.map((c) => ({ ...c })) ?? [],
        })),
    } as Response);

  // on reset juste les mocks
  vi.clearAllMocks();
  navigateMock.mockClear();
});

afterEach(() => {
  fetchSpy?.mockRestore();
});

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

    expect(fetchSpy).toHaveBeenCalledWith("/foodie-share/data/recipes.json");
  });

  it("le bouton Retour appelle navigate(-1)", async () => {
    render(<RecipeDetail />);
    await screen.findByText("Recette B");

    fireEvent.click(screen.getByRole("button", { name: /retour/i }));
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });

it("cliquer sur J'aime incrémente le nombre de likes", async () => {
  render(
    <RecipesProvider>
      <RecipeDetail />
    </RecipesProvider>
  );

  // attendre que la recette charge
  const likeElement = await screen.findByText(/10/i);

  const initialLikes = Number(likeElement.textContent);
  const likeButton = screen.getByRole("button", { name: /j'aime/i });

  fireEvent.click(likeButton);

  expect(
    await screen.findByText(String(initialLikes + 1))
  ).toBeInTheDocument();
});


it("soumettre un commentaire l'ajoute à la liste", async () => {
  render(
    <RecipesProvider>
      <RecipeDetail />
    </RecipesProvider>
  );

  await screen.findByText("Salade"); // recette chargée

  fireEvent.input(screen.getByPlaceholderText("Votre nom"), {
    target: { value: "Alice" },
  });

  fireEvent.input(screen.getByPlaceholderText("Votre commentaire"), {
    target: { value: "Super recette !" },
  });

  fireEvent.submit(screen.getByRole("button", { name: /commenter/i }));

  expect(await screen.findByText("Alice")).toBeInTheDocument();
  expect(await screen.findByText("Super recette !")).toBeInTheDocument();
});


  it("affiche les commentaires s'il y en a", async () => {
    render(<RecipeDetail />);
    await screen.findByText("Recette B");

    expect(screen.getByText("Commentaires (2)")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Top !")).toBeInTheDocument();
  });
});
