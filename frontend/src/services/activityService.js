import { buildQuery, request } from "./api";

export const activityService = {
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
    })
};
