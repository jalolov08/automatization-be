import { Document, Types } from "mongoose";

export enum ClientStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface IClient extends Document {
  fullName?: string;
  contactInfo: {
    phone: string;
    email?: string;
    address?: string;
  };
  status: ClientStatus;
  debt: {
    totalDebt: number;
    transactions: {
      purchaseId: Types.ObjectId;
      amount: number;
      date: string;
    }[];
  };
  totalPurchases: {
    totalCount: number;
    wholesaleCount: number;
    retailCount: number;
  };
}
