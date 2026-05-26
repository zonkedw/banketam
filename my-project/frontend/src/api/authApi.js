import api from "./client";

export const registerUser = (payload) => api.post("/auth/register", payload);
export const loginUser = (payload) => api.post("/auth/login", payload);
export const adminLogin = (payload) => api.post("/auth/admin-login", payload);
export const fetchMe = () => api.get("/auth/me");
export const logoutUser = () => api.post("/auth/logout");
