import { render, screen, fireEvent } from "@testing-library/preact";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import RecipeDetail from "../../../src/components/RecipeDetails";

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
    .spyOn(globalThis, "fetch" as any)
    .mockResolvedValue({
      ok: true,
      json: async () =>
        mockRecipes.map((r) => ({
          ...r,
          comments: r.comments?.map((c) => ({ ...c })) ?? [],
        })),
    } as any);

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

  it("le bouton J'aime affiche une alerte", async () => {
    render(<RecipeDetail />);
    await screen.findByText("Recette B");

    fireEvent.click(screen.getByRole("button", { name: /j'aime/i }));

    // ✅ window.alert est mocké dans ton setup.ts, donc ici on l'utilise direct
    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith(
      "Impossible d'aimer une recette en version statique."
    );
  });

  it("soumettre un commentaire affiche une alerte et vide les champs", async () => {
    render(<RecipeDetail />);
    await screen.findByText("Recette B");

    const nameInput = screen.getByPlaceholderText("Votre nom") as HTMLInputElement;
    const msgInput = screen.getByPlaceholderText("Votre commentaire") as HTMLTextAreaElement;

    // ✅ avec Preact, mieux: fireEvent.input + target.value
    fireEvent.input(nameInput, { target: { value: "Kevin" } });
    fireEvent.input(msgInput, { target: { value: "Hello" } });

    expect(nameInput.value).toBe("Kevin");
    expect(msgInput.value).toBe("Hello");

    // ✅ soumission robuste : submit du FORM (pas juste click bouton)
    const form = nameInput.closest("form");
    expect(form).toBeTruthy();
    fireEvent.submit(form!);

    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith("Commentaire simulé (non enregistré)");

    // champs remis à zéro
    expect(nameInput.value).toBe("");
    expect(msgInput.value).toBe("");
  });

  it("affiche les commentaires s'il y en a", async () => {
    render(<RecipeDetail />);
    await screen.findByText("Recette B");

    expect(screen.getByText("Commentaires (2)")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Top !")).toBeInTheDocument();
  });
});
