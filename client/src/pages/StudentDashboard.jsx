import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/authApi";

function StudentDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await api.get("/auth/me");

        const currentUser = response.data.user;

        if (!currentUser || currentUser.role !== "student") {
          navigate("/student/login");
          return;
        }

        setUser(currentUser);
      } catch (error) {
        navigate("/student/login");
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");

      navigate("/student/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return null;
  }

  // ✅ Ye return StudentDashboard function ke ANDAR ha

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Navbar */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-blue-600">
            Student Dashboard
          </h1>

          <button
            type="button"
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Welcome, {user.name}!
          </h2>

          <p className="text-blue-100 text-base sm:text-lg">
            Welcome to your learning dashboard. Manage your student profile and
            account information.
          </p>
        </div>

        {/* Student Profile */}
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Student Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Card */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <p className="text-sm font-medium text-gray-500 mb-2">
                Full Name
              </p>

              <p className="text-xl font-semibold text-gray-900 break-words">
                {user.name}
              </p>
            </div>

            {/* Email Card */}
            <div className="bg-green-50 border border-green-100 rounded-xl p-6">
              <p className="text-sm font-medium text-gray-500 mb-2">
                Email Address
              </p>

              <p className="text-lg font-semibold text-gray-900 break-all">
                {user.email}
              </p>
            </div>

            {/* Role Card */}
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-6">
              <p className="text-sm font-medium text-gray-500 mb-2">
                Account Role
              </p>

              <p className="text-xl font-semibold text-gray-900 capitalize">
                {user.role}
              </p>
            </div>

            {/* Account Status Card */}
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-6">
              <p className="text-sm font-medium text-gray-500 mb-2">
                Account Status
              </p>

              <p className="text-xl font-semibold text-green-600">Active</p>
            </div>
            <div>
              <Link to="/student/bookings">My Tuition Requests</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} // ✅ Function yahan close hoga

export default StudentDashboard;
