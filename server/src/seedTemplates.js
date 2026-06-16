import { connectDatabase } from "./config/database.js";
import { defaultTemplates } from "./data/defaultTemplates.js";
import { QuotationTemplate } from "./models/QuotationTemplate.js";

const seed = async () => {
  await connectDatabase();

  for (const template of defaultTemplates) {
    await QuotationTemplate.findOneAndUpdate({ key: template.key }, template, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    });
  }

  console.log(`Seeded ${defaultTemplates.length} quotation templates.`);
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});

