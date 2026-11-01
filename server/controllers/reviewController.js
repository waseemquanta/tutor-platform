
const mongoose = require("mongoose");
const Review = require("../models/Review");
const Booking = require("../models/Booking");
const TutorProfile = require("../models/TutorProfile");

const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment = "" } = req.body;

    if (
      !mongoose.isValidObjectId(bookingId) ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5 ||
      typeof comment !== "string" ||
      comment.length > 1000
    ) {
      return res.status(400).json({
        message: "Invalid review information",
      });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      student: req.user._id,
      status: "completed",
    });

    if (!booking) {
      return res.status(403).json({
        message: "Completed booking required",
      });
    }

    const existing = await Review.findOne({
      booking: booking._id,
    });

    if (existing) {
      return res.status(409).json({
        message: "You already reviewed this booking",
      });
    }

    const review = await Review.create({
      tutor: booking.tutor,
      student: req.user._id,
      booking: booking._id,
      rating,
      comment: comment.trim(),
    });

    const stats = await Review.aggregate([
      { $match: { tutor: booking.tutor } },
      {
        $group: {
          _id: "$tutor",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (stats.length) {
      await TutorProfile.findByIdAndUpdate(booking.tutor, {
        averageRating: Number(stats[0].averageRating.toFixed(1)),
        totalReviews: stats[0].totalReviews,
      });
    }

    res.status(201).json({
      message: "Review submitted",
      review,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Booking already reviewed",
      });
    }

    res.status(500).json({
      message: "Unable to submit review",
    });
  }
};

const getTutorReviews = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.tutorId)) {
      return res.status(400).json({
        message: "Invalid tutor ID",
      });
    }

    const reviews = await Review.find({
      tutor: req.params.tutorId,
    })
      .populate("student", "name")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ reviews });
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch reviews",
    });
  }
};

module.exports = { createReview, getTutorReviews };
