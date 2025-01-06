import User from "models/user.model";
import bcrypt from "bcrypt";
import { UserRole } from "types/user.type";
import TokenService from "./token.service";
import {
  NotFoundError,
  ForbiddenError,
  InternalServerError,
} from "utils/errors";

class AuthService {
  async register(email: string, password: string, name: string) {
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new ForbiddenError("Пользователь с таким email уже существует");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        password: hashedPassword,
        name,
        role: UserRole.ADMIN,
      });

      await user.save();

      const accessToken = TokenService.generateAccessToken(
        user.email,
        user.role,
        user._id.toString()
      );
      const refreshToken = await TokenService.generateRefreshToken(
        user.email,
        user.role,
        user._id.toString()
      );

      return { accessToken, refreshToken, user };
    } catch (error: any) {
      console.error("Ошибка при регистрации пользователя:", error.message);
      throw new InternalServerError("Ошибка при регистрации пользователя");
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new NotFoundError("Пользователь с таким email не найден");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new ForbiddenError("Неверный пароль");
      }

      const accessToken = TokenService.generateAccessToken(
        user.email,
        user.role,
        user._id.toString()
      );
      const refreshToken = await TokenService.generateRefreshToken(
        user.email,
        user.role,
        user._id.toString()
      );

      return { accessToken, refreshToken, user };
    } catch (error: any) {
      console.error("Ошибка при входе в систему:", error);
      throw new InternalServerError("Ошибка при входе в систему");
    }
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = await TokenService.verifyRefreshToken(refreshToken);
      const user = await User.findById(decoded._id);

      if (!user) {
        throw new NotFoundError("Пользователь не найден");
      }

      const accessToken = TokenService.generateAccessToken(
        user.email,
        user.role,
        user._id.toString()
      );
      const newRefreshToken = await TokenService.generateRefreshToken(
        user.email,
        user.role,
        user._id.toString()
      );

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error: any) {
      console.error("Ошибка при обновлении access токена:", error);
      throw new InternalServerError("Ошибка при обновлении токенов");
    }
  }

  async logout(userId: string) {
    try {
      const result = await TokenService.deleteRefreshToken(userId);
      if (!result) {
        throw new InternalServerError("Ошибка при выходе");
      }
      return result;
    } catch (error: any) {
      console.error("Ошибка при выходе:", error);
      throw new InternalServerError("Ошибка при выходе");
    }
  }
}

export default new AuthService();
