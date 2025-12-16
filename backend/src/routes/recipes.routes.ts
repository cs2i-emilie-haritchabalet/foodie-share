import { Request, Response, Router } from "express";
import recipes from "../data/recipes.json";

const router = Router();

// Récupérer toutes les recettes
router.get("/all", (_req: Request, res: Response) => {
  res.json(recipes);
});

// Récupérer la recette par ID
router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const recipe = recipes.find((r: any, index: number) => index.toString() === id);

  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }

  res.json(recipe);
});

// Récupérer la recette par titre
router.get("/title/:title", (req: Request, res: Response) => {
  const { title } = req.params;
  const recipe = recipes.find(
    (r: any) => r.title.toLowerCase() === title.toLowerCase()
  );

  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }

  res.json(recipe);
});

// Récupérer les recettes les mieux notées
router.get("/best-rated", (_req, res) => {
  const sorted = [...recipes].sort((a, b) => b.likes - a.likes);
  res.json(sorted);
});


// Exemple d'ajout de like
router.post("/:id/like", (req: Request, res: Response) => {
  const { id } = req.params;
  const recipe = recipes[parseInt(id)];
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });

  recipe.likes += 1;
  res.json({ likes: recipe.likes });
});

// Exemple d'ajout de commentaire
router.post("/:id/comment", (req: Request, res: Response) => {
  const { id } = req.params;
  const { user, message } = req.body;

  const recipe = recipes[parseInt(id)];
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });

  if (!recipe.comments) recipe.comments = [];
  recipe.comments.push({ user, message });

  res.json({ comments: recipe.comments });
});

export default router;
