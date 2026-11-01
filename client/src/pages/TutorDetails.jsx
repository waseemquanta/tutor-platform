
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/authApi";

function TutorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Tutor information
  const [tutor, setTutor] = useState(null);
  const [reviews, setReviews] = useState([]);

  // Page states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Booking form
  const [booking, setBooking] = useState({
    subject: "",
    date: "",
    startTime: "",
    endTime: "",
    teachingMode: "online",
    message: "",
  });

  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Get today's date using local time
  const today = new Date().toLocaleDateString("en-CA");

  // Fetch tutor profile
  useEffect(() => {
    let cancelled = false;

    const fetchTutor = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/tutors/${id}`);

        if (cancelled) return;

        const profile = response.data.profile;

        setTutor(profile);

        // Select the tutor's first subject
        // and an available teaching mode.
        setBooking((prev) => ({
          ...prev,
          subject: profile.subjects?.[0] || "",
          teachingMode:
            profile.teachingMode === "physical"
              ? "physical"
              : "online",
        }));
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Unable to load tutor details."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTutor();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Fetch tutor reviews
  useEffect(() => {
    let cancelled = false;

    const fetchReviews = async () => {
      try {
        const response = await api.get(`/reviews/tutor/${id}`);

        if (!cancelled) {
          setReviews(response.data.reviews || []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Could not load reviews:", err);
        }
      }
    };

    fetchReviews();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Handle booking form fields
  const handleBookingChange = (event) => {
    const { name, value } = event.target;

    setBooking((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit tuition request
  const submitBooking = async (event) => {
    event.preventDefault();

    setBookingError("");
    setBookingSuccess("");

    // Frontend checks
    if (!booking.subject) {
      setBookingError("Please select a subject.");
      return;
    }

    if (!booking.date || !booking.startTime || !booking.endTime) {
      setBookingError("Please select a date and time.");
      return;
    }

    if (booking.startTime >= booking.endTime) {
      setBookingError("End time must be after start time.");
      return;
    }

    try {
      setSubmitting(true);

      // Check whether user is logged in as student
      let authResponse;

      try {
        authResponse = await api.get("/auth/me");
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/student/login");
          return;
        }
        throw err;
      }

      if (authResponse.data.user.role !== "student") {
        setBookingError(
          "Only students can request tuition classes. Please log in as a student."
        );
        return;
      }

      // Send booking to backend
      await api.post("/bookings", {
        tutorId: id,
        subject: booking.subject,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        teachingMode: booking.teachingMode,
        message: booking.message,
      });

      setBookingSuccess("Tuition request sent successfully!");

      // Redirect to student bookings
      navigate("/student/bookings");
    } catch (err) {
      setBookingError(
        err.response?.data?.message ||
          "Unable to send tuition request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Loading screen
  if (loading) {
    return <p>Loading tutor details...</p>;
  }

  // Error screen
  if (error) {
    return (
      <div>
        <p role="alert">{error}</p>
        <Link to="/student/tutors">Back to Tutors</Link>
      </div>
    );
  }

  if (!tutor) {
    return <p>Tutor not found.</p>;
  }

  
return (
  <main className="min-h-screen bg-slate-50 pb-16">

    {/* HEADER */}
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 px-4 pb-28 pt-10 sm:px-6">

      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">

        <Link
          to="/student/tutors"
          className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
        >
          ← Back to Tutors
        </Link>

        <div className="mt-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-200">
            TUTOR PLATFORM
          </p>

          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Tutor Profile
          </h1>

          <p className="mt-3 text-blue-100">
            Explore tutor details, availability, and reviews.
          </p>
        </div>
      </div>
    </section>

    <div className="relative mx-auto -mt-20 max-w-5xl space-y-7 px-4 sm:px-6">

      {/* TUTOR PROFILE CARD */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">

        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">

          {tutor.photo ? (
            <img
              src={tutor.photo}
              alt={tutor.user?.name || "Tutor"}
              className="h-32 w-32 shrink-0 rounded-full border-4 border-indigo-100 object-cover shadow-lg"
            />
          ) : (
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-5xl font-bold text-indigo-600">
              {tutor.user?.name?.charAt(0)?.toUpperCase() || "T"}
            </div>
          )}

          <div className="min-w-0 flex-1">

            <h2 className="break-words text-3xl font-bold text-slate-900">
              {tutor.user?.name || "Tutor"}
            </h2>

            <div className="mt-3">
              <span
                className={`inline-flex rounded-full px-4 py-2 text-xs font-semibold ${
                  tutor.verificationStatus === "approved"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {tutor.verificationStatus === "approved"
                  ? "✓ Verified Tutor"
                  : "Verification Pending"}
              </span>
            </div>

            <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
              📍
              {[tutor.location, tutor.city]
                .filter(Boolean)
                .join(", ") || "Location not specified"}
            </p>

            <p className="mt-3 text-sm font-medium text-slate-700">
              {tutor.totalReviews > 0
                ? `⭐ ${tutor.averageRating.toFixed(1)} / 5 (${tutor.totalReviews} reviews)`
                : "No ratings yet"}
            </p>
          </div>

          <div className="w-full rounded-2xl border border-indigo-100 bg-indigo-50 p-5 text-center sm:w-auto">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
              Hourly Fee
            </p>
            <p className="mt-2 text-2xl font-extrabold text-indigo-700">
              Rs. {tutor.hourlyFee}
            </p>
            <p className="text-sm text-slate-500">per hour</p>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-4 text-xl font-bold text-slate-900">
          👤 About Me
        </h2>

        <p className="whitespace-pre-line break-words leading-8 text-slate-600">
          {tutor.bio || "This tutor has not added a bio yet."}
        </p>
      </section>

      {/* SUBJECTS AND GRADES */}
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2">

        {/* SUBJECTS */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-5 text-xl font-bold text-slate-900">
            📚 Subjects Taught
          </h2>

          {tutor.subjects?.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {tutor.subjects.map((subject, index) => (
                <li
                  key={`${subject}-${index}`}
                  className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700"
                >
                  {subject}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500">No subjects added.</p>
          )}
        </section>

        {/* GRADES */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-5 text-xl font-bold text-slate-900">
            🎓 Class / Grade Levels
          </h2>

          {tutor.gradeLevels?.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {tutor.gradeLevels.map((grade, index) => (
                <li
                  key={`${grade}-${index}`}
                  className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700"
                >
                  Grade {grade}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500">
              No grade levels added.
            </p>
          )}
        </section>
      </div>

      {/* TEACHING MODE AND EDUCATION */}
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2">

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-5 text-xl font-bold text-slate-900">
            💻 Teaching Mode
          </h2>

          <div className="rounded-xl bg-indigo-50 p-5">
            <p className="font-semibold text-indigo-700">
              {tutor.teachingMode === "both"
                ? "Online and Physical Classes"
                : tutor.teachingMode === "online"
                  ? "Online Classes"
                  : tutor.teachingMode === "physical"
                    ? "Physical Classes"
                    : "Not specified"}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-5 text-xl font-bold text-slate-900">
            🎓 Education & Experience
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">Education</p>
              <p className="mt-1 font-semibold text-slate-800">
                {tutor.education || "Not provided"}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <p className="text-sm text-slate-500">
                Teaching Experience
              </p>
              <p className="mt-1 font-semibold text-slate-800">
                {tutor.experienceYears ?? 0} years
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* AVAILABILITY */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

        <h2 className="mb-2 text-xl font-bold text-slate-900">
          📅 Available Days & Timings
        </h2>

        <p className="mb-6 text-sm text-slate-500">
          Check the tutor's weekly availability before booking.
        </p>

        {tutor.availability?.length > 0 ? (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {tutor.availability.map((slot) => (
              <li
                key={slot.day}
                className="flex flex-col gap-2 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <strong className="text-slate-800">
                  {slot.day}
                </strong>

                <span className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-indigo-700">
                  {slot.startTime} – {slot.endTime}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl bg-slate-50 p-5 text-slate-500">
            No availability added yet.
          </p>
        )}

        <p className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
          Please select a date and time that matches
          the tutor's availability.
        </p>
      </section>

      {/* BOOKING FORM */}
      <section className="overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-xl shadow-indigo-100/40">

        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 px-6 py-8 text-white sm:px-8">

          <h2 className="text-2xl font-bold">
            📅 Request a Tuition Class
          </h2>

          <p className="mt-2 text-sm text-indigo-100">
            Fill in the form below to request a class
            with this tutor.
          </p>
        </div>

        <div className="p-6 sm:p-8">

          {bookingError && (
            <p
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
            >
              {bookingError}
            </p>
          )}

          {bookingSuccess && (
            <p
              role="status"
              className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700"
            >
              {bookingSuccess}
            </p>
          )}

          <form onSubmit={submitBooking} className="space-y-6">

            {/* SUBJECT */}
            <div>
              <label
                htmlFor="subject"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Subject
              </label>

              <select
                id="subject"
                name="subject"
                value={booking.subject}
                onChange={handleBookingChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              >
                <option value="">Select Subject</option>

                {tutor.subjects?.map((subject, index) => (
                  <option key={index} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            {/* SCHEDULE */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">

              <h3 className="mb-5 text-lg font-bold text-slate-900">
                Schedule Your Session
              </h3>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div className="sm:col-span-2">
                  <label
                    htmlFor="date"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Preferred Date
                  </label>

                  <input
                    id="date"
                    type="date"
                    name="date"
                    min={today}
                    value={booking.date}
                    onChange={handleBookingChange}
                    required
                    className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="startTime"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Start Time
                  </label>

                  <input
                    id="startTime"
                    type="time"
                    name="startTime"
                    value={booking.startTime}
                    onChange={handleBookingChange}
                    required
                    className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="endTime"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    End Time
                  </label>

                  <input
                    id="endTime"
                    type="time"
                    name="endTime"
                    value={booking.endTime}
                    onChange={handleBookingChange}
                    required
                    className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
              </div>
            </div>

            {/* TEACHING MODE */}
            <div>
              <label
                htmlFor="teachingMode"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Teaching Mode
              </label>

              <select
                id="teachingMode"
                name="teachingMode"
                value={booking.teachingMode}
                onChange={handleBookingChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              >
                {(tutor.teachingMode === "both" ||
                  tutor.teachingMode === "online") && (
                  <option value="online">Online</option>
                )}

                {(tutor.teachingMode === "both" ||
                  tutor.teachingMode === "physical") && (
                  <option value="physical">Physical</option>
                )}
              </select>
            </div>

            {/* MESSAGE */}
            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Message to Tutor (Optional)
              </label>

              <textarea
                id="message"
                name="message"
                rows={4}
                maxLength={1000}
                placeholder="Explain what you need help with..."
                value={booking.message}
                onChange={handleBookingChange}
                className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />

              <p className="mt-2 text-right text-xs text-slate-400">
                {booking.message?.length || 0} / 1000 characters
              </p>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Sending Request..."
                : "Send Tuition Request"}
            </button>

          </form>
        </div>
      </section>

      {/* STUDENT REVIEWS */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          ⭐ Student Reviews
        </h2>

        {reviews.length === 0 ? (
          <div className="rounded-xl bg-slate-50 p-8 text-center text-slate-500">
            No reviews yet.
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <article
                key={review._id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-indigo-200 hover:shadow-md"
              >

                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                  <h3 className="font-bold text-slate-900">
                    {review.student?.name || "Student"}
                  </h3>

                  <span className="text-sm font-semibold text-amber-600">
                    ⭐ {review.rating}/5
                  </span>
                </div>

                <p className="whitespace-pre-line break-words leading-relaxed text-slate-600">
                  {review.comment}
                </p>

                <p className="mt-4 text-xs text-slate-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

    </div>
  </main>
);

}

export default TutorDetails;
