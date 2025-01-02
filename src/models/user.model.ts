import { Schema, model } from "mongoose";
import { IUser } from "types/user.type";

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    phone: { type: String },
    avatar: { type: String },
  },
  { timestamps: true }
);

const User = model<IUser>("User", UserSchema);

export default User;