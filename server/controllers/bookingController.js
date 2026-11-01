
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const TutorProfile = require("../models/TutorProfile");

const validTime = value =>
  typeof value === "string" &&
  /^([01]\d|2[0-3]):[0-5]\d$/.test(value);

const validDate = value => {
  if (typeof value !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value;
};

const createBooking = async (req, res) => {
  try {
    const {
      tutorId, subject, date,
      startTime, endTime, message = "",
      teachingMode,
    } = req.body;

    if (!mongoose.isValidObjectId(tutorId)) {
      return res.status(400).json({ message: "Invalid tutor" });
    }

    if (
      typeof subject !== "string" ||
      !subject.trim() || subject.length > 100 ||
      typeof message !== "string" ||
      message.length > 1000 ||
      !validDate(date) ||
      !validTime(startTime) ||
      !validTime(endTime) ||
      startTime >= endTime
    ) {
      return res.status(400).json({
        message: "Invalid booking details",
      });
    }

    const tutor = await TutorProfile.findOne({
      _id: tutorId,
      verificationStatus: "approved",
    });

    if (!tutor) {
      return res.status(404).json({
        message: "Approved tutor not found",
      });
    }

    if (
      !tutor.subjects.some(
        s => s.toLowerCase() === subject.trim().toLowerCase()
      )
    ) {
      return res.status(400).json({
        message: "Tutor does not teach this subject",
      });
    }

    if (
      !["online", "physical"].includes(teachingMode) ||
      (tutor.teachingMode !== "both" &&
       tutor.teachingMode !== teachingMode)
    ) {
      return res.status(400).json({
        message: "Teaching mode unavailable",
      });
    }

    // This MVP uses the server's configured local timezone.
    const requestedStart = new Date(`${date}T${startTime}:00`);
    if (requestedStart <= new Date()) {
      return res.status(400).json({
        message: "Choose a future time",
      });
    }

    const day = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
    }).format(new Date(`${date}T12:00:00`));

    const available = tutor.availability.some(slot =>
      slot.day === day &&
      startTime >= slot.startTime &&
      endTime <= slot.endTime
    );

    if (!available) {
      return res.status(400).json({
        message: "Time is outside tutor availability",
      });
    }

    const booking = await Booking.create({
      student: req.user._id,
      tutor: tutor._id,
      subject: subject.trim(),
      date,
      startTime,
      endTime,
      teachingMode,
      message,
    });

    res.status(201).json({
      message: "Tuition request submitted",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create booking",
    });
  }
};

const getStudentBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      student: req.user._id,
    })
      .populate({
        path: "tutor",
        select: "user subjects hourlyFee city",
        populate: { path: "user", select: "name" },
      })
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bookings",
    });
  }
};

const getTutorBookings = async (req, res) => {
  try {
    const profile = await TutorProfile.findOne({
      user: req.user._id,
    });

    if (!profile) {
      return res.json({ bookings: [] });
    }

    const bookings = await Booking.find({
      tutor: profile._id,
    })
      .populate("student", "name")
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch requests",
    });
  }
};

const updateTutorBooking = async (req, res) => {
  try {
    const { status } = req.body;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }

    const profile = await TutorProfile.findOne({
      user: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Tutor profile not found",
      });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      tutor: profile._id,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const allowed = {
      pending: ["accepted", "rejected"],
      accepted: ["completed"],
    };

    if (!allowed[booking.status]?.includes(status)) {
      return res.status(400).json({
        message: "Invalid booking status change",
      });
    }

    if (status === "accepted") {
      const conflict = await Booking.exists({
        _id: { $ne: booking._id },
        tutor: profile._id,
        date: booking.date,
        status: { $in: ["accepted", "completed"] },
        startTime: { $lt: booking.endTime },
        endTime: { $gt: booking.startTime },
      });

      if (conflict) {
        return res.status(409).json({
          message: "Another booking uses this time",
        });
      }
    }

    if (
      status === "completed" &&
      new Date(`${booking.date}T${booking.endTime}:00`) >
        new Date()
    ) {
      return res.status(400).json({
        message: "Class has not finished yet",
      });
    }

    booking.status = status;
    await booking.save();

    res.json({
      message: "Booking updated",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update booking",
    });
  }
};

const cancelStudentBooking = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      student: req.user._id,
      status: "pending",
    });

    if (!booking) {
      return res.status(400).json({
        message: "Only pending requests can be cancelled",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Request cancelled", booking });
  } catch (error) {
    res.status(500).json({
      message: "Failed to cancel request",
    });
  }
};

module.exports = {
  createBooking,
  getStudentBookings,
  getTutorBookings,
  updateTutorBooking,
  cancelStudentBooking,
};
