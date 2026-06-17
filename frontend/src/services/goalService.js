import { request } from "./api";

export const goalService = {
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
    })
};
