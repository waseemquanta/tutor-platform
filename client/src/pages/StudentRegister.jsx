import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/authApi";
function StudentRegister() {
  const navigater = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    if (formData.password !== formData.confirmPassword) {
      setError("Password do not match");
      return;
    }
    try {
      setLoading(true);
      await api.post("auth/student/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      navigater("/student/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Student registration failed");
    } finally {
      setLoading(false);
    }
  };
 
return (
  <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">

    {/* Registration Card */}
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">

      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
        Student Registration
      </h1>

      <p className="text-gray-500 text-center mb-8">
        Create your student account and start learning.
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

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Name */}
        <div>
          <label
            htmlFor="student-name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Full Name
          </label>

          <input
            id="student-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="name"
            placeholder="Enter your full name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Email */}
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

        {/* Password */}
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
            autoComplete="new-password"
            placeholder="Create a password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="student-confirm-password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirm Password
          </label>

          <input
            id="student-confirm-password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
            placeholder="Confirm your password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Registering..." : "Register As Student"}
        </button>

      </form>

    </div>
  </div>
);

}
export default StudentRegister;
