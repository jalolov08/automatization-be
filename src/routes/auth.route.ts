import {
  login,
  logout,
  refreshAccessToken,
  register,
} from "controllers/auth.controller";
import { Router } from "express";
import authenticate from "utils/authenticate";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/refresh-token", refreshAccessToken);
authRouter.post("/logout", authenticate, logout);

export default authRouter;
