import { render, screen, fireEvent } from "@testing-library/preact";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import RecipeDelete from "../../../src/components/RecipeDelete";

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "2" }),
}));

const mockRecipes = [
  { id: 1, title: "Recette A", description: "Desc A" },
  { id: 2, title: "Recette B", description: "Desc B" },
];

let fetchSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  // Mock fetch
  fetchSpy = vi
    .spyOn(globalThis, "fetch" as any)
    .mockResolvedValue({
      ok: true,
      json: async () => mockRecipes.map((r) => ({ ...r })),
    } as any);

  // Mock alert
  vi.spyOn(window, "alert").mockImplementation(() => {});
});

afterEach(() => {
  fetchSpy?.mockRestore();
  vi.restoreAllMocks();
});

describe("RecipeDelete", () => {
  it("affiche 'Recette introuvable' si la recette n'existe pas", async () => {
    // On remplace useParams pour un id inexistant
    vi.doMock("react-router-dom", () => ({ useParams: () => ({ id: "999" }) }));

    // Re-import du composant avec le nouveau mock
    const { default: RecipeDeleteWithMissing } = await import(
      "../../../src/components/RecipeDelete"
    );

    render(<RecipeDeleteWithMissing />);

    expect(await screen.findByText("Recette introuvable")).toBeInTheDocument();
  });

  it("affiche la page de confirmation si la recette existe", async () => {
    render(<RecipeDelete />);

    expect(
      await screen.findByText("Êtes-vous sûr de vouloir supprimer cette recette ?")
    ).toBeInTheDocument();

    expect(screen.getByText("Recette B")).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledWith("/foodie-share/data/recipes.json");
  });

  it("affiche une alerte au clic sur 'Confirmer la suppression'", async () => {
    render(<RecipeDelete />);

    const btn = await screen.findByRole("button", { name: "Confirmer la suppression" });
    fireEvent.click(btn);

    expect(window.alert).toHaveBeenCalledWith(
      "Suppression non disponible en version statique."
    );
  });
});
