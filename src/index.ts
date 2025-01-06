import express, { Request, Response, NextFunction } from "express";
import { port } from "./config";
import "module-alias/register";
import { connectToDb } from "utils/connectToDb";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import rateLimit from "express-rate-limit";
import router from "routes/routes";

const app = express();

connectToDb();

app.use(helmet());

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsOptions));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Слишком много запросов с этого IP, пожалуйста, попробуйте позже",
});
app.use(limiter);

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Сервер работает :)");
});

app.use("/api/uploads", express.static("uploads"));
app.use("/api", router);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Что-то пошло не так. Попробуйте позже.",
  });
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
