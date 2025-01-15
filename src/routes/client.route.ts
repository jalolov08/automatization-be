import { Router } from "express";
import authenticate from "utils/authenticate";
import {
  createClient,
  updateClient,
  getClientById,
  getClients,
  deleteClient,
  getClientDebtDetails
} from "controllers/client.controller";

const clientRouter = Router();

clientRouter.post("/", authenticate, createClient);
clientRouter.put("/:clientId", authenticate, updateClient);
clientRouter.get("/:clientId", authenticate, getClientById);
clientRouter.get("/", authenticate, getClients);
clientRouter.delete("/:clientId", authenticate, deleteClient);
clientRouter.get("/:clientId/debt", authenticate, getClientDebtDetails);

export default clientRouter;
