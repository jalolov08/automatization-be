import { Schema, model } from "mongoose";
import { IOrder, OrderType, DeliveryConditions, OrderStatus } from "../types/order.type";
import dayjs from "dayjs";

const ProductSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
    deliveryConditions: {
      type: String,
      enum: Object.values(DeliveryConditions),
      required: true,
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