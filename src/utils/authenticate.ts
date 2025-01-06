import { Request, Response, NextFunction } from "express";
import TokenService, { TokenPayload } from "services/token.service";

declare global {
  namespace Express {
    interface Request {
      user: TokenPayload;
    }
  }
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Токен не предоставлен" });
    return;
  }

  try {
    const decoded = TokenService.verifyAccessToken(token);

    req.user = decoded;

    next();
  } catch (error: any) {
    console.error("Ошибка при валидации токена:", error);
    res.status(401).json({ error: error.message });
    return;
  }
};

export default authenticate;
