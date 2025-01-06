import { Request, Response } from "express";
import CategoryService from "services/category.service";
import UserService from "services/user.service";
import { NotFoundError, ForbiddenError } from "utils/errors";

export async function createCategory(req: Request, res: Response) {
  const { name } = req.body;
  const userId = req.user._id;

  if (!name) {
    res.status(400).json({ error: "Пожалуйста введите имя." });
    return;
  }

  try {
    const user = await UserService.getUserById(userId);
    const newCategory = await CategoryService.createCategory(user._id, name);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: "Не удалось создать категорию." });
  }
}

export async function updateCategory(req: Request, res: Response) {
  const { categoryId } = req.params;
  const { name } = req.body;
  const userId = req.user._id;

  try {
    const user = await UserService.getUserById(userId);
    const updatedCategory = await CategoryService.updateCategory(
      categoryId,
      name,
      user._id
    );
    res.status(200).json(updatedCategory);
  } catch (error: any) {
    console.log(error);

    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Не удалось обновить категорию." });
    return;
  }
}

export async function getCategories(req: Request, res: Response) {
  const userId = req.user._id;

  try {
    const user = await UserService.getUserById(userId);

    const categories = await CategoryService.getCategories(user._id);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Не удалось получить категории." });
  }
}
