const express = require("express");
const { myReviews, createReview } = require("../controllers/reviewController");
const { requireUser } = require("../middleware/auth");

const router = express.Router();

router.get("/my", requireUser, myReviews);
router.post("/", requireUser, createReview);

module.exports = router;
