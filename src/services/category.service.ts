import Category from "models/category.model";
import { Types } from "mongoose";
import { ICategory } from "types/category.type";
import { NotFoundError, ForbiddenError } from "utils/errors";

class CategoryService {
  async createCategory(
    ownerId: Types.ObjectId,
    name: string
  ): Promise<ICategory> {
    const category = new Category({
      name,
      owner: ownerId,
    });

    await category.save();
    return category;
  }

  async updateCategory(
    categoryId: string,
    name: string,
    userId: Types.ObjectId
  ): Promise<ICategory> {
    const category = await Category.findById(categoryId);

    if (!category) {
      throw new NotFoundError("Категория не найдена.");
    }

    if (category.owner.toString() !== userId.toString()) {
      throw new ForbiddenError(
        "У вас нет прав для редактирования этой категории."
      );
    }

    category.name = name;
    await category.save();

    return category;
  }

  async getCategories(ownerId: Types.ObjectId): Promise<ICategory[]> {
    const categories = await Category.find({ owner: ownerId });

    return categories;
  }
}

export default new CategoryService();
