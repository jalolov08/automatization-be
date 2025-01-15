import { Types } from "mongoose";
import { IOrder } from "../types/order.type";
import OrderModel from "../models/order.model";
import batchService from "./batch.service";

class OrderService {

  async createOrder(orderData: Partial<IOrder>): Promise<IOrder> {
    if (orderData.type === "purchase") {
      if (orderData.products && Array.isArray(orderData.products)) {
        for (const product of orderData.products) {
          const batchData = {
            productId: product.productId,
            primeCost: product.price,
            quantity: product.quantity,
            residue: product.quantity,
          };
          console.log('product.productId',product.productId);
          
          await batchService.createBatch(batchData);
        }
      }
    } else if (orderData.type === "sale") {
      if (orderData.products && Array.isArray(orderData.products)) {        
        for (const product of orderData.products) {
          const { success, message } = await batchService.sellFromBatches(product.productId, product.quantity);
          if (!success) {
            throw new Error(`Failed to create order: ${message}`);
          }
        }
      }
    } else {
      throw new Error("Invalid order type. Must be 'purchase' or 'sale'.");
    }
  
    const newOrder = new OrderModel(orderData);
    return await newOrder.save();
  }
  

  async updateOrder(orderId: string, updateData: Partial<IOrder>): Promise<IOrder> {
    const order = await OrderModel.findById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    Object.assign(order, updateData);
    return await order.save();
  }

  async getOrdersByClientId(
    clientId: Types.ObjectId,
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: string,
    search: string,
    startDate: string,
    endDate: string
  ): Promise<{ orders: IOrder[]; totalCount: number }> {

    const query: any = { clientId };

    if (search) {
      query["$text"] = { $search: search };
    }

    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const orders = await OrderModel.find(query)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCount = await OrderModel.countDocuments(query);

    return { orders, totalCount };
  }

  async getOrderById(orderId: string): Promise<IOrder | null> {
    return await OrderModel.findById(orderId);
  }
}

export default new OrderService();
