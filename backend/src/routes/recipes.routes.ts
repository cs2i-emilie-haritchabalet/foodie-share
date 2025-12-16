import { Request, Response, Router } from "express";
import recipes from "../data/recipes.json";

export const getRecipes = (_req: Request, res: Response) => {
  res.json(recipes);
};

export const getRecipeByTitle = (req: Request, res: Response) => {
  const { title } = req.params;

  const recipe = recipes.find(
    (r) => r.title.toLowerCase() === title.toLowerCase()
  );

  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }

  res.json(recipe);
  
};
export default Router 
