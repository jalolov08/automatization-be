import { Schema, model } from "mongoose";
import { IClient, ClientStatus } from "../types/client.type";
import dayjs from "dayjs";

const ClientSchema = new Schema<IClient>({
  fullName: { type: String, required: false },
  contactInfo: {
    phone: { type: String, required: true },
    email: { type: String, required: false },
    address: { type: String, required: false },
  },
  status: {
    type: String,
    enum: Object.values(ClientStatus),
    required: true,
    default: ClientStatus.ACTIVE,
  },
  debt: {
    totalDebt: { type: Number, required: true, default: 0 },
    transactions: [
      {
        purchaseId: { type: Schema.Types.ObjectId, required: true, ref: "Purchase" },
        amount: { type: Number, required: true },
        date: { type: String, required: true, default: () => dayjs().format("DD.MM.YYYY HH:mm"), },
      },
    ],
  },
  totalPurchases: {
    totalCount: { type: Number, required: true, default: 0 },
    wholesaleCount: { type: Number, required: true, default: 0 },
    retailCount: { type: Number, required: true, default: 0 },
  },
}, {
  timestamps: true,
});

const ClientModel = model<IClient>("Client", ClientSchema);

export default ClientModel;
