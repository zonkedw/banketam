import api from "./client";

export const fetchMyReviews = () => api.get("/reviews/my");
export const createReview = (payload) => api.post("/reviews", payload);
