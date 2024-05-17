import morgan, { StreamOptions } from "morgan";
import logger from "../config/logger";

const stream: StreamOptions = {
  write: (message) => logger.info(message.trim()),
};

const morganMiddleware = morgan(":method :url :status :res[content-length] - :response-time ms", { stream });

export default morganMiddleware;
