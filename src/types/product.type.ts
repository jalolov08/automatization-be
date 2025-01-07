import { Document, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  owner: Types.ObjectId;
  categoryId: Types.ObjectId;
  categoryName: string;
  weight?: number;
  description?: string;
  date: string;
}
