import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/authApi";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    try {
      setLoading(true);

      await api.post("/auth/admin/login", {
        email: formData.email,
        password: formData.password,
      });

      navigate("/admin/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Admin login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  
return (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">

    {/* Main Login Container */}
    <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-2xl">

      {/* Left Side - Branding */}
      <div className="hidden md:flex bg-gradient-to-br from-indigo-700 via-purple-700 to-violet-900 p-12 flex-col justify-between text-white">

        <div>
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-8">
            <span className="text-3xl font-bold">A</span>
          </div>

          <h1 className="text-4xl font-bold leading-tight mb-5">
            Admin Control
            <br />
            Center
          </h1>

          <p className="text-purple-100 text-lg leading-relaxed">
            Securely manage your tutor platform,
            monitor activities, and oversee
            your learning community.
          </p>
        </div>

        <div className="border-t border-white/20 pt-6">
          <p className="text-sm text-purple-200">
            Tutor Platform • Administration Portal
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="px-6 py-12 sm:px-10 lg:px-14 flex flex-col justify-center">

        {/* Mobile Logo */}
        <div className="md:hidden w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-6">
          <span className="text-white text-2xl font-bold">A</span>
        </div>

        <div className="mb-9">
          <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Administrator Access
          </p>

          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            Welcome Back
          </h2>

          <p className="text-slate-500">
            Sign in to access your admin dashboard.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <p
            role="alert"
            className="bg-red-50 border border-red-200 text-red-600 text-sm p-4 rounded-xl mb-6"
          >
            {error}
          </p>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}
          <div>
            <label
              htmlFor="admin-email"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              Email Address
            </label>

            <input
              id="admin-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              placeholder="admin@example.com"
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="admin-password"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              Password
            </label>

            <input
              id="admin-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Admin Login"}
          </button>

        </form>

        {/* Bottom Note */}
        <p className="text-center text-xs text-slate-400 mt-9">
          Authorized administrators only.
        </p>

      </div>
    </div>
  </div>
);

}

export default AdminLogin;