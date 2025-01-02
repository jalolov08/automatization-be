import { mongodbUri } from "../config";
import mongoose from "mongoose";

export const connectToDb = async () => {
  try {
    await mongoose.connect(mongodbUri, {});
    console.log("Успешно подключено к базе данных");
  } catch (error) {
    console.error("Error connecting to the database: ", error);
    process.exit(1);
  }
};