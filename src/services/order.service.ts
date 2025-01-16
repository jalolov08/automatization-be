// import { Types } from "mongoose";
// import { IOrder } from "../types/order.type";
// import OrderModel from "../models/order.model";
// import batchService from "./batch.service";

// class OrderService {
//   updateOrder(orderId: string, arg1: any) {
//     throw new Error("Method not implemented.");
//   }
//   getOrdersByClientId(userObjectId: Types.ObjectId, pageNumber: number, limitNumber: number, arg3: string, arg4: string, arg5: string, arg6: string, arg7: string): { orders: any; totalCount: any; } | PromiseLike<{ orders: any; totalCount: any; }> {
//     throw new Error("Method not implemented.");
//   }

//   async createOrder({clientId, orderType, type, products}): Promise<IOrder> {
//     if (type === "purchase") {
//       if (orderData.products && Array.isArray(orderData.products)) {
//         for (const product of orderData.products) {
//           const batchData = {
//             productId: product.productId,
//             primeCost: product.price,
//             quantity: product.quantity,
//             residue: product.quantity,
//           };
//           console.log('product.productId',product.productId);

//           await batchService.createBatch(batchData);
//         }
//       }
//     } else if (orderData.type === "sale") {
//       if (orderData.products && Array.isArray(orderData.products)) {        
//         for (const product of orderData.products) {
//           const { success, message } = await batchService.sellFromBatches(product.productId, product.quantity);
//           if (!success) {
//             throw new Error(`Failed to create order: ${message}`);
//           }
//         }
//       }
//     } else {
//       throw new Error("Invalid order type. Must be 'purchase' or 'sale'.");
//     }

//     const newOrder = new OrderModel(orderData);
//     return await newOrder.save();
//   }


//   async updateOrder(orderId: string, updateData: Partial<IOrder>): Promise<IOrder> {
//     const order = await OrderModel.findById(orderId);

//     if (!order) {
//       throw new Error("Order not found");
//     }

//     Object.assign(order, updateData);
//     return await order.save();
//   }

//   async getOrdersByClientId(
//     clientId: Types.ObjectId,
//     page: number,
//     limit: number,
//     sortBy: string,
//     sortOrder: string,
//     search: string,
//     startDate: string,
//     endDate: string
//   ): Promise<{ orders: IOrder[]; totalCount: number }> {

//     const query: any = { clientId };

//     if (search) {
//       query["$text"] = { $search: search };
//     }

//     if (startDate && endDate) {
//       query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
//     }

//     const orders = await OrderModel.find(query)
//       .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
//       .skip((page - 1) * limit)
//       .limit(limit);

//     const totalCount = await OrderModel.countDocuments(query);

//     return { orders, totalCount };
//   }

//   async getOrderById(orderId: string): Promise<IOrder | null> {
//     return await OrderModel.findById(orderId);
//   }
// }

// export default new OrderService();
import { Types } from "mongoose";
import { IOrder } from "../types/order.type";
import OrderModel from "../models/order.model";
import batchService from "./batch.service";
import ClientModel from "models/client.model";

class OrderService {
  async createOrder(orderData: {
    clientId: Types.ObjectId;
    orderType: "purchase" | "sale";
    type: string;
    products: {
      productId: Types.ObjectId;
      price: number;
      quantity: number;
    }[];
  }): Promise<IOrder> {
    if (!orderData.products || !Array.isArray(orderData.products)) {
      throw new Error("Products must be an array.");
    }
    const client = await ClientModel.findById(orderData.clientId)
    if (!client) {
      throw new Error('Client 404')
    }
    let totalCost = 0;
    let totalProfit = 0;
    if (orderData.type === "purchase") {
      for (const product of orderData.products) {
        const batchData = {
          productId: product.productId,
          primeCost: product.price,
          quantity: product.quantity,
          residue: product.quantity,
        };
        console.log("Processing purchase for productId:", product.productId);
        totalCost += product.price * product.quantity;
        await batchService.createBatch(batchData);
        client.totalPurchaseAmount += totalCost;
        client.debt.totalCompanyDebt += totalCost;
      }
    } else if (orderData.type === "sale") {
      for (const product of orderData.products) {
        const { success, message, profit } = await batchService.sellFromBatches(
          product.productId,
          product.quantity,
          product.price
        );
        if (!success) {
          throw new Error(`Failed to create order: ${message}`);
        }
        if (profit) {
          totalProfit += profit
        }

        totalCost += product.price * product.quantity;
        client.totalsaleAmount += totalCost;
        client.debt.totalClientDebt += totalCost;
      }
    } else {
      throw new Error("Invalid order type. Must be 'purchase' or 'sale'.");
    }
    await client.save()

    const newOrder = new OrderModel({ ...orderData, totalCost, clientName: client.fullName, profit: totalProfit });
    return await newOrder.save();
  }

  async updateOrder(
    orderId: string,
    updateData: Partial<IOrder>
  ): Promise<IOrder> {
    const order = await OrderModel.findById(orderId);

    if (!order) {
      throw new Error("Order not found.");
    }

    Object.assign(order, updateData);
    return await order.save();
  }

  async getOrdersByClientId(
    clientId: Types.ObjectId,
    page = 1,
    limit = 10,
    sortBy = "date",
    sortOrder: "asc" | "desc" = "asc",
    search = "",
    startDate?: string,
    endDate?: string
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
