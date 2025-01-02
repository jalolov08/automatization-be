import { Request, Response } from "express";
import AuthService from "services/auth.service";

import { loginSchema, registrationSchema } from "validation/auth.validation";

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  const { error } = registrationSchema.validate({ email, password, name });

  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }
  try {
    const { accessToken, refreshToken, user } = await AuthService.register(
      email,
      password,
      name
    );

    res.status(201).json({ accessToken, refreshToken, user });
  } catch (error: any) {
    console.error("Ошибка при регистрации:", error);
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { error } = loginSchema.validate({ email, password });

  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }

  try {
    const { accessToken, refreshToken, user } = await AuthService.login(
      email,
      password
    );
    res.status(200).json({ accessToken, refreshToken, user });
  } catch (error: any) {
    console.error("Ошибка при логине:", error);
    res.status(400).json({ error: error.message });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.query;

  if (!refreshToken || typeof refreshToken !== "string") {
    res.status(400).json({ error: "refreshToken обязателен" });
    return;
  }

  try {
    const { accessToken, refreshToken: newRefreshToken } =
      await AuthService.refreshAccessToken(refreshToken);

    res.status(200).json({ accessToken, refreshToken: newRefreshToken });
  } catch (error: any) {
    console.error("Ошибка при обновлении токенов:", error);
    res.status(400).json({ error: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) {
    res.status(400).json({ error: "Пользователь не найден" });
    return;
  }

  try {
    const result = await AuthService.logout(userId);

    res.status(200).json({ message: "Выход из системы успешен", result });
  } catch (error: any) {
    console.error("Ошибка при выходе:", error);
    res.status(500).json({ error: error.message });
  }
};
