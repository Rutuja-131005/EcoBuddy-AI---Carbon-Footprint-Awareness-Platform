import { API_BASE_URL, buildQuery, request } from "./api";

export const reportService = {
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
