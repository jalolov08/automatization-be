import {
  createCategory,
  getCategories,
  updateCategory,
} from "controllers/category.controller";
import { Router } from "express";
import authenticate from "utils/authenticate";

const categoryRouter = Router();

categoryRouter.post("/", authenticate, createCategory);
categoryRouter.put("/:categoryId", authenticate, updateCategory);
categoryRouter.get("/", authenticate, getCategories);

export default categoryRouter;
