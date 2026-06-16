import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { apiRoutes } from "./routes/index.js";

export const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true
  })
);
app.use(express.json({ limit: "8mb" }));
app.use(express.urlencoded({ extended: true, limit: "8mb" }));

if (env.nodeEnv !== "test") {
  app.use(morgan("dev"));
}

app.use("/api", apiRoutes);
app.use(notFound);
app.use(errorHandler);

