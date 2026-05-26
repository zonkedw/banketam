import api from "./client";

export const fetchBookingMeta = () => api.get("/bookings/meta");
export const createBooking = (payload) => api.post("/bookings", payload);
export const fetchMyBookings = () => api.get("/bookings/my");
export const fetchAllBookings = () => api.get("/bookings/all");
export const updateBookingStatus = (id, status) =>
  api.patch(`/bookings/${id}/status`, { status });
