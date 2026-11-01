
const mongoose = require("mongoose");
const TutorProfile = require("../models/TutorProfile");

// GET /api/tutors/me
const getMyProfile = async (req, res) => {
  try {
    const profile = await TutorProfile.findOne({
      user: req.user._id,
    }).populate("user", "name email");

    res.json({ profile });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get profile",
    });
  }
};

// PUT /api/tutors/me
const saveMyProfile = async (req, res) => {
  try {
    const {
      bio, photo, subjects, gradeLevels,
      hourlyFee, teachingMode, city, location,
      education, experienceYears, availability,
    } = req.body;

    if (
      !Array.isArray(subjects) ||
      !Array.isArray(gradeLevels) ||
      !Array.isArray(availability)
    ) {
      return res.status(400).json({
        message: "Invalid subjects, grades or availability",
      });
    }

    const modes = ["online", "physical", "both"];
    const days = [
      "Monday", "Tuesday", "Wednesday", "Thursday",
      "Friday", "Saturday", "Sunday"
    ];

    const validString = (value, max) =>
      typeof value === "string" && value.length <= max;

    const validList = (list) =>
      list.length <= 30 &&
      list.every(v => validString(v, 60));

    const validTime = (v) =>
      typeof v === "string" &&
      /^([01]\d|2[0-3]):[0-5]\d$/.test(v);

    if (
      !validString(bio, 2000) ||
      !validString(photo, 1000) ||
      !validString(city, 100) ||
      !validString(location, 200) ||
      !validString(education, 300) ||
      !validList(subjects) ||
      !validList(gradeLevels) ||
      !modes.includes(teachingMode) ||
      typeof hourlyFee !== "number" ||
      !Number.isFinite(hourlyFee) ||
      hourlyFee < 0 ||
      typeof experienceYears !== "number" ||
      !Number.isInteger(experienceYears) ||
      experienceYears < 0 ||
      experienceYears > 70
    ) {
      return res.status(400).json({
        message: "Invalid profile information",
      });
    }

    if (photo && !/^https:\/\//i.test(photo)) {
      return res.status(400).json({
        message: "Photo must use an HTTPS URL",
      });
    }

    if (
      availability.length > 7 ||
      new Set(availability.map(a => a.day)).size !==
        availability.length ||
      !availability.every(a =>
        a && days.includes(a.day) &&
        validTime(a.startTime) &&
        validTime(a.endTime) &&
        a.startTime < a.endTime
      )
    ) {
      return res.status(400).json({
        message: "Invalid availability",
      });
    }

    // Allow only tutor-editable fields.
    const update = {
      bio, photo, subjects, gradeLevels,
      hourlyFee, teachingMode, city, location,
      education, experienceYears, availability,
    };

    const profile = await TutorProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: update },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.json({
      message: "Profile saved successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to save profile",
    });
  }
};

// GET /api/tutors/:id
const getPublicProfile = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid tutor ID",
      });
    }

    const profile = await TutorProfile.findOne({
      _id: req.params.id,
      verificationStatus: "approved",
    }).populate("user", "name");

    if (!profile) {
      return res.status(404).json({
        message: "Tutor not found",
      });
    }

    res.json({ profile });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get tutor",
    });
  }
};

const browseTutors = async (req, res) => {
  try {
    const {
      search = "",
      city = "",
      grade = "",
      mode = "",
      maxFee = "",
    } = req.query;

    const filter = {
      verificationStatus: "approved",
    };

    if (search) {
      filter.subjects = {
        $regex: String(search).slice(0, 60)
          .replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        $options: "i",
      };
    }

    if (city) {
      filter.city = {
        $regex: String(city).slice(0, 60)
          .replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        $options: "i",
      };
    }

    if (grade) {
      filter.gradeLevels = String(grade);
    }

    if (mode === "online" || mode === "physical") {
      filter.teachingMode = {
        $in: [mode, "both"],
      };
    }

    if (maxFee !== "") {
      const fee = Number(maxFee);

      if (!Number.isFinite(fee) || fee < 0) {
        return res.status(400).json({
          message: "Invalid maximum fee",
        });
      }

      filter.hourlyFee = { $lte: fee };
    }

    const tutors = await TutorProfile.find(filter)
      .select(
        "user photo bio subjects gradeLevels hourlyFee " +
        "teachingMode city location education " +
        "experienceYears availability verificationStatus " +
        "averageRating totalReviews"
      )
      .populate("user", "name")
      .sort({ averageRating: -1, createdAt: -1 })
      .limit(50);

    res.json({
      count: tutors.length,
      tutors,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tutors",
    });
  }
};


module.exports = {
  getMyProfile,
  saveMyProfile,
  getPublicProfile,browseTutors
};
