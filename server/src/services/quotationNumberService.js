import { Counter } from "../models/Counter.js";

export const generateQuotationNumber = async (date = new Date()) => {
  const year = date.getFullYear();
  const counter = await Counter.findOneAndUpdate(
    { _id: `quotation-${year}` },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return `CW-${year}-${String(counter.sequence).padStart(3, "0")}`;
};

