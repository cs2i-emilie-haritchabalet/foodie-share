import { Request, Response } from "express";
import users from "../data/users.json";

export const getUsers = (_req: Request, res: Response) => {
  res.json(users);
};
