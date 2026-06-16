import { Quotation } from "../models/Quotation.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/sendResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { quotationPayloadSchema } from "../validators/quotationValidator.js";
import { generateQuotationNumber } from "../services/quotationNumberService.js";

const ensureQuotationNumber = async (payload) => {
  if (!payload.quotationNumber) {
    return generateQuotationNumber();
  }

  const existing = await Quotation.exists({ quotationNumber: payload.quotationNumber });
  return existing ? generateQuotationNumber() : payload.quotationNumber;
};

export const listQuotations = asyncHandler(async (req, res) => {
  const { status, templateType, search } = req.query;
  const query = {};

  if (status) query.status = status;
  if (templateType) query.templateType = templateType;
  if (search) query.$text = { $search: search };

  const quotations = await Quotation.find(query).sort({ updatedAt: -1 }).limit(100);
  sendResponse(res, 200, "Quotations fetched", quotations);
});

export const getQuotation = asyncHandler(async (req, res) => {
  const quotation = await Quotation.findById(req.params.id);
  if (!quotation) throw new ApiError(404, "Quotation not found");
  sendResponse(res, 200, "Quotation fetched", quotation);
});

export const createQuotation = asyncHandler(async (req, res) => {
  const payload = quotationPayloadSchema.parse(req.body);
  payload.quotationNumber = await ensureQuotationNumber(payload);
  const quotation = await Quotation.create(payload);
  sendResponse(res, 201, "Quotation created", quotation);
});

export const updateQuotation = asyncHandler(async (req, res) => {
  const payload = quotationPayloadSchema.partial().parse(req.body);
  delete payload.quotationNumber;

  const quotation = await Quotation.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true
  });

  if (!quotation) throw new ApiError(404, "Quotation not found");
  sendResponse(res, 200, "Quotation updated", quotation);
});

export const deleteQuotation = asyncHandler(async (req, res) => {
  const quotation = await Quotation.findByIdAndDelete(req.params.id);
  if (!quotation) throw new ApiError(404, "Quotation not found");
  sendResponse(res, 200, "Quotation deleted", { id: req.params.id });
});

export const duplicateQuotation = asyncHandler(async (req, res) => {
  const quotation = await Quotation.findById(req.params.id).lean();
  if (!quotation) throw new ApiError(404, "Quotation not found");

  delete quotation._id;
  delete quotation.createdAt;
  delete quotation.updatedAt;
  quotation.quotationNumber = await generateQuotationNumber();
  quotation.status = "draft";

  const duplicate = await Quotation.create(quotation);
  sendResponse(res, 201, "Quotation duplicated", duplicate);
});

export const nextQuotationNumber = asyncHandler(async (_req, res) => {
  const quotationNumber = await generateQuotationNumber();
  sendResponse(res, 200, "Quotation number generated", { quotationNumber });
});

