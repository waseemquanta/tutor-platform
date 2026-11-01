
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TutorProfile",
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    date: {
      type: String,
      required: true, // YYYY-MM-DD
    },

    startTime: {
      type: String,
      required: true, // HH:mm
    },

    endTime: {
      type: String,
      required: true,
    },

    teachingMode: {
      type: String,
      enum: ["online", "physical"],
      required: true,
    },

    message: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
  },
  { timestamps: true }
);

bookingSchema.index({ tutor: 1, date: 1, startTime: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
