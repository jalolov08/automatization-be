import { Document, Types } from "mongoose";

export enum Type {
  PURCHASE = "purchase",
  SALE = "sale",
}

export enum OrderType {
  SINGLE = "single",
  BULK = "bulk",
}

export enum DeliveryConditions {
  PICKUP = "pickup",
  COURIER = "courier",
}

export enum OrderStatus {
  PROCESSING = "processing",
  COMPLETED = "completed",
  CANCELED = "canceled",
}

export interface IOrder extends Document {
  clientId: Types.ObjectId;
  clientName: string;
  owner: Types.ObjectId;
  orderType: OrderType;
  type: Type;
  date: string;
  products: {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  totalCost: number;
  profit: number;
  deliveryConditions: DeliveryConditions;
  status: OrderStatus;
}
