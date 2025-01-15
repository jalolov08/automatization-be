import { NotFoundError } from "utils/errors";
import BatchModel from "../models/batch.model";
import ProductModel from "../models/product.model";
import { IBatch } from "../types/batch.type";
import { Types } from "mongoose";

class BatchService {

  async createBatch(batchData: Partial<IBatch>): Promise<IBatch> {
    const product = await ProductModel.findById(batchData.productId);
    if (!product) {
      throw new NotFoundError("Product associated with the batch not found.");
    }
    console.log('batchData', batchData);

    const newBatch = new BatchModel(batchData);
    await newBatch.save();

    product.residue = (product.residue || 0) + (batchData.residue || 0);
    await product.save();
    return newBatch;
  }

  async getBatches(): Promise<IBatch[]> {
    return await BatchModel.find();
  }
  async sellFromBatches(productId: Types.ObjectId, quantity: number): Promise<{ success: boolean; message: string }> {
    const batches = await BatchModel.find({ productId, residue: { $gt: 0 } }).sort({ date: 1 });
    console.log('batches', batches);

    if (batches.length == 0) {
      throw new NotFoundError("No batches available for the specified product.");
    }

    let remainingQuantity = quantity;

    for (const batch of batches) {
      if (remainingQuantity <= 0) break;

      if (batch.residue >= remainingQuantity) {
        batch.residue -= remainingQuantity;
        remainingQuantity = 0;
      } else {
        remainingQuantity -= batch.residue;
        batch.residue = 0;
      }

      await batch.save();
    }

    if (remainingQuantity > 0) {
      return { success: false, message: `Not enough stock for product ${productId}. Remaining quantity: ${remainingQuantity}` };
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      throw new NotFoundError("Product associated with the batches not found.");
    }

    product.residue = (product.residue || 0) - quantity;
    if (product.residue < 0) {
      product.residue = 0;
    }

    await product.save();

    return { success: true, message: "Stock sold successfully." };
  }

}

export default new BatchService();
