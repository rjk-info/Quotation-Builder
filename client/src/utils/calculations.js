export const toNumber = (value) => {
  const parsed = Number(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

export const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(toNumber(value));

export const getColumnByType = (columns, type) => columns.find((column) => column.type === type);

export const recalculateRow = (row, columns) => {
  const quantityColumn = getColumnByType(columns, "quantity");
  const priceColumn = getColumnByType(columns, "currency");
  const totalColumn = getColumnByType(columns, "total");

  if (!quantityColumn || !priceColumn || !totalColumn) {
    return row;
  }

  const quantity = toNumber(row.cells[quantityColumn.id]);
  const price = toNumber(row.cells[priceColumn.id]);

  return {
    ...row,
    cells: {
      ...row.cells,
      [totalColumn.id]: quantity * price
    }
  };
};

export const getGrandTotal = (pricing) => {
  const totalColumn = getColumnByType(pricing.columns, "total");
  if (!totalColumn) return 0;

  return pricing.rows.reduce((sum, row) => sum + toNumber(row.cells[totalColumn.id]), 0);
};

export const createQuotationNumber = (sequence, date = new Date()) => {
  const year = date.getFullYear();
  return `CW-${year}-${String(sequence).padStart(3, "0")}`;
};

export const reorder = (list, from, to) => {
  const next = [...list];
  const [removed] = next.splice(from, 1);
  next.splice(to, 0, removed);
  return next;
};

