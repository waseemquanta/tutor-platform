import { useEffect, useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import api from "../services/authApi";

function AdminDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await api.get("/auth/me");

        const currentUser = response.data.user;

        if (currentUser.role !== "admin") {
          navigate("/admin/login");
          return;
        }

        setUser(currentUser);
      } catch (error) {
        navigate("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");

      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return null;
  }

 
return (
  <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">

    {/* SIDEBAR */}
    <aside className="w-full md:w-64 bg-slate-950 text-white flex flex-col md:min-h-screen">

      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-xl font-bold">A</span>
          </div>

          <div>
            <h1 className="text-lg font-bold">
              Admin Panel
            </h1>
            <p className="text-xs text-slate-400">
              Tutor Platform
            </p>
          </div>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 p-4">
        <div className="bg-indigo-600 text-white px-4 py-3 rounded-xl font-medium flex items-center gap-3">
          <span>▦</span>
          <span>Dashboard Overview</span>
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full bg-slate-800 text-white py-3 px-4 rounded-xl font-medium hover:bg-red-600 transition duration-300"
        >
          Logout
        </button>
      </div>

    </aside>

    {/* MAIN DASHBOARD */}
    <div className="flex-1 min-w-0">

      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 px-6 md:px-10 py-5 flex items-center justify-between gap-4">

        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            Dashboard Overview
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Administration Control Center
          </p>
        </div>

        <div className="w-11 h-11 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold shrink-0">
          {user.name?.charAt(0)?.toUpperCase() || "A"}
        </div>

      </header>

      {/* Dashboard Content */}
      <main className="p-5 sm:p-6 md:p-10 max-w-7xl mx-auto">

        {/* Welcome Banner */}
        <section className="bg-gradient-to-r from-indigo-700 via-purple-700 to-violet-800 rounded-2xl p-7 md:p-10 text-white shadow-lg mb-8">

          <p className="text-indigo-200 font-medium mb-3">
            ADMINISTRATION PORTAL
          </p>

          <h2 className="text-2xl md:text-4xl font-bold mb-3">
            Welcome back, {user.name}!
          </h2>

          <p className="text-indigo-100 text-base md:text-lg">
            Manage your platform and view your administrator account information.
          </p>

        </section>

        {/* Account Overview Heading */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-900">
            Account Overview
          </h3>

          <p className="text-slate-500 text-sm mt-1">
            Your administrator profile details
          </p>
        </div>

        {/* Profile Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">

          {/* Name Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">

            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-5">
              <span className="text-indigo-600 text-xl font-bold">
                {user.name?.charAt(0)?.toUpperCase() || "A"}
              </span>
            </div>

            <p className="text-sm font-medium text-slate-500 mb-2">
              Administrator Name
            </p>

            <p className="text-xl font-bold text-slate-900 break-words">
              {user.name}
            </p>

          </div>

          {/* Email Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">

            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-5">
              <span className="text-purple-600 text-xl font-bold">
                @
              </span>
            </div>

            <p className="text-sm font-medium text-slate-500 mb-2">
              Email Address
            </p>

            <p className="text-lg font-semibold text-slate-900 break-all">
              {user.email}
            </p>

          </div>

          {/* Role Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">

            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-5">
              <span className="text-emerald-600 text-xl font-bold">
                ✓
              </span>
            </div>

            <p className="text-sm font-medium text-slate-500 mb-2">
              Account Role
            </p>

            <p className="text-xl font-bold text-slate-900 capitalize">
              {user.role}
            </p>

          </div>

        </div>

        {/* Account Information */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="p-6 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-900">
              Administrator Profile
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Your account information
            </p>
          </div>

          <div className="p-6 space-y-5">

            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 border-b border-slate-100 pb-4">
              <span className="text-slate-500 font-medium">
                Full Name
              </span>
              <span className="text-slate-900 font-semibold break-words">
                {user.name}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 border-b border-slate-100 pb-4">
              <span className="text-slate-500 font-medium">
                Email
              </span>
              <span className="text-slate-900 font-semibold break-all">
                {user.email}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <span className="text-slate-500 font-medium">
                Role
              </span>
              <span className="inline-flex self-start sm:self-auto bg-indigo-50 text-indigo-700 px-4 py-1 rounded-full text-sm font-semibold capitalize">
                {user.role}
              </span>
            </div>
            <div><Link to="/admin/tutors">Manage Tutors</Link></div>
            

          </div>
        </section>

      </main>
    </div>
  </div>
);

}

export default AdminDashboard;