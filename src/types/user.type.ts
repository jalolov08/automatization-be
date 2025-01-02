import { Document, Types } from "mongoose";

export enum UserRole {
  ADMIN = "admin",
  CASHIER = "cashier",
  EMPLOYEE = "employee",
  WAREHOUSE_MANAGER = "warehouse_manager",
  MANAGER = "manager",
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  phone?: string;
  avatar?: string;
}
