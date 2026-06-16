import mongoose from "mongoose";

const detailFieldSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, trim: true, default: "" },
    value: { type: String, trim: true, default: "" }
  },
  { _id: false }
);

const pricingColumnSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["text", "quantity", "currency", "total"],
      default: "text"
    }
  },
  { _id: false }
);

const pricingRowSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    cells: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} }
  },
  { _id: false }
);

const contentSectionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    heading: { type: String, trim: true, default: "" },
    content: { type: String, default: "" }
  },
  { _id: false }
);

const quotationSchema = new mongoose.Schema(
  {
    quotationNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    },
    templateType: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["draft", "sent", "accepted", "rejected", "archived"],
      default: "draft",
      index: true
    },
    logo: {
      src: { type: String, default: "" },
      width: { type: Number, default: 190, min: 40, max: 500 },
      align: { type: String, enum: ["left", "center", "right"], default: "left" }
    },
    heading: {
      text: { type: String, required: true, trim: true },
      subText: { type: String, trim: true, default: "" }
    },
    companyDetails: { type: [detailFieldSchema], default: [] },
    clientDetails: { type: [detailFieldSchema], default: [] },
    pricing: {
      columns: { type: [pricingColumnSchema], default: [] },
      rows: { type: [pricingRowSchema], default: [] }
    },
    overview: { type: String, default: "" },
    sections: { type: [contentSectionSchema], default: [] },
    footer: {
      note: { type: String, default: "" },
      signature: { type: String, default: "" },
      signatureLabel: { type: String, default: "Authorized Signature" },
      signatureEnabled: { type: Boolean, default: true }
    },
    watermark: {
      enabled: { type: Boolean, default: false },
      type: { type: String, enum: ["text", "image"], default: "text" },
      text: { type: String, default: "" },
      image: { type: String, default: "" },
      opacity: { type: Number, default: 0.40 },
      rotation: { type: Number, default: -45 },
      size: { type: Number, default: 850 }
    },
    display: {
      showClientInformation: { type: Boolean, default: true }
    }
  },
  {
    timestamps: true,
    minimize: false
  }
);

quotationSchema.index({ templateType: 1, updatedAt: -1 });
quotationSchema.index({ "clientDetails.value": "text", quotationNumber: "text", templateType: "text" });

export const Quotation = mongoose.model("Quotation", quotationSchema);
