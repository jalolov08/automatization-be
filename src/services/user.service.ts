import User from "models/user.model";
import { IUser } from "types/user.type";

class UserService {
  async getUserById(userId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("Пользователь не найден.");
      }
      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async updateUserById(userId: string, updateData: Partial<IUser>) {
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
      });

      if (!updatedUser) {
        throw new Error("Пользователь не найден.");
      }

      return updatedUser;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export default new UserService();
