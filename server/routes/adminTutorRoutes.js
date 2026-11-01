
const express = require("express");
const mongoose = require("mongoose");
const protect = require("../middleware/authMiddleware");
const TutorProfile = require("../models/TutorProfile");

const router = express.Router();

// Admin authorization middleware
const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
};

// All routes below require admin authentication
router.use(protect, adminOnly);

// GET all tutors
router.get("/", async (req, res) => {
  try {
    const tutors = await TutorProfile.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.json({ tutors });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to fetch tutors",
    });
  }
});

// PATCH tutor verification status
router.patch("/:id/verification", async (req, res) => {
  try {
    const { verificationStatus } = req.body;

    // Check allowed statuses
    if (!["approved", "rejected"].includes(verificationStatus)) {
      return res.status(400).json({
        message: "Invalid verification status",
      });
    }

    // Check MongoDB ObjectId
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid tutor ID",
      });
    }

    // Update TutorProfile, not User
    const profile = await TutorProfile.findByIdAndUpdate(
      req.params.id,
      {
        $set: { verificationStatus },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!profile) {
      return res.status(404).json({
        message: "Tutor not found",
      });
    }

    return res.json({
      message: "Tutor verification updated",
      profile,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to update verification",
    });
  }
});

module.exports = router;
