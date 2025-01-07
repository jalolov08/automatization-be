import {
  createProduct,
  getMyProducts,
  updateProduct,
} from "controllers/product.controller";
import { Router } from "express";
import authenticate from "utils/authenticate";

const productRouter = Router();

productRouter.post("/", authenticate, createProduct);
productRouter.put("/:productId", authenticate, updateProduct);
productRouter.get("/", authenticate, getMyProducts);

export default productRouter;
