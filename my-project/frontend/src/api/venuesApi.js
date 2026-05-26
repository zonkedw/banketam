import api from "./client";

export const fetchVenues = () => api.get("/venues");
