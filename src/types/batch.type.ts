import { Document, Types } from "mongoose";

export interface IBatch extends Document {
  productId: Types.ObjectId;
  primeCost: number;
  quantity: number;
  residue: number;
  date: string;
}
