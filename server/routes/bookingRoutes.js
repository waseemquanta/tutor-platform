
const express = require("express");
const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
  createBooking,
  getStudentBookings,
  getTutorBookings,
  updateTutorBooking,
  cancelStudentBooking,
} = require("../controllers/bookingController");

const router = express.Router();

router.use(protect);

router.post(
  "/",
  allowRoles("student"),
  createBooking
);

router.get(
  "/student",
  allowRoles("student"),
  getStudentBookings
);

router.get(
  "/tutor",
  allowRoles("tutor"),
  getTutorBookings
);

router.patch(
  "/:id/status",
  allowRoles("tutor"),
  updateTutorBooking
);

router.patch(
  "/:id/cancel",
  allowRoles("student"),
  cancelStudentBooking
);

module.exports = router;
