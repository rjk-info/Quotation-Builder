import { Router } from "express";
import { quotationRoutes } from "./quotationRoutes.js";
import { templateRoutes } from "./templateRoutes.js";

export const apiRoutes = Router();

apiRoutes.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Quotation Builder API is healthy"
  });
});

apiRoutes.use("/quotations", quotationRoutes);
apiRoutes.use("/templates", templateRoutes);

