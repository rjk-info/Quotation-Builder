import { createSlice } from "@reduxjs/toolkit";
import { detailField, getTemplateById, templates } from "../data/templates.js";
import { createQuotationNumber, getGrandTotal, recalculateRow, reorder } from "../utils/calculations.js";
import { defaultDisplaySettings } from "../utils/typography.js";

const clone = (value) => JSON.parse(JSON.stringify(value));

const createBlankSection = () => ({
  id: crypto.randomUUID(),
  heading: "New Section",
  content: "<p>Add section content here.</p>"
});

const normalizeDisplay = (display = {}) => {
  const source = display || {};

  return {
    ...defaultDisplaySettings,
    showClientInformation: source.showClientInformation ?? defaultDisplaySettings.showClientInformation,
    dividerColor: source.dividerColor ?? "#0b2343",
    sectionTitleColor: source.sectionTitleColor ?? "#0f172a",
    sectionTitleSize: source.sectionTitleSize ?? 11,
    tableHeaderBg: source.tableHeaderBg ?? "#0b2343",
    tableHeaderColor: source.tableHeaderColor ?? "#ffffff"
  };
};

const normalizeSection = (section = {}) => {
  const source = section || {};

  return {
    ...source,
    id: source.id || crypto.randomUUID(),
    heading: source.heading ?? "",
    content: source.content ?? ""
  };
};

export const normalizeQuotation = (quotation) => {
  const normalized = clone(quotation || {});

  normalized.logo = {
    src: "",
    width: 190,
    align: "left",
    ...(normalized.logo || {})
  };
  normalized.heading = {
    text: "",
    subText: "",
    ...(normalized.heading || {})
  };
  normalized.issueDate = normalized.issueDate ?? new Date().toISOString().split("T")[0];
  normalized.companyDetails = normalized.companyDetails || [];
  normalized.clientDetails = normalized.clientDetails || [];
  normalized.companyTitle = normalized.companyTitle ?? "From";
  normalized.clientTitle = normalized.clientTitle ?? "Client";
  normalized.pricing = {
    columns: normalized.pricing?.columns || [],
    rows: normalized.pricing?.rows || []
  };
  normalized.sections = (normalized.sections || []).map(normalizeSection);
  normalized.footer = {
    note: "",
    signature: "",
    signatureLabel: "Authorized Signature",
    signatureEnabled: true,
    ...(normalized.footer || {})
  };
  normalized.watermark = {
    enabled: false,
    type: "text",
    text: "",
    image: "",
    opacity: 0.40,
    rotation: -45,
    size: 850,
    ...(normalized.watermark || {})
  };
  normalized.display = normalizeDisplay(normalized.display);

  return normalized;
};

const ensureDisplay = (quotation) => {
  if (!quotation.display) {
    quotation.display = normalizeDisplay();
  }

  return quotation.display;
};

const createEmptyPricingRow = (columns) => ({
  id: crypto.randomUUID(),
  cells: columns.reduce((cells, column) => {
    cells[column.id] = column.type === "total" ? 0 : "";
    return cells;
  }, {})
});

const createColumn = () => ({
  id: `column_${crypto.randomUUID()}`,
  label: "New Column",
  type: "text"
});

const withTimestamps = (quotation) => ({
  ...quotation,
  updatedAt: new Date().toISOString()
});

const initialQuotation = normalizeQuotation(templates[0]);

const initialState = {
  current: initialQuotation,
  selectedTemplateId: initialQuotation.id,
  drafts: [],
  activeDraftId: null,
  sequence: 1,
  isPreviewOpen: false
};

export const normalizeQuotationBuilderState = (state) => {
  if (!state) return initialState;

  return {
    ...initialState,
    ...state,
    current: normalizeQuotation(state.current || initialQuotation),
    drafts: (state.drafts || []).map(normalizeQuotation),
    activeDraftId: state.activeDraftId || null,
    isPreviewOpen: Boolean(state.isPreviewOpen)
  };
};

