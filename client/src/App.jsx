
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";

import TutorRegister from "./pages/TutorRegister";
import TutorLogin from "./pages/TutorLogin";
import TutorDashboard from "./pages/TutorDashboard";
import TutorProfile from "./pages/TutorProfile";


import StudentRegister from "./pages/StudentRegister";
import StudentLogin from "./pages/StudentLogin";
import StudentDashboard from "./pages/StudentDashboard";
import BrowseTutors from "./pages/BrowseTutors";
import TutorDetails from "./pages/TutorDetails";

import StudentReview from "./pages/StudentReview";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTutors from "./pages/AdminTutors";



function PublicLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public website: Header + Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />

          <Route
            path="/student/tutors"
            element={<BrowseTutors />}
          />

          <Route
            path="/tutors/:id"
            element={<TutorDetails />}
          />

          <Route
            path="/student/register"
            element={<StudentRegister />}
          />

          <Route
            path="/student/login"
            element={<StudentLogin />}
          />

          <Route
            path="/tutor/register"
            element={<TutorRegister />}
          />

          <Route
            path="/tutor/login"
            element={<TutorLogin />}
          />
        </Route>

        {/* Student dashboard */}
        <Route
          path="/student/dashboard"
          element={<StudentDashboard />}
        />
        
        <Route
          path="/student/review/:bookingId"
          element={<StudentReview />}
        />

        {/* Tutor dashboard */}
        <Route
          path="/tutor/dashboard"
          element={<TutorDashboard />}
        />
        <Route
          path="/tutor/profile"
          element={<TutorProfile />}
        />
        

        {/* Admin */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />
        <Route
          path="/admin/tutors"
          element={<AdminTutors />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
