const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const tutorRoutes = require("./routes/tutorRoutes");
const adminTutorRoutes = require("./routes/adminTutorRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const path = require("path"); //dipl
const fs = require("fs"); //dipl

dotenv.config();
connectDB();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use("/api/auth", authRoutes);
app.use("/api/tutors", tutorRoutes);

app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin/tutors", adminTutorRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Tutor API working" });
});



const clientDist = path.resolve(__dirname, "../client/dist");

if (fs.existsSync(clientDist)) {
  // Serve built React assets
  app.use(express.static(clientDist));

  // Support React Router routes
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api")) {
      return next();
    }

    res.sendFile(path.join(clientDist, "index.html"));
  });
}
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0",() => {
  console.log(`Server running on port ${PORT}`);
});
