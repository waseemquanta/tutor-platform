import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/authApi";
function StudentLogin() {
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
      await api.post("/auth/student/login", {
        email: formData.email,
        password: formData.password,
      });
      navigate("/student/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Student login failed");
    } finally {
      setLoading(false);
    }
  };
  
return (
  <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">

    {/* Login Card */}
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">

      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
        Student Login
      </h1>

      <p className="text-gray-500 text-center mb-8">
        Welcome back! Login to continue learning.
      </p>

      {/* Error Message */}
      {error && (
        <p
          role="alert"
          className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg mb-5 text-sm"
        >
          {error}
        </p>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Email Field */}
        <div>
          <label
            htmlFor="student-email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>

          <input
            id="student-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="student-password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>

          <input
            id="student-password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            placeholder="Enter your password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Student Login"}
        </button>

      </form>
    </div>
  </div>
);

}
export default StudentLogin;
