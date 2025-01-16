import { Request, Response } from "express";
import ClientService from "../services/client.service";
import { NotFoundError, ForbiddenError } from "../utils/errors";
import { Types } from "mongoose";
import { createClientSchema, updateClientSchema } from "validation/client.validation";

export async function createClient(req: Request, res: Response): Promise<void> {
    const clientData = req.body;

    const { error } = createClientSchema.validate(clientData);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }

    try {
        const newClient = await ClientService.createClient(clientData);
        res.status(201).json(newClient);
    } catch (error) {
        res.status(500).json({ error: "Не удалось создать клиента." });
    }
}

export async function updateClient(req: Request, res: Response): Promise<void> {
    const { clientId } = req.params;
    const { fullName, contactInfo, status } = req.body;

    const { error } = updateClientSchema.validate({
        fullName,
        contactInfo,
        status,
    });
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return; // Explicitly return to prevent further execution
    }

    try {
        const updatedClient = await ClientService.updateClient(clientId, {
            fullName,
            contactInfo,
            status,
            // debt,
            // totalPurchases,
        });
        res.status(200).json(updatedClient); // Send the response
    } catch (error: any) {
        console.log(error);

        if (error instanceof NotFoundError || error instanceof ForbiddenError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: "Не удалось обновить клиента." });
    }
}


export async function getClients(req: Request, res: Response) {
    const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "asc", search, status } = req.query;

    try {
        const { clients, totalCount } = await ClientService.getClients(
            Number(page),
            Number(limit),
            String(sortBy),
            String(sortOrder),
            String(search || ""),
            String(status || "")
        );
        res.status(200).json({ clients, totalCount });
    } catch (error) {
        res.status(500).json({ error: "Не удалось получить клиентов." });
    }
}

export async function getClientById(req: Request, res: Response) {
    const { clientId } = req.params;

    try {
        const client = await ClientService.getClientById(clientId);

        if (!client) {
            throw new NotFoundError("Клиент не найден");
        }

        res.status(200).json(client);
    } catch (error) {
        if (error instanceof NotFoundError) {
            res.status(404).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: "Не удалось получить данные клиента." });
    }
}

export async function deleteClient(req: Request, res: Response) {
    const { clientId } = req.params;

    try {
        const result = await ClientService.deleteClient(clientId);
        res.status(200).json({ message: "Клиент успешно удален." });
    } catch (error) {
        res.status(500).json({ error: "Не удалось удалить клиента." });
    }
}

// export async function getClientDebtDetails(req: Request, res: Response) {
//     const { clientId } = req.params;

//     try {
//         const clientId: string = req.params.clientId;
//         const clientObjectId = new Types.ObjectId(clientId);
//         const debtDetails = await ClientService.getClientDebtDetails(clientObjectId);

//         if (!debtDetails) {
//             throw new NotFoundError("Долг клиента не найден");
//         }

//         res.status(200).json(debtDetails);
//     } catch (error) {
//         if (error instanceof NotFoundError) {
//             res.status(404).json({ error: error.message });
//             return;
//         }
//         res.status(500).json({ error: "Не удалось получить информацию о долге клиента." });
//     }
// }
