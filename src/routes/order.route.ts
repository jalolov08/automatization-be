import {
  createOrder,
  updateOrder,
  getMyOrders
} from "controllers/order.controller";
import { Router } from "express";
import authenticate from "utils/authenticate";

const orderRouter = Router();

orderRouter.post("/", authenticate, createOrder);
orderRouter.put("/:orderId", authenticate, updateOrder);
orderRouter.get("/", authenticate, getMyOrders);

export default orderRouter;
