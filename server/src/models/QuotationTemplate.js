import mongoose from "mongoose";

const templateSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    quotation: { type: mongoose.Schema.Types.Mixed, required: true },
    isDefault: { type: Boolean, default: false }
  },
  { timestamps: true, minimize: false }
);

export const QuotationTemplate = mongoose.model("QuotationTemplate", templateSchema);

