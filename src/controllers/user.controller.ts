import { Request, Response } from "express";
import UserService from "services/user.service";
import { IUser } from "types/user.type";
import { compressImage } from "utils/compressImage";
import bcrypt from "bcrypt";
import { passwordValidationSchema } from "validation/user.validation";

export const getMe = async (req: Request, res: Response) => {
  const userId = req.user._id;

  try {
    const user = await UserService.getUserById(userId);

    res.status(200).json(user);
  } catch (error: any) {
    console.error("Ошибка при получение данных пользователя:", error);
    res.status(400).json({ error: error.message });
  }
};

export const updateMe = async (req: Request, res: Response) => {
  const userId = req.user._id;
  const { name, phone } = req.body;
  const photoFile = req.file?.path;
  let photoUri = "";
  const outputDirectory = "uploads/users";

  try {
    const updateData: Partial<IUser> = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (photoFile) {
      photoUri = await compressImage(photoFile, outputDirectory, 700, 700);
      updateData.avatar = photoUri;
    }

    const updatedUser = await UserService.updateUserById(userId, updateData);

    res.status(200).json({ user: updatedUser });
  } catch (error: any) {
    console.error("Ошибка при изменение данных пользователя:", error);
    res.status(500).json({ error: error.message });
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
    return;
  }

  try {
    const user = await UserService.getUserById(userId);
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      res.status(400).json({ message: "Неверный текущий пароль." });
      return;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await UserService.updateUserById(userId, { password: hashedNewPassword });

    res.json({ message: "Пароль успешно обновлен." });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
