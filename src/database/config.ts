import mongoose from "mongoose";
import { MONGO_CONNECTION_URL } from "../shared/config/config";
import logger from "../shared/config/logger";
export const dbConnection = async () => {
  const pathConnection = MONGO_CONNECTION_URL as string;
  try {
    await mongoose.connect(pathConnection);
    logger.info("database connected");
  } catch (error) {
    throw new Error(`Error a la hora de iniciar la base de datos: ${error}`);
  }
};
