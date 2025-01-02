import { jwtAccessSecret, jwtRefreshSecret } from ".././config";
import jwt from "jsonwebtoken";
import Token from "../models/token.model";

export interface TokenPayload {
  email: string;
  role: string;
  _id: string;
}

class TokenService {
  generateAccessToken(email: string, role: string, _id: string) {
    const payload: TokenPayload = { email, role, _id };
    return jwt.sign(payload, jwtAccessSecret, { expiresIn: "30m" });
  }

  async generateRefreshToken(email: string, role: string, _id: string) {
    const payload: TokenPayload = { email, role, _id };
    const refreshToken = jwt.sign(payload, jwtRefreshSecret, {
      expiresIn: "30d",
    });

    try {
      await Token.findOneAndUpdate(
        { userId: _id },
        { refreshToken },
        { upsert: true, new: true }
      );
    } catch (error) {
      throw new Error(
        "Ошибка при сохранении или обновлении refresh токена в базу данных"
      );
    }

    return refreshToken;
  }

  verifyAccessToken(token: string) {
    try {
      const decoded = jwt.verify(token, jwtAccessSecret) as TokenPayload;
      return decoded;
    } catch (error) {
      throw new Error("Невалидный или истекший access токен");
    }
  }

  verifyRefreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, jwtRefreshSecret) as TokenPayload;
      return decoded;
    } catch (error) {
      throw new Error("Невалидный или истекший refresh токен");
    }
  }

  async deleteRefreshToken(userId: string) {
    try {
      const result = await Token.findOneAndDelete({ userId });

      if (!result) {
        throw new Error("Не удалось найти или удалить refresh токен");
      }

      return { message: "Refresh токен успешно удален" };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export default new TokenService();
