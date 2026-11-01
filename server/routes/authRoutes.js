const express=require("express");

const app=express();
const {
  registerTutor,loginTutor,logout,rejisterStudent,studentLogin,loginAdmin
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/register", registerTutor);
router.post("/login",loginTutor);
router.get("/me", protect, (req, res) => {
  res.json({
    user: req.user,
  });
});
router.post("/logout", logout);
router.post("/student/register",rejisterStudent);
router.post("/student/login", studentLogin);
router.post("/admin/login", loginAdmin);
module.exports = router;