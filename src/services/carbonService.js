import { buildQuery, request } from "./api";

export const carbonService = {
  health: () => request("/health"),
  
  getDashboard: () => request("/dashboard"),
  
  getEmissionFactors: (params) => request(`/emission-factors${buildQuery(params)}`),
  
  getRecommendations: (params) => request(`/recommendations${buildQuery(params)}`)
};
