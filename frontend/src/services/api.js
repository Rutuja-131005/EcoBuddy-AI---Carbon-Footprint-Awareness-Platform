const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

const buildQuery = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

const request = async (path, options = {}) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  };

  if (options.body && typeof options.body !== "string") {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, config);
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || "Something went wrong while contacting the API.");
  }

  return payload?.data ?? payload;
};

export const api = {
  health: () => request("/health"),
  getActivities: (params) => request(`/activities${buildQuery(params)}`),
  getActivity: (id) => request(`/activities/${id}`),
  createActivity: (body) =>
    request("/activities", {
      method: "POST",
      body
    }),
  updateActivity: (id, body) =>
    request(`/activities/${id}`, {
      method: "PUT",
      body
    }),
  deleteActivity: (id) =>
    request(`/activities/${id}`, {
      method: "DELETE"
    }),
  getDashboard: () => request("/dashboard"),
  getEmissionFactors: (params) => request(`/emission-factors${buildQuery(params)}`),
  getGoals: () => request("/goals"),
  createGoal: (body) =>
    request("/goals", {
      method: "POST",
      body
    }),
  updateGoal: (id, body) =>
    request(`/goals/${id}`, {
      method: "PUT",
      body
    }),
  completeGoal: (id) =>
    request(`/goals/${id}/complete`, {
      method: "PATCH"
    }),
  deleteGoal: (id) =>
    request(`/goals/${id}`, {
      method: "DELETE"
    }),
  getRecommendations: (params) => request(`/recommendations${buildQuery(params)}`),
  getReport: (params) => request(`/reports${buildQuery(params)}`),
  downloadReportPdf: async (params) => {
    const response = await fetch(`${API_BASE_URL}/reports/download/pdf${buildQuery(params)}`);

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.message || "PDF download failed.");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ecobuddy-report.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};
