import { Document, Types } from "mongoose";

export enum ClientStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface IClient extends Document {
  fullName?: string;
  contactInfo: {
    phone: string;
  };
  status: ClientStatus;
  debt: {
    totalClientDebt: number;
    totalCompanyDebt: number;
  };
  totalPurchaseAmount: number;
  totalsaleAmount: number;
}
