import { Document, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  owner: Types.ObjectId;
  date: string;
}
