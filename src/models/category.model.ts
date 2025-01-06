import { Schema, model } from "mongoose";
import { ICategory } from "types/category.type";
import dayjs from "dayjs";

const CategorySchema = new Schema<ICategory>(
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
    date: {
      type: String,
      required: true,
      default: () => dayjs().format("DD.MM.YYYY HH:mm"),
    },
  },
  { timestamps: true }
);

const Category = model<ICategory>("Category", CategorySchema);

export default Category;
