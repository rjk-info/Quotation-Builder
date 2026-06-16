import { QuotationTemplate } from "../models/QuotationTemplate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/sendResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { templatePayloadSchema } from "../validators/quotationValidator.js";

export const listTemplates = asyncHandler(async (_req, res) => {
  const templates = await QuotationTemplate.find().sort({ isDefault: -1, name: 1 });
  sendResponse(res, 200, "Templates fetched", templates);
});

export const getTemplate = asyncHandler(async (req, res) => {
  const template = await QuotationTemplate.findOne({ key: req.params.key });
  if (!template) throw new ApiError(404, "Template not found");
  sendResponse(res, 200, "Template fetched", template);
});

export const createTemplate = asyncHandler(async (req, res) => {
  const payload = templatePayloadSchema.parse(req.body);
  const template = await QuotationTemplate.create(payload);
  sendResponse(res, 201, "Template created", template);
});

export const updateTemplate = asyncHandler(async (req, res) => {
  const payload = templatePayloadSchema.partial().parse(req.body);
  const template = await QuotationTemplate.findOneAndUpdate({ key: req.params.key }, payload, {
    new: true,
    runValidators: true
  });

  if (!template) throw new ApiError(404, "Template not found");
  sendResponse(res, 200, "Template updated", template);
});

export const deleteTemplate = asyncHandler(async (req, res) => {
  const template = await QuotationTemplate.findOneAndDelete({ key: req.params.key });
  if (!template) throw new ApiError(404, "Template not found");
  sendResponse(res, 200, "Template deleted", { key: req.params.key });
});

