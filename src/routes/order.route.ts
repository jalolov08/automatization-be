import {
  createOrder,
  updateOrder,
  getMyOrders,
  getClientOrders,
} from "controllers/order.controller";
import { Router } from "express";
import authenticate from "utils/authenticate";

const orderRouter = Router();

orderRouter.post("/", authenticate, createOrder);
orderRouter.put("/:orderId", authenticate, updateOrder);
orderRouter.get("/my/", authenticate, getMyOrders);
orderRouter.get("/client/:id", getClientOrders);

export default orderRouter;
