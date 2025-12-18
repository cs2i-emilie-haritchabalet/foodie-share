import { render, screen, fireEvent } from "@testing-library/preact";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import RecipeDetails from "../../../src/components/RecipeDetails";

// Router mocks
const navigateMock = vi.fn();
vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "1" }),
  useNavigate: () => navigateMock,
  useLocation: () => ({ state: { successMessage: "Recette modifiée !" } }),
  Link: ({ children }: any) => <span>{children}</span>,
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
    .spyOn(globalThis, "fetch" as any)
    .mockResolvedValue({
      ok: true,
      json: async () =>
        mockRecipes.map((r) => ({
          ...r,
          comments: r.comments?.map((c) => ({ ...c })),
        })),
    } as any);

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
    expect(screen.getByText("Recette modifiée !")).toBeInTheDocument();

    expect(fetchSpy).toHaveBeenCalledWith("/foodie-share/data/recipes.json");
  });

  it("le bouton Retour appelle navigate(-1)", async () => {
    render(<RecipeDetails />);
    await screen.findByText("Tarte aux pommes");

    fireEvent.click(screen.getByRole("button", { name: /retour/i }));
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });

  it("cliquer sur J'aime déclenche une alerte", async () => {
    render(<RecipeDetails />);
    await screen.findByText("Tarte aux pommes");

    fireEvent.click(screen.getByRole("button", { name: /j'aime/i }));

    expect(globalThis.alert).toHaveBeenCalledTimes(1);
    expect(globalThis.alert).toHaveBeenCalledWith(
      "Impossible d'aimer une recette en version statique."
    );
  });

  it("soumettre le commentaire déclenche une alerte", async () => {
    render(<RecipeDetails />);
    await screen.findByText("Tarte aux pommes");

    const btn = screen.getByRole("button", { name: "Commenter" });
    const form = btn.closest("form");
    expect(form).toBeTruthy();

    fireEvent.submit(form!);

    expect(globalThis.alert).toHaveBeenCalledTimes(1);
    expect(globalThis.alert).toHaveBeenCalledWith(
      "Commentaire simulé (non enregistré)"
    );
  });
});
