import { Router } from "express";
import {
  createTemplate,
  deleteTemplate,
  getTemplate,
  listTemplates,
  updateTemplate
} from "../controllers/templateController.js";

export const templateRoutes = Router();

templateRoutes.get("/", listTemplates);
templateRoutes.get("/:key", getTemplate);
templateRoutes.post("/", createTemplate);
templateRoutes.put("/:key", updateTemplate);
templateRoutes.delete("/:key", deleteTemplate);

