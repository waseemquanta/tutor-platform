const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const tutorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    photo: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    education: {
      type: String,
      default: "",
    },

    subjects: [
      {
        type: String,
      },
    ],

    gradeLevels: [
      {
        type: String,
      },
    ],

    hourlyFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    teachingMode: {
      type: String,
      enum: ["online", "physical", "both"],
      default: "online",
    },

    city: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    experienceYears: {
      type: Number,
      default: 0,
      min: 0,
      max: 70,
    },

    availability: {
      type: [availabilitySchema],
      default: [],
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "TutorProfile",
  tutorProfileSchema
);