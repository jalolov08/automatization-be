import { Request, Response } from "express";
import UserService from "services/user.service";
import { IUser } from "types/user.type";
import { compressImage } from "utils/compressImage";
import bcrypt from "bcrypt";
import { passwordValidationSchema } from "validation/user.validation";
import { NotFoundError } from "utils/errors";

export const getMe = async (req: Request, res: Response) => {
  const userId = req.user._id;

  try {
    const user = await UserService.getUserById(userId);
    if (!user) {
      throw new NotFoundError("Пользователь не найден.");
    }
    res.status(200).json(user);
  } catch (error: any) {
    console.error("Ошибка при получение данных пользователя:", error);
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Не удалось получить данные пользователя." });
    }
  }
};

export const updateMe = async (req: Request, res: Response) => {
  const userId = req.user._id;
  const { name, phone } = req.body;
  const photoFile = req.file?.path;
  const outputDirectory = "uploads/users";

  try {
    const updateData: Partial<IUser> = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    if (photoFile) {
      const photoUri = await compressImage(
        photoFile,
        outputDirectory,
        700,
        700
      );
      updateData.avatar = photoUri;
    }

    const updatedUser = await UserService.updateUserById(userId, updateData);
    res.status(200).json({ user: updatedUser });
  } catch (error: any) {
    console.error("Ошибка при изменении данных пользователя:", error);
    res.status(500).json({ error: "Не удалось обновить данные пользователя." });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id;

  const { error } = passwordValidationSchema.validate({
    currentPassword,
    newPassword,
  });
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    error;
  }

  try {
    const user = await UserService.getUserById(userId);
    if (!user) {
      throw new NotFoundError("Пользователь не найден.");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ error: "Неверный текущий пароль." });
      return;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await UserService.updateUserById(userId, { password: hashedNewPassword });

    res.json({ message: "Пароль успешно обновлен." });
  } catch (error: any) {
    console.error("Ошибка при изменении пароля:", error);
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Не удалось изменить пароль." });
  }
};
