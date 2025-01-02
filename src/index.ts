import express, { Request, Response } from "express";
import { port } from "./config";
import "module-alias/register";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Сервер работает :)");
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
