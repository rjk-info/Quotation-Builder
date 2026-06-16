import mongoose from "mongoose";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";

export const notFound = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

export const errorHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      details: error.flatten()
    });
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      success: false,
      message: "Mongo validation failed",
      details: error.errors
    });
  }

  if (error?.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate record",
      details: error.keyValue
    });
  }

  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
    details: error.details || null
  });
};

