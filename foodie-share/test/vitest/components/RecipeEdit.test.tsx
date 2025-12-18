import { render, screen, fireEvent } from "@testing-library/preact";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Router mocks
const navigateMock = vi.fn();
vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "1" }),
  useNavigate: () => navigateMock,
  useLocation: () => ({ state: { successMessage: "Recette modifiée !" } }),
  Link: ({ children }: any) => <span>{children}</span>,
}));

// ✅ Mock icons complet (inclut FaRegComment car ton composant l’utilise)
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
    .spyOn(globalThis, "fetch" as any)
    .mockResolvedValue({
      ok: true,
      json: async () => mockRecipes,
    } as any);

  vi.spyOn(window, "alert").mockImplementation(() => {});
  navigateMock.mockClear();
});

afterEach(() => {
  fetchSpy?.mockRestore();
  vi.restoreAllMocks();
});

describe("RecipeEdit (page détail)", () => {
  it("affiche la recette et le message de succès", async () => {
    const { default: RecipeDetails } = await import("../../../src/components/RecipeDetails"); 
    // ⚠️ Mets ici le chemin EXACT du composant que tu testes (vu que l’erreur mentionne RecipeDetails.tsx)

    render(<RecipeDetails />);

    expect(await screen.findByText("Tarte aux pommes")).toBeInTheDocument();
    expect(screen.getByText("Catégorie: Dessert")).toBeInTheDocument();
    expect(screen.getByText("Une tarte délicieuse")).toBeInTheDocument();

    expect(fetchSpy).toHaveBeenCalledWith("/foodie-share/data/recipes.json");
  });

  it("le bouton Retour appelle navigate(-1)", async () => {
    const { default: RecipeDetails } = await import("../../../src/components/RecipeDetails");
    render(<RecipeDetails />);
    await screen.findByText("Tarte aux pommes");

    fireEvent.click(screen.getByRole("button", { name: /retour/i }));
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });

  it("cliquer sur J'aime déclenche une alerte", async () => {
    const { default: RecipeDetails } = await import("../../../src/components/RecipeDetails");
    render(<RecipeDetails />);
    await screen.findByText("Tarte aux pommes");

    fireEvent.click(screen.getByRole("button", { name: /j'aime/i }));
    expect(window.alert).toHaveBeenCalled();
  });

  it("soumettre le commentaire déclenche une alerte", async () => {
    const { default: RecipeDetails } = await import("../../../src/components/RecipeDetails");
    render(<RecipeDetails />);
    await screen.findByText("Tarte aux pommes");

    fireEvent.click(screen.getByRole("button", { name: "Commenter" }));
    expect(window.alert).toHaveBeenCalled();
  });
});
