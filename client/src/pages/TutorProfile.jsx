
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/authApi";

const days = [
  "Monday", "Tuesday", "Wednesday", "Thursday",
  "Friday", "Saturday", "Sunday",
];

const initialForm = {
  photo: "",
  bio: "",
  subjects: "",
  gradeLevels: "",
  hourlyFee: "",
  teachingMode: "online",
  city: "",
  location: "",
  education: "",
  experienceYears: "",
  availability: [],
};

function TutorProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [userName, setUserName] = useState("");
  const [status, setStatus] = useState("pending");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load existing profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const auth = await api.get("/auth/me");

        if (auth.data.user.role !== "tutor") {
          navigate("/tutor/login", { replace: true });
          return;
        }

        setUserName(auth.data.user.name);

        const response = await api.get("/tutors/me");
        const profile = response.data.profile;

        if (profile) {
          setForm({
            photo: profile.photo || "",
            bio: profile.bio || "",
            subjects: profile.subjects.join(", "),
            gradeLevels: profile.gradeLevels.join(", "),
            hourlyFee: String(profile.hourlyFee),
            teachingMode: profile.teachingMode,
            city: profile.city || "",
            location: profile.location || "",
            education: profile.education || "",
            experienceYears: String(profile.experienceYears),
            availability: profile.availability || [],
          });

          setStatus(profile.verificationStatus);
          setRating(profile.averageRating);
          setReviews(profile.totalReviews);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/tutor/login", { replace: true });
        } else {
          setError("Unable to load profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add or remove a day
  const toggleDay = (day) => {
    setForm(prev => {
      const exists = prev.availability.some(
        item => item.day === day
      );

      return {
        ...prev,
        availability: exists
          ? prev.availability.filter(item => item.day !== day)
          : [
              ...prev.availability,
              {
                day,
                startTime: "16:00",
                endTime: "20:00",
              },
            ],
      };
    });
  };

  // Change timing of a selected day
  const changeTime = (day, field, value) => {
    setForm(prev => ({
      ...prev,
      availability: prev.availability.map(item =>
        item.day === day
          ? { ...item, [field]: value }
          : item
      ),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    const splitList = (value) =>
      value.split(",").map(v => v.trim()).filter(Boolean);

    const data = {
      photo: form.photo,
      bio: form.bio,
      subjects: splitList(form.subjects),
      gradeLevels: splitList(form.gradeLevels),
      hourlyFee: Number(form.hourlyFee),
      teachingMode: form.teachingMode,
      city: form.city,
      location: form.location,
      education: form.education,
      experienceYears: Number(form.experienceYears),
      availability: form.availability,
    };

    try {
      setSaving(true);

      await api.put("/tutors/me", data);

      setMessage("Profile saved successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to save profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading tutor profile...</p>;

  
return (
  <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:py-12">
    <div className="mx-auto max-w-5xl space-y-8">

      {/* PROFILE HEADER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 p-7 text-white shadow-xl sm:p-10">

        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 right-20 h-48 w-48 rounded-full bg-purple-300/20 blur-2xl" />

        <div className="relative z-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
            TUTOR PLATFORM
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            My Tutor Profile
          </h1>

          <p className="mt-2 text-blue-100">
            Build a great profile and connect with more students.
          </p>

          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center">

            {/* Avatar */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/20 text-3xl font-bold shadow-lg backdrop-blur-sm">
              {userName?.charAt(0)?.toUpperCase() || "T"}
            </div>

            {/* User Details */}
            <div className="min-w-0 flex-1">
              <h2 className="break-words text-2xl font-bold">
                {userName}
              </h2>

              <div className="mt-3 flex flex-wrap gap-2">

                {/* Verification */}
                <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                  Verification: {status}
                </span>

                {/* Rating */}
                <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                  ★ {rating} ({reviews} reviews)
                </span>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUCCESS MESSAGE */}
      {message && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-800"
        >
          <span className="text-lg">✓</span>
          <p>{message}</p>
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700"
        >
          <span className="text-lg">!</span>
          <p>{error}</p>
        </div>
      )}

      {/* PROFILE FORM */}
      <form onSubmit={handleSubmit} className="space-y-7">

        {/* SECTION 1: PERSONAL INFORMATION */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="mb-7 flex items-start gap-4 border-b border-slate-100 pb-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600">
              01
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Personal Information
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Introduce yourself to your future students.
              </p>
            </div>
          </div>

          <div className="space-y-6">

            {/* Photo URL */}
            <div>
              <label
                htmlFor="profile-photo"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Profile Photo URL (HTTPS)
              </label>

              <input
                id="profile-photo"
                type="url"
                name="photo"
                value={form.photo}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            {/* Bio */}
            <div>
              <label
                htmlFor="profile-bio"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                About You / Bio
              </label>

              <textarea
                id="profile-bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell students about your teaching style, passion, and experience..."
                maxLength={2000}
                rows={5}
                className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />

              <p className="mt-2 text-right text-xs text-slate-400">
                {form.bio.length} / 2000 characters
              </p>
            </div>

          </div>
        </section>

        {/* SECTION 2: TEACHING DETAILS */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="mb-7 flex items-start gap-4 border-b border-slate-100 pb-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-lg font-bold text-violet-600">
              02
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Teaching Details
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Set your teaching subjects, grades, and fees.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            {/* Subjects */}
            <div className="md:col-span-2">
              <label
                htmlFor="subjects"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Subjects
              </label>

              <input
                id="subjects"
                name="subjects"
                value={form.subjects}
                onChange={handleChange}
                placeholder="Mathematics, Physics, Chemistry"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />

              <p className="mt-2 text-xs text-slate-400">
                Separate multiple subjects with commas.
              </p>
            </div>

            {/* Grade Levels */}
            <div>
              <label
                htmlFor="grade-levels"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Grade Levels
              </label>

              <input
                id="grade-levels"
                name="gradeLevels"
                value={form.gradeLevels}
                onChange={handleChange}
                placeholder="9, 10, 11, 12"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            {/* Hourly Fee */}
            <div>
              <label
                htmlFor="hourly-fee"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Hourly Fee (PKR)
              </label>

              <input
                id="hourly-fee"
                type="number"
                name="hourlyFee"
                value={form.hourlyFee}
                onChange={handleChange}
                min="0"
                required
                placeholder="e.g. 1500"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            {/* Teaching Mode */}
            <div className="md:col-span-2">
              <label
                htmlFor="teaching-mode"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Teaching Mode
              </label>

              <select
                id="teaching-mode"
                name="teachingMode"
                value={form.teachingMode}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              >
                <option value="online">Online Classes</option>
                <option value="physical">Physical / In-Person Classes</option>
                <option value="both">Both Online & Physical</option>
              </select>
            </div>

          </div>
        </section>

        {/* SECTION 3: LOCATION */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="mb-7 flex items-start gap-4 border-b border-slate-100 pb-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-lg font-bold text-emerald-600">
              03
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Location
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Help students find tutors in their area.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            {/* City */}
            <div>
              <label
                htmlFor="city"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                City
              </label>

              <input
                id="city"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Lahore"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            {/* Area */}
            <div>
              <label
                htmlFor="location"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Area / Location
              </label>

              <input
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Johar Town"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

          </div>
        </section>

        {/* SECTION 4: QUALIFICATIONS */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="mb-7 flex items-start gap-4 border-b border-slate-100 pb-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-lg font-bold text-amber-600">
              04
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Qualifications
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Share your education and teaching experience.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            {/* Education */}
            <div>
              <label
                htmlFor="education"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Highest Education
              </label>

              <input
                id="education"
                name="education"
                value={form.education}
                onChange={handleChange}
                placeholder="BS Computer Science"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            {/* Experience */}
            <div>
              <label
                htmlFor="experience"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Years of Experience
              </label>

              <input
                id="experience"
                type="number"
                name="experienceYears"
                value={form.experienceYears}
                onChange={handleChange}
                min="0"
                max="70"
                required
                placeholder="e.g. 5"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

          </div>
        </section>

        {/* SECTION 5: AVAILABILITY */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="mb-7 flex items-start gap-4 border-b border-slate-100 pb-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-lg font-bold text-rose-600">
              05
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Teaching Availability
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Choose the days and hours you are available to teach.
              </p>
            </div>
          </div>

          <div className="space-y-3">

            {days.map(day => {
              const selected = form.availability.find(
                item => item.day === day
              );

              return (
                <div
                  key={day}
                  className={`rounded-xl border p-4 transition-all duration-200 ${
                    selected
                      ? "border-indigo-300 bg-indigo-50/60 shadow-sm"
                      : "border-slate-200 bg-slate-50 hover:border-indigo-200"
                  }`}
                >

                  {/* Day Checkbox */}
                  <label className="flex cursor-pointer items-center gap-3">

                    <input
                      type="checkbox"
                      checked={Boolean(selected)}
                      onChange={() => toggleDay(day)}
                      className="h-5 w-5 rounded border-slate-300 accent-indigo-600"
                    />

                    <span className="flex-1 font-semibold text-slate-800">
                      {day}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        selected
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {selected ? "Available" : "Unavailable"}
                    </span>

                  </label>

                  {/* Selected Day Times */}
                  {selected && (
                    <div className="mt-4 grid grid-cols-1 gap-4 border-t border-indigo-100 pt-4 sm:grid-cols-2">

                      {/* Start Time */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-600">
                          From
                          <input
                            type="time"
                            value={selected.startTime}
                            onChange={e =>
                              changeTime(
                                day,
                                "startTime",
                                e.target.value
                              )
                            }
                            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                          />
                        </label>
                      </div>

                      {/* End Time */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-600">
                          To
                          <input
                            type="time"
                            value={selected.endTime}
                            onChange={e =>
                              changeTime(
                                day,
                                "endTime",
                                e.target.value
                              )
                            }
                            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                          />
                        </label>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}

          </div>
        </section>

        {/* SAVE PROFILE BUTTON */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">

            <div>
              <h3 className="font-bold text-slate-900">
                Ready to update your profile?
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Save your changes to keep your tutor information updated.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full shrink-0 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {saving ? "Saving..." : "Save Tutor Profile"}
            </button>

          </div>
        </div>

      </form>
    </div>
  </main>
);

    
}

export default TutorProfile;
