import { Router } from "express";
import usersRoutes from "./users.routes";
import recipesRoutes from "./recipes.routes";

const router = Router();

router.use("/users", usersRoutes);
router.use("/recipes", recipesRoutes);

export default router;
