import { Request, Response } from "express";
import ProductService from "services/product.service";
import { ForbiddenError, NotFoundError } from "utils/errors";
import {
  createProductSchema,
  updateProductSchema,
} from "validation/product.validation";

export async function createProduct(req: Request, res: Response) {
  const userId = req.user._id;
  const productData = req.body;

  const { error } = createProductSchema.validate(productData);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }

  try {
    const newProduct = await ProductService.createProduct(productData, userId);

    res.status(201).json({
      message: "Продукт успешно создан",
      product: newProduct,
    });
  } catch (error: any) {
    console.log("Ошибка при добавление продукта", error);
    console.log(error);

    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }

    res.status(500).json({
      error: error.message,
    });
  }
}
export async function updateProduct(req: Request, res: Response) {
  const userId = req.user._id;
  const { productId } = req.params;
  const productData = req.body;

  const { error } = updateProductSchema.validate(productData);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }

  try {
    const updatedProduct = await ProductService.updateProduct(
      productId,
      productData,
      userId
    );

    res.status(200).json({
      message: "Продукт успешно обновлен",
      product: updatedProduct,
    });
  } catch (error: any) {
    console.log("Ошибка при обновлении продукта", error);
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }

    res.status(500).json({
      error: error.message,
    });
  }
}
export async function getMyProducts(req: Request, res: Response) {
  const userId = req.user._id;

  const {
    page = 1,
    limit = 10,
    sortBy = "date",
    sortOrder = "desc",
    search = "",
    startDate,
    endDate,
  } = req.query;

  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);

  try {
    const { products, totalCount } = await ProductService.getMyProducts(
      userId,
      pageNumber,
      limitNumber,
      sortBy as string,
      sortOrder as string,
      search as string,
      startDate as string,
      endDate as string
    );

    res.status(200).json({
      message: "Продукты успешно получены",
      products,
      pagination: {
        totalCount,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
        pageSize: limitNumber,
      },
    });
  } catch (error: any) {
    console.log("Ошибка при получении продуктов:", error);
    res.status(500).json({
      error: "Ошибка при получении продуктов",
    });
  }
}
