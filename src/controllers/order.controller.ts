import { Request, Response } from "express";
import OrderService from "services/order.service";
import UserService from "services/user.service";
import { ForbiddenError, NotFoundError } from "utils/errors";
import {
  createOrderSchema,
  updateOrderSchema,
} from "../validation/order.validation";
import { Types } from "mongoose";
import Order from "models/order.model";

export async function createOrder(req: Request, res: Response) {
  const userId = req.user._id;
  const { clientId, orderType, type, products } = req.body;

  const { error } = createOrderSchema.validate({
    clientId,
    orderType,
    type,
    products,
  });
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }

  try {
    const newOrder = await OrderService.createOrder({
      owner: userId,
      clientId,
      orderType,
      type,
      products,
    });

    res.status(201).json({
      message: "Заказ успешно создан",
      order: newOrder,
    });
  } catch (error: any) {
    console.log("Ошибка при создании заказа:", error);

    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }

    res.status(500).json({
      error: "Ошибка при создании заказа",
    });
  }
}

export async function updateOrder(req: Request, res: Response) {
  const userId = req.user._id;
  const { orderId } = req.params;
  const orderData = req.body;

  const { error } = updateOrderSchema.validate(orderData);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }

  try {
    const user = await UserService.getUserById(userId);
    const updatedOrder = await OrderService.updateOrder(orderId, {
      ...orderData,
      clientId: user._id,
    });

    res.status(200).json({
      message: "Заказ успешно обновлен",
      order: updatedOrder,
    });
  } catch (error: any) {
    console.log("Ошибка при обновлении заказа:", error);

    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }

    res.status(500).json({
      error: "Ошибка при обновлении заказа",
    });
  }
}

export async function getMyOrders(req: Request, res: Response) {
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
    const userObjectId = new Types.ObjectId(userId);

    const { orders, totalCount } = await OrderService.getOrdersByOwner(
      userObjectId,
      pageNumber,
      limitNumber,
      sortBy as string,
      sortOrder as "asc" | "desc",
      search as string,
      startDate as string,
      endDate as string
    );

    res.status(200).json({
      message: "Заказы успешно получены",
      orders,
      pagination: {
        totalCount,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
        pageSize: limitNumber,
      },
    });
  } catch (error: any) {
    console.log("Ошибка при получении заказов:", error);

    res.status(500).json({
      error: "Ошибка при получении заказов",
    });
  }
}
export async function getClientOrders(req: Request, res: Response) {
  const userId = req.params.id;

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
    const userObjectId = new Types.ObjectId(userId);

    const { orders, totalCount } = await OrderService.getOrdersByClientId(
      userObjectId,
      pageNumber,
      limitNumber,
      sortBy as string,
      sortOrder as "asc" | "desc",
      search as string,
      startDate as string,
      endDate as string
    );

    res.status(200).json({
      message: "Заказы успешно получены",
      orders,
      pagination: {
        totalCount,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
        pageSize: limitNumber,
      },
    });
  } catch (error: any) {
    console.log("Ошибка при получении заказов:", error);

    res.status(500).json({
      error: "Ошибка при получении заказов",
    });
  }
}
