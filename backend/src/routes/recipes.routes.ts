import { Request, Response, Router } from "express";
import recipes from "../data/recipes.json";

const router = Router();

// Toutes les recettes
router.get("/all", (_req: Request, res: Response) => {
  res.json(recipes);
});

// Recettes les mieux notées
router.get("/best-rated", (_req: Request, res: Response) => {
  const sorted = [...recipes]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3); // 👈 limite à 3 recettes

  res.json(sorted);
});

// Recette par titre
router.get("/title/:title", (req: Request, res: Response) => {
  const { title } = req.params;

  const recipe = recipes.find(
    r => r.title.toLowerCase() === title.toLowerCase()
  );

  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }

  res.json(recipe);
});

// Recette par ID (TOUJOURS EN DERNIER)
router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const recipe = recipes[Number(id)];

  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }

  res.json(recipe);
});

// Like
router.post("/:id/like", (req: Request, res: Response) => {
  const recipe = recipes[Number(req.params.id)];
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });

  recipe.likes += 1;
  res.json({ likes: recipe.likes });
});

// Commentaire
router.post("/:id/comment", (req: Request, res: Response) => {
  const recipe = recipes[Number(req.params.id)];
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });

  recipe.comments ??= [];
  recipe.comments.push(req.body);

  res.json({ comments: recipe.comments });
});

export default router;
