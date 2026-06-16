const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || "API request failed");
  }

  return payload?.data ?? payload;
};

export const quotationApi = {
  list: () => request("/quotations"),
  get: (id) => request(`/quotations/${id}`),
  create: (quotation) =>
    request("/quotations", {
      method: "POST",
      body: JSON.stringify(quotation)
    }),
  update: (id, quotation) =>
    request(`/quotations/${id}`, {
      method: "PUT",
      body: JSON.stringify(quotation)
    }),
  remove: (id) =>
    request(`/quotations/${id}`, {
      method: "DELETE"
    }),
  duplicate: (id) =>
    request(`/quotations/${id}/duplicate`, {
      method: "POST"
    }),
  nextNumber: () => request("/quotations/next-number")
};

