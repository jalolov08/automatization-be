import Category from "models/category.model";
import Product from "../models/product.model";
import {
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from "../utils/errors";
import { IProduct } from "types/product.type";
import { Types } from "mongoose";

class ProductService {
  async createProduct(data: Partial<IProduct>, userId: string) {
    try {
      const category = await Category.findById(data.categoryId);
      if (!category) {
        throw new NotFoundError("Категория не найдена");
      }

      if (category.owner.toString() !== userId) {
        throw new ForbiddenError(
          "У вас нет прав на создание продукта в этой категории"
        );
      }

      const newProduct = new Product({
        name: data.name,
        owner: userId,
        categoryId: category._id,
        categoryName: category.name,
        weight: data.weight,
        description: data.description,
      });

      await newProduct.save();

      return newProduct;
    } catch (err: any) {
      throw new InternalServerError(
        "Ошибка при создании продукта: " + err.message
      );
    }
  }
  async updateProduct(
    productId: string,
    data: Partial<IProduct>,
    userId: string
  ) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new NotFoundError("Продукт не найден");
      }

      if (product.owner.toString() !== userId) {
        throw new ForbiddenError("У вас нет прав на обновление продукта ");
      }

      if (
        data.categoryId &&
        data.categoryId.toString() !== product.categoryId.toString()
      ) {
        const category = await Category.findById(data.categoryId);
        if (!category) {
          throw new NotFoundError("Категория не найдена");
        }

        if (category.owner.toString() !== userId) {
          throw new ForbiddenError(
            "У вас нет прав на обновление продукта в этой категории"
          );
        }

        product.categoryName = category.name;
        product.categoryId = new Types.ObjectId(category._id as string);
      }

      product.name = data.name || product.name;
      product.description = data.description || product.description;
      product.weight = data.weight || product.weight;

      await product.save();

      return product;
    } catch (err: any) {
      throw new InternalServerError(
        "Ошибка при обновлении продукта: " + err.message
      );
    }
  }

  async getMyProducts(
    userId: string,
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: string,
    search: string,
    startDate: string,
    endDate: string
  ) {
    const sort = sortOrder === "asc" ? 1 : -1;

    const filter: any = { owner: userId };

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (startDate) {
      filter.date = {
        $gte: startDate,
      };
    }

    if (endDate) {
      filter.date = {
        $lte: endDate,
      };
    }
    try {
      const totalCount = await Product.countDocuments(filter);

      const products = await Product.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ [sortBy]: sort });

      return { products, totalCount };
    } catch (err: any) {
      throw new Error("Ошибка при получении продуктов: " + err.message);
    }
  }
}

export default new ProductService();
