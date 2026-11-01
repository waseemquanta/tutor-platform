
const express = require("express");
const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
  createReview,
  getTutorReviews,
} = require("../controllers/reviewController");

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles("student"),
  createReview
);

router.get("/tutor/:tutorId", getTutorReviews);

module.exports = router;
