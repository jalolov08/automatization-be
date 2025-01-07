import User from "models/user.model";
import { IUser } from "types/user.type";
import { NotFoundError, InternalServerError } from "utils/errors";

class UserService {
  async getUserById(userId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError("Пользователь не найден.");
      }
      return user;
    } catch (error: any) {
      throw new InternalServerError(
        error.message || "Не удалось получить пользователя."
      );
    }
  }

  async updateUserById(userId: string, updateData: Partial<IUser>) {
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
      });

      if (!updatedUser) {
        throw new NotFoundError("Пользователь не найден.");
      }

      return updatedUser;
    } catch (error: any) {
      throw new InternalServerError(
        error.message || "Не удалось обновить пользователя."
      );
    }
  }
}

export default new UserService();
