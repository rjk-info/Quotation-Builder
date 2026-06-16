import { configureStore } from "@reduxjs/toolkit";
import quotationReducer, { normalizeQuotationBuilderState } from "./quotationSlice.js";

const STORAGE_KEY = "quotation-builder-state";

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;

    const parsedState = JSON.parse(raw);

    return parsedState?.quotationBuilder
      ? {
          ...parsedState,
          quotationBuilder: normalizeQuotationBuilderState(parsedState.quotationBuilder)
        }
      : parsedState;
  } catch {
    return undefined;
  }
};

export const store = configureStore({
  reducer: {
    quotationBuilder: quotationReducer
  },
  preloadedState: loadState()
});

store.subscribe(() => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store.getState()));
  } catch {
    // Local persistence is a convenience layer; the app remains usable without it.
  }
});
