import React from "react";
import { render, screen, fireEvent } from "@testing-library/preact";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import RecipeForm from "../../../src/components/RecipeForm";

// mock react-router-dom
const navigateMock = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
}));

beforeEach(() => {
  navigateMock.mockClear();
  vi.spyOn(window, "alert").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("RecipeForm", () => {
  it("ajoute un ingrédient quand on clique sur 'Ajouter ingrédient'", async () => {
    const onRecipeAdded = vi.fn();
    render(<RecipeForm onRecipeAdded={onRecipeAdded} />);

    const ingredientInput = screen.getByPlaceholderText("Ajouter un ingrédient") as HTMLInputElement;
    fireEvent.input(ingredientInput, { target: { value: "sucre" } });

    fireEvent.click(screen.getByRole("button", { name: "Ajouter ingrédient" }));

    expect(await screen.findByText("sucre")).toBeInTheDocument();
    expect(ingredientInput.value).toBe(""); // reset après ajout
  });

  it("ajoute une étape quand on clique sur 'Ajouter étape'", async () => {
    const onRecipeAdded = vi.fn();
    render(<RecipeForm onRecipeAdded={onRecipeAdded} />);

    const stepInput = screen.getByPlaceholderText("Ajouter une étape") as HTMLInputElement;
    fireEvent.input(stepInput, { target: { value: "Cuire 20 minutes" } });

    fireEvent.click(screen.getByRole("button", { name: "Ajouter étape" }));

    expect(await screen.findByText("Cuire 20 minutes")).toBeInTheDocument();
    expect(stepInput.value).toBe(""); // reset après ajout
  });

  it("au submit: affiche une alerte, appelle onRecipeAdded et navigate avec state", async () => {
    const onRecipeAdded = vi.fn();
    render(<RecipeForm onRecipeAdded={onRecipeAdded} />);

    // champs requis
    const title = screen.getByPlaceholderText("Titre") as HTMLInputElement;
    const desc = screen.getByPlaceholderText("Description") as HTMLTextAreaElement;

    fireEvent.input(title, { target: { value: "Tarte" } });
    fireEvent.input(desc, { target: { value: "Super tarte" } });

    // submit
    fireEvent.click(screen.getByRole("button", { name: "Ajouter la recette (simulation)" }));

    expect(window.alert).toHaveBeenCalled();
    expect(onRecipeAdded).toHaveBeenCalledTimes(1);

    expect(navigateMock).toHaveBeenCalledWith("/foodie-share/all", {
      state: { successMessage: "Ajout simulé (sans backend)" },
    });
  });
});
