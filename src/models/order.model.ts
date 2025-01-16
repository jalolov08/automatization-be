import { Schema, model } from "mongoose";
import { IOrder, OrderType, DeliveryConditions, OrderStatus } from "../types/order.type";
import dayjs from "dayjs";
import { string } from "joi";

const ProductSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    clientName: { type: String, required: true },
    orderType: {
      type: String,
      enum: Object.values(OrderType),
      required: true,
    },
    date: {
      type: String,
      required: true,
      default: () => dayjs().format("DD.MM.YYYY HH:mm"),
    },
    products: { type: [ProductSchema], required: true },
    totalCost: { type: Number, required: true },
    profit: { type: Number, required: true },
    deliveryConditions: {
      type: String,
      enum: Object.values(DeliveryConditions),
      required: true,
      default: DeliveryConditions.COURIER
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      required: true,
      default: OrderStatus.PROCESSING,
    },
  },
  {
    timestamps: true,
  }
);

const Order = model<IOrder>("Order", OrderSchema);
export default Order;