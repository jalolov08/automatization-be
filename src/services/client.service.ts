import { Types } from "mongoose";
import { IClient } from "../types/client.type";
import ClientModel from "../models/client.model";

class ClientService {

  async createClient(clientData: Partial<IClient>): Promise<IClient> {
    const newClient = new ClientModel(clientData);
    return await newClient.save();
  }

  async updateClient(clientId: string, updateData: Partial<IClient>): Promise<IClient> {
    const client = await ClientModel.findById(clientId);

    if (!client) {
      throw new Error("Client not found");
    }

    Object.assign(client, updateData);
    return await client.save();
  }

  async getClients(
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: string,
    search: string,
    status: string
  ): Promise<{ clients: IClient[]; totalCount: number }> {

    const query: any = {};

    if (search) {
      query["$text"] = { $search: search };
    }

    if (status) {
      query.status = status;
    }

    const clients = await ClientModel.find(query)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCount = await ClientModel.countDocuments(query);

    return { clients, totalCount };
  }

  async getClientById(clientId: string): Promise<IClient | null> {
    return await ClientModel.findById(clientId);
  }

  async deleteClient(clientId: string): Promise<boolean> {
    const client = await ClientModel.findByIdAndDelete(clientId);

    if (!client) {
      throw new Error("Client not found");
    }

    return true;
  }

  async hasDebt(clientId: Types.ObjectId): Promise<boolean> {
    const client = await ClientModel.findById(clientId);

    if (!client) {
      throw new Error("Client not found");
    }

    return client.debt.totalDebt > 0;
  }

  async getClientDebtDetails(clientId: Types.ObjectId): Promise<IClient['debt'] | null> {
    const client = await ClientModel.findById(clientId);

    if (!client) {
      throw new Error("Client not found");
    }

    return client.debt;
  }
}

export default new ClientService();
