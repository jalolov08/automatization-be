import dayjs from "dayjs";
import { Schema, model, Document, Types } from "mongoose";
import { IBatch } from "types/batch.type";

const BatchSchema = new Schema<IBatch>({
  productId: { type: Schema.Types.ObjectId, required: true },
  primeCost: { type: Number, required: true },
  quantity: { type: Number, required: true },
  residue: { type: Number, required: true },
  date: { type: String, required: true, default: () => dayjs().format("DD.MM.YYYY HH:mm"), },
});

const Batch = model<IBatch>("Batch", BatchSchema);
export default Batch;