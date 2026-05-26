const express = require("express");
const {
  createBooking,
  myBookings,
  listAllBookings,
  updateBookingStatus,
  meta,
} = require("../controllers/bookingController");
const { requireUser, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/meta", meta);
router.post("/", requireUser, createBooking);
router.get("/my", requireUser, myBookings);
router.get("/all", requireAdmin, listAllBookings);
router.patch("/:id/status", requireAdmin, updateBookingStatus);

module.exports = router;
