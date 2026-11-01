const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  getMyProfile,
  saveMyProfile,
  getPublicProfile,
  browseTutors,
} = require("../controllers/tutorController");

const router = express.Router();

const tutorOnly = (req, res, next) => {
  if (req.user.role !== "tutor") {
    return res.status(403).json({
      message: "Tutor access required",
    });
  }

  next();
};
router.get("/", browseTutors);

router.get("/me", protect, tutorOnly, getMyProfile);

router.put("/me", protect, tutorOnly, saveMyProfile);

router.get("/:id", getPublicProfile);

module.exports = router;
