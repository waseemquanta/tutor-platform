import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/authApi";

function BrowseTutors() {
const [searchParams, setSearchParams] = useSearchParams();
  const querySearch = searchParams.get("search") || "";
  const queryCity = searchParams.get("city") || "";
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    search: querySearch,
    city: queryCity,
    grade: "",
    mode: "",
    maxFee: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    search: querySearch,
    city: queryCity,
  });
  useEffect(() => {
    const nextFilters = {
      search: querySearch,
      city: queryCity,
      grade: "",
      mode: "",
      maxFee: "",
    };

    setFilters(nextFilters);
    setAppliedFilters(nextFilters);
  }, [querySearch, queryCity]);
  useEffect(() => {
    let cancelled = false;

    const loadTutors = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/tutors", {
          params: appliedFilters,
        });

        if (!cancelled) {
          setTutors(response.data.tutors);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Unable to load tutors.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadTutors();

    return () => {
      cancelled = true;
    };
  }, [appliedFilters]);

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedFilters({ ...filters });
  };

  const clearFilters = () => {
  const empty = {
    search: "",
    city: "",
    grade: "",
    mode: "",
    maxFee: "",
  };

  setFilters(empty);
  setAppliedFilters(empty);
  setSearchParams({});
};

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 px-4 py-14 text-white sm:py-20">
        {/* Decorative Background */}
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-10 h-60 w-60 rounded-full bg-purple-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl text-center">
          <span className="mb-5 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-widest text-blue-100">
            YOUR LEARNING JOURNEY STARTS HERE
          </span>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Find Your Perfect Tutor
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-blue-100 sm:text-lg">
            Discover tutors who match your learning goals. Search by subject,
            location, grade, and budget.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* SEARCH FILTER PANEL */}
        <section className="relative z-10 -mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 sm:p-8">
          <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                Search Tutors
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Customize your search to find the right teacher.
              </p>
            </div>

            <span className="self-start rounded-full bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-700">
              Advanced Filters
            </span>
          </div>

          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {/* SUBJECT SEARCH */}
              <div>
                <label
                  htmlFor="search-subject"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Subject
                </label>

                <input
                  id="search-subject"
                  name="search"
                  placeholder="e.g. Mathematics"
                  value={filters.search}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              {/* CITY */}
              <div>
                <label
                  htmlFor="search-city"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  City
                </label>

                <input
                  id="search-city"
                  name="city"
                  placeholder="e.g. Lahore"
                  value={filters.city}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              {/* GRADE */}
              <div>
                <label
                  htmlFor="search-grade"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Grade Level
                </label>

                <select
                  id="search-grade"
                  name="grade"
                  value={filters.grade}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                >
                  <option value="">All Grades</option>

                  {[
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "10",
                    "11",
                    "12",
                  ].map((grade) => (
                    <option key={grade} value={grade}>
                      Grade {grade}
                    </option>
                  ))}
                </select>
              </div>

              {/* TEACHING MODE */}
              <div>
                <label
                  htmlFor="search-mode"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Teaching Mode
                </label>

                <select
                  id="search-mode"
                  name="mode"
                  value={filters.mode}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                >
                  <option value="">All Teaching Modes</option>
                  <option value="online">Online Classes</option>
                  <option value="physical">Physical / In-Person</option>
                </select>
              </div>

              {/* MAXIMUM HOURLY FEE */}
              <div>
                <label
                  htmlFor="search-fee"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Maximum Hourly Fee (PKR)
                </label>

                <input
                  id="search-fee"
                  type="number"
                  name="maxFee"
                  min="0"
                  placeholder="e.g. 2000"
                  value={filters.maxFee}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            {/* FILTER BUTTONS */}
            <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/20 transition duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300"
              >
                Search Tutors
              </button>

              <button
                type="button"
                onClick={clearFilters}
                className="rounded-xl border border-slate-200 bg-white px-7 py-3.5 font-semibold text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
              >
                Clear Filters
              </button>
            </div>
          </form>
        </section>

        {/* AVAILABLE TUTORS */}
        <section className="mt-12">
          <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-600">
                EXPLORE EDUCATORS
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Available Tutors
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Find an educator who fits your learning needs.
              </p>
            </div>

            {!loading && !error && (
              <span className="self-start rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200">
                {tutors.length} {tutors.length === 1 ? "Tutor" : "Tutors"} Found
              </span>
            )}
          </div>

          {/* LOADING */}
          {loading && (
            <div
              role="status"
              className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm"
            >
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
              <p className="font-medium text-slate-600">Loading tutors...</p>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700"
            >
              <p className="font-semibold">Unable to load tutors</p>

              <p className="mt-1 text-sm">{error}</p>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && !error && tutors.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl">
                🔎
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                No tutors found
              </h3>

              <p className="mx-auto mt-3 max-w-sm text-slate-500">
                We couldn't find tutors matching your search. Try changing your
                filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* TUTOR CARDS GRID */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {!loading &&
              !error &&
              tutors.map((tutor) => (
                <article
                  key={tutor._id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/60"
                >
                  {/* CARD HEADER */}
                  <div className="relative bg-gradient-to-r from-indigo-50 via-blue-50 to-violet-50 p-6">
                    <div className="flex items-center gap-4">
                      {/* Tutor Photo */}
                      {tutor.photo ? (
                        <img
                          src={tutor.photo}
                          alt={`Profile of ${tutor.user?.name || "tutor"}`}
                          loading="lazy"
                          className="h-20 w-20 shrink-0 rounded-2xl border-4 border-white object-cover shadow-md"
                        />
                      ) : (
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-indigo-100 text-3xl font-bold text-indigo-600 shadow-md">
                          {tutor.user?.name?.charAt(0)?.toUpperCase() || "T"}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h3 className="break-words text-xl font-bold text-slate-900">
                          {tutor.user?.name || "Tutor"}
                        </h3>

                        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          <span>✓</span>
                          Verified Tutor
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CARD BODY */}
                  <div className="flex flex-1 flex-col p-6">
                    {/* SUBJECTS */}
                    <div className="mb-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Subjects
                      </p>

                      <p className="break-words text-sm font-semibold leading-relaxed text-slate-800">
                        {tutor.subjects?.join(", ") || "Not specified"}
                      </p>
                    </div>

                    {/* GRADE LEVELS */}
                    <div className="mb-5">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Grade Levels
                      </p>

                      <p className="text-sm font-medium text-slate-700">
                        {tutor.gradeLevels?.join(", ") || "Not specified"}
                      </p>
                    </div>

                    {/* DETAILS */}
                    <div className="space-y-3 rounded-xl bg-slate-50 p-4">
                      {/* City */}
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-sm text-slate-500">Location</span>

                        <span className="text-right text-sm font-semibold text-slate-800">
                          {tutor.city || "Not specified"}
                        </span>
                      </div>

                      {/* Teaching Mode */}
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-sm text-slate-500">
                          Teaching Mode
                        </span>

                        <span className="text-right text-sm font-semibold capitalize text-indigo-700">
                          {tutor.teachingMode || "Not specified"}
                        </span>
                      </div>

                      {/* Fee */}
                      <div className="flex items-start justify-between gap-3 border-t border-slate-200 pt-3">
                        <span className="text-sm text-slate-500">
                          Hourly Fee
                        </span>

                        <span className="text-lg font-bold text-slate-900">
                          Rs. {tutor.hourlyFee}
                          <span className="text-xs font-normal text-slate-400">
                            /hr
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* RATING */}
                    <div className="mt-5 flex items-center gap-2">
                      <span className="text-lg text-amber-500">★</span>

                      <span className="text-sm font-semibold text-slate-800">
                        {tutor.totalReviews > 0
                          ? `${tutor.averageRating.toFixed(1)} (${tutor.totalReviews} reviews)`
                          : "No reviews yet"}
                      </span>
                    </div>

                    {/* VIEW PROFILE BUTTON */}
                    <Link
                      to={`/tutors/${tutor._id}`}
                      className="mt-6 block w-full rounded-xl bg-indigo-600 px-5 py-3.5 text-center text-sm font-semibold text-white transition-all duration-300 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300"
                    >
                      View Profile
                    </Link>
                  </div>
                </article>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default BrowseTutors;
