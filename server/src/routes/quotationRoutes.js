import { Router } from "express";
import {
  createQuotation,
  deleteQuotation,
  duplicateQuotation,
  getQuotation,
  listQuotations,
  nextQuotationNumber,
  updateQuotation
} from "../controllers/quotationController.js";

export const quotationRoutes = Router();

quotationRoutes.get("/", listQuotations);
quotationRoutes.get("/next-number", nextQuotationNumber);
quotationRoutes.get("/:id", getQuotation);
quotationRoutes.post("/", createQuotation);
quotationRoutes.put("/:id", updateQuotation);
quotationRoutes.delete("/:id", deleteQuotation);
quotationRoutes.post("/:id/duplicate", duplicateQuotation);