const quotationSlice = createSlice({
  name: "quotationBuilder",
  initialState,
  reducers: {
    selectTemplate(state, action) {
      const template = normalizeQuotation(getTemplateById(action.payload));
      state.sequence += 1;
      template.quotationNumber = createQuotationNumber(state.sequence);
      template.createdAt = new Date().toISOString();
      template.updatedAt = new Date().toISOString();
      state.current = template;
      state.selectedTemplateId = action.payload;
      state.activeDraftId = null;
    },
    createNewQuotation(state) {
      state.sequence += 1;
      const blank = normalizeQuotation(templates[0]);
      blank.id = crypto.randomUUID();
      blank.quotationNumber = createQuotationNumber(state.sequence);
      blank.heading.text = "NEW QUOTATION";
      blank.heading.subText = "(Project Name)";
      blank.overview = "<p>Add quotation overview here.</p>";
      blank.pricing.rows = [createEmptyPricingRow(blank.pricing.columns)];
      blank.sections = [createBlankSection()];
      blank.createdAt = new Date().toISOString();
      blank.updatedAt = new Date().toISOString();
      state.current = blank;
      state.activeDraftId = null;
    },
    updateLogo(state, action) {
      state.current.logo = { ...state.current.logo, ...action.payload };
      state.current = withTimestamps(state.current);
    },
    updateHeading(state, action) {
      state.current.heading = { ...state.current.heading, ...action.payload };
      state.current = withTimestamps(state.current);
    },
    updateOverview(state, action) {
      state.current.overview = action.payload;
      state.current = withTimestamps(state.current);
    },
    updateDisplaySettings(state, action) {
      const display = ensureDisplay(state.current);
      const nextSettings = { ...action.payload };
      state.current.display = { ...display, ...nextSettings };
      state.current = withTimestamps(state.current);
    },
    updateSectionTitles(state, action) {
      if (action.payload.companyTitle !== undefined) {
        state.current.companyTitle = action.payload.companyTitle;
      }
      if (action.payload.clientTitle !== undefined) {
        state.current.clientTitle = action.payload.clientTitle;
      }
      state.current = withTimestamps(state.current);
    },
    addCompanyField(state) {
      state.current.companyDetails.push(detailField("New Field", ""));
      state.current = withTimestamps(state.current);
    },
    updateCompanyField(state, action) {
      const field = state.current.companyDetails.find((item) => item.id === action.payload.id);
      if (field) {
        field[action.payload.key] = action.payload.value;
        state.current = withTimestamps(state.current);
      }
    },
    deleteCompanyField(state, action) {
      state.current.companyDetails = state.current.companyDetails.filter((field) => field.id !== action.payload);
      state.current = withTimestamps(state.current);
    },
    addClientField(state) {
      state.current.clientDetails.push(detailField("New Field", ""));
      state.current = withTimestamps(state.current);
    },
    updateClientField(state, action) {
      const field = state.current.clientDetails.find((item) => item.id === action.payload.id);
      if (field) {
        field[action.payload.key] = action.payload.value;
        state.current = withTimestamps(state.current);
      }
    },
    deleteClientField(state, action) {
      state.current.clientDetails = state.current.clientDetails.filter((field) => field.id !== action.payload);
      state.current = withTimestamps(state.current);
    },
    addPricingRow(state) {
      state.current.pricing.rows.push(createEmptyPricingRow(state.current.pricing.columns));
      state.current = withTimestamps(state.current);
    },
    deletePricingRow(state, action) {
      state.current.pricing.rows = state.current.pricing.rows.filter((row) => row.id !== action.payload);
      state.current = withTimestamps(state.current);
    },
    updatePricingCell(state, action) {
      const { rowId, columnId, value } = action.payload;
      const rowIndex = state.current.pricing.rows.findIndex((row) => row.id === rowId);
      if (rowIndex !== -1) {
        const row = state.current.pricing.rows[rowIndex];
        row.cells[columnId] = value;
        state.current.pricing.rows[rowIndex] = recalculateRow(row, state.current.pricing.columns);
        state.current = withTimestamps(state.current);
      }
    },
    addPricingColumn(state) {
      const column = createColumn();
      state.current.pricing.columns.push(column);
      state.current.pricing.rows.forEach((row) => {
        row.cells[column.id] = "";
      });
      state.current = withTimestamps(state.current);
    },
    updatePricingColumn(state, action) {
      const column = state.current.pricing.columns.find((item) => item.id === action.payload.id);
      if (column) {
        column[action.payload.key] = action.payload.value;
        state.current.pricing.rows = state.current.pricing.rows.map((row) =>
          recalculateRow(row, state.current.pricing.columns)
        );
        state.current = withTimestamps(state.current);
      }
    },
    deletePricingColumn(state, action) {
      const column = state.current.pricing.columns.find((item) => item.id === action.payload);
      if (column?.type === "total") return;
      state.current.pricing.columns = state.current.pricing.columns.filter((item) => item.id !== action.payload);
      state.current.pricing.rows.forEach((row) => {
        delete row.cells[action.payload];
      });
      state.current = withTimestamps(state.current);
    },
    reorderPricingRows(state, action) {
      state.current.pricing.rows = reorder(state.current.pricing.rows, action.payload.from, action.payload.to);
      state.current = withTimestamps(state.current);
    },
    reorderPricingColumns(state, action) {
      state.current.pricing.columns = reorder(state.current.pricing.columns, action.payload.from, action.payload.to);
      state.current = withTimestamps(state.current);
    },
    addSection(state) {
      state.current.sections.push(createBlankSection());
      state.current = withTimestamps(state.current);
    },
    updateSection(state, action) {
      const section = state.current.sections.find((item) => item.id === action.payload.id);
      if (section) {
        section[action.payload.key] = action.payload.value;
        state.current = withTimestamps(state.current);
      }
    },
    duplicateSection(state, action) {
      const index = state.current.sections.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        const copy = clone(state.current.sections[index]);
        copy.id = crypto.randomUUID();
        copy.heading = `${copy.heading} Copy`;
        state.current.sections.splice(index + 1, 0, copy);
        state.current = withTimestamps(state.current);
      }
    },
    deleteSection(state, action) {
      state.current.sections = state.current.sections.filter((section) => section.id !== action.payload);
      state.current = withTimestamps(state.current);
    },
    moveSection(state, action) {
      const { id, direction } = action.payload;
      const index = state.current.sections.findIndex((section) => section.id === id);
      const to = direction === "up" ? index - 1 : index + 1;
      if (index >= 0 && to >= 0 && to < state.current.sections.length) {
        state.current.sections = reorder(state.current.sections, index, to);
        state.current = withTimestamps(state.current);
      }
    },
    reorderSections(state, action) {
      state.current.sections = reorder(state.current.sections, action.payload.from, action.payload.to);
      state.current = withTimestamps(state.current);
    },
    updateFooter(state, action) {
      state.current.footer = { ...state.current.footer, ...action.payload };
      state.current = withTimestamps(state.current);
    },
    updateWatermark(state, action) {
      state.current.watermark = { ...state.current.watermark, ...action.payload };
      state.current = withTimestamps(state.current);
    },
    updateQuotationMeta(state, action) {
      if (action.payload.quotationNumber !== undefined) {
        state.current.quotationNumber = action.payload.quotationNumber;
      }
      if (action.payload.issueDate !== undefined) {
        state.current.issueDate = action.payload.issueDate;
      }
      state.current = withTimestamps(state.current);
    },
    saveDraft(state) {
      const draft = {
        ...clone(state.current),
        id: crypto.randomUUID(),
        draftName: `${state.current.quotationNumber} - ${state.current.templateType}`,
        grandTotal: getGrandTotal(state.current.pricing),
        updatedAt: new Date().toISOString()
      };
      state.drafts.unshift(draft);
      state.activeDraftId = draft.id;
    },
    updateDraft(state) {
      const id = state.activeDraftId;
      const index = state.drafts.findIndex((draft) => draft.id === id);
      if (index !== -1) {
        state.drafts[index] = {
          ...clone(state.current),
          id,
          draftName: state.drafts[index].draftName,
          grandTotal: getGrandTotal(state.current.pricing),
          updatedAt: new Date().toISOString()
        };
      }
    },
    loadDraft(state, action) {
      const draft = state.drafts.find((item) => item.id === action.payload);
      if (draft) {
        state.current = normalizeQuotation(draft);
        state.activeDraftId = draft.id;
      }
    },
    deleteDraft(state, action) {
      state.drafts = state.drafts.filter((draft) => draft.id !== action.payload);
      if (state.activeDraftId === action.payload) {
        state.activeDraftId = null;
      }
    },
    duplicateDraft(state, action) {
      const draft = state.drafts.find((item) => item.id === action.payload);
      if (draft) {
        const copy = clone(draft);
        copy.id = crypto.randomUUID();
        copy.draftName = `${copy.draftName} Copy`;
        copy.updatedAt = new Date().toISOString();
        state.drafts.unshift(copy);
      }
    },
    setPreviewOpen(state, action) {
      state.isPreviewOpen = action.payload;
    },
    replaceCurrentQuotation(state, action) {
      state.current = normalizeQuotation(action.payload);
      state.activeDraftId = action.payload.id || null;
    }
  }
});

export const {
  addClientField,
  addCompanyField,
  addPricingColumn,
  addPricingRow,
  addSection,
  createNewQuotation,
  deleteClientField,
  deleteCompanyField,
  deleteDraft,
  deletePricingColumn,
  deletePricingRow,
  deleteSection,
  duplicateDraft,
  duplicateSection,
  loadDraft,
  moveSection,
  reorderPricingColumns,
  reorderPricingRows,
  reorderSections,
  replaceCurrentQuotation,
  saveDraft,
  selectTemplate,
  setPreviewOpen,
  updateClientField,
  updateCompanyField,
  updateDisplaySettings,
  updateDraft,
  updateFooter,
  updateHeading,
  updateLogo,
  updateOverview,
  updatePricingCell,
  updatePricingColumn,
  updateSection,
  updateWatermark,
  updateQuotationMeta,
  updateSectionTitles
} = quotationSlice.actions;

export const selectQuotationState = (state) => state.quotationBuilder;
export const selectCurrentQuotation = (state) => state.quotationBuilder.current;
export const selectGrandTotal = (state) => getGrandTotal(state.quotationBuilder.current.pricing);

export default quotationSlice.reducer;