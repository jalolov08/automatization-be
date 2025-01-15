import dayjs from "dayjs";
import { Schema, model } from "mongoose";
import { IProduct } from "types/product.type";

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    categoryName: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    residue: {
      type: Number,
      required: true,
      default: 0,
    },
    date: {
      type: String,
      required: true,
      default: () => dayjs().format("DD.MM.YYYY HH:mm"),
    },
  },
  { timestamps: true }
);

const Product = model<IProduct>("Product", ProductSchema);

export default Product;
