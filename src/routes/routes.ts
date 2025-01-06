import { Router } from "express";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import categoryRouter from "./category.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/category", categoryRouter);

export default router;
