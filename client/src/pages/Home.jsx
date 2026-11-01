
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/authApi";

const subjects = [
  { name: "Mathematics", icon: "📐" },
  { name: "Physics", icon: "⚛️" },
  { name: "Chemistry", icon: "🧪" },
  { name: "English", icon: "📚" },
  { name: "Biology", icon: "🧬" },
  { name: "Computer Science", icon: "💻" },
];

function Home() {
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");
  const [city, setCity] = useState("");
  const [tutors, setTutors] = useState([]);
  const [tutorsLoading, setTutorsLoading] = useState(true);
  const [tutorsError, setTutorsError] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchTutors = async () => {
      try {
        const res = await api.get("/tutors");

        if (active) {
          setTutors(res.data.tutors.slice(0, 3));
        }
      } catch (err) {
        if (active) setTutorsError(true);
      } finally {
        if (active) setTutorsLoading(false);
      }
    };

    fetchTutors();

    return () => {
      active = false;
    };
  }, []);

  const searchTutors = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (subject.trim()) params.set("search", subject.trim());
    if (city.trim()) params.set("city", city.trim());

    navigate(`/student/tutors?${params.toString()}`);
  };

  const browseSubject = (name) => {
    navigate(`/student/tutors?search=${encodeURIComponent(name)}`);
  };

  
return (
  <main className="min-h-screen bg-white">

    {/* HERO SECTION */}
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 text-white">

      {/* Decorative Background */}
      <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-0 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-28">

        {/* HERO CONTENT */}
        <div>
          <span className="inline-flex rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-indigo-200">
            YOUR LEARNING JOURNEY STARTS HERE
          </span>

          <h1 className="mt-7 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Find the Right Tutor.
            <span className="mt-2 block bg-gradient-to-r from-blue-300 via-indigo-300 to-violet-300 bg-clip-text text-transparent">
              Learn With Confidence.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
            Connect with tutors for Mathematics,
            Science, English, Computer Science,
            and more. Learn online or in person.
          </p>

          {/* HERO SEARCH */}
          <form
            onSubmit={searchTutors}
            className="mt-8 rounded-2xl border border-white/10 bg-white p-3 shadow-2xl shadow-indigo-950/30"
          >
            <div className="flex flex-col gap-3">

              <input
                type="text"
                placeholder="What subject do you need?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                aria-label="Subject"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />

              <input
                type="text"
                placeholder="City (optional)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                aria-label="City"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:from-blue-700 hover:to-indigo-700"
              >
                Find Tutors →
              </button>
            </div>
          </form>

          {/* HERO ACTION BUTTONS */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">

            <Link
              to="/student/register"
              className="rounded-xl bg-indigo-600 px-6 py-3.5 text-center text-sm font-bold text-white transition hover:bg-indigo-500"
            >
              Get Started as Student
            </Link>

            <Link
              to="/tutor/register"
              className="rounded-xl border border-white/30 bg-white/5 px-6 py-3.5 text-center text-sm font-bold text-white transition hover:bg-white/10"
            >
              Become a Tutor
            </Link>

          </div>
        </div>

        {/* HERO VISUAL */}
        <div className="relative lg:pl-6">

          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 blur-2xl" />

          <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-7 shadow-2xl backdrop-blur-xl sm:p-10">

            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-5xl shadow-lg">
              🎓
            </div>

            <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Better Learning
              <span className="block text-blue-300">
                Starts Here
              </span>
            </h2>

            <p className="mt-5 leading-8 text-indigo-100">
              Find subject experts, choose flexible
              schedules, and connect with your tutor.
            </p>

            {/* FEATURE TAGS */}
            <div className="mt-8 grid gap-3">

              {[
                "📚 Expert Tutors",
                "💻 Online Learning",
                "📅 Flexible Schedule"
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center rounded-xl border border-white/10 bg-white/10 px-5 py-4 font-medium text-white"
                >
                  {feature}
                </div>
              ))}

            </div>

          </div>
        </div>
      </div>
    </section>

    {/* SUBJECTS SECTION */}
    <section className="bg-white px-5 py-20 sm:px-6 lg:py-24">

      <div className="mx-auto max-w-7xl">

        {/* SECTION HEADING */}
        <div className="mx-auto mb-12 max-w-2xl text-center">

          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            EXPLORE SUBJECTS
          </span>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            What Would You Like to Learn?
          </h2>

          <p className="mt-4 text-lg text-slate-500">
            Discover tutors across popular subjects.
          </p>
        </div>

        {/* SUBJECT CARDS */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">

          {subjects.map((item) => (
            <button
              type="button"
              key={item.name}
              onClick={() => browseSubject(item.name)}
              className="group flex flex-col items-start rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100 sm:p-7"
            >

              <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-3xl transition group-hover:bg-indigo-100">
                {item.icon}
              </span>

              <strong className="text-base font-bold text-slate-900 sm:text-lg">
                {item.name}
              </strong>

              <span className="mt-3 text-sm font-semibold text-indigo-600 transition group-hover:translate-x-1">
                Explore Tutors →
              </span>

            </button>
          ))}

        </div>
      </div>
    </section>

    {/* HOW IT WORKS */}
    <section className="bg-slate-50 px-5 py-20 sm:px-6 lg:py-24">

      <div className="mx-auto max-w-7xl">

        <div className="mx-auto mb-12 max-w-2xl text-center">

          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            SIMPLE PROCESS
          </span>

          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            How TutorConnect Works
          </h2>

          <p className="mt-4 text-lg text-slate-500">
            Start your learning journey in three steps.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-3">

          {/* STEP 1 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-lg">

            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-xl font-extrabold text-blue-600">
              01
            </span>

            <h3 className="mt-7 text-xl font-bold text-slate-900">
              Search for Tutors
            </h3>

            <p className="mt-4 leading-7 text-slate-500">
              Find tutors by subject, city, teaching
              mode, grade level, and hourly fee.
            </p>
          </div>

          {/* STEP 2 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-lg">

            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-xl font-extrabold text-violet-600">
              02
            </span>

            <h3 className="mt-7 text-xl font-bold text-slate-900">
              Send a Tuition Request
            </h3>

            <p className="mt-4 leading-7 text-slate-500">
              Choose a tutor, select a suitable time,
              and send a request for your lesson.
            </p>
          </div>

          {/* STEP 3 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-lg">

            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-xl font-extrabold text-emerald-600">
              03
            </span>

            <h3 className="mt-7 text-xl font-bold text-slate-900">
              Start Learning
            </h3>

            <p className="mt-4 leading-7 text-slate-500">
              Once your tutor accepts, attend your
              lesson and share your feedback afterward.
            </p>
          </div>

        </div>
      </div>
    </section>

    {/* FEATURED TUTORS */}
    <section className="bg-white px-5 py-20 sm:px-6 lg:py-24">

      <div className="mx-auto max-w-7xl">

        <div className="mx-auto mb-12 max-w-2xl text-center">

          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            MEET OUR TUTORS
          </span>

          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Explore Approved Tutors
          </h2>

          <p className="mt-4 text-lg text-slate-500">
            Discover tutor profiles and find
            someone who matches your learning goals.
          </p>
        </div>

        {/* LOADING */}
        {tutorsLoading && (
          <div role="status" className="py-12 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
            <p className="text-slate-500">
              Loading tutors...
            </p>
          </div>
        )}

        {/* ERROR */}
        {tutorsError && (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700"
          >
            Unable to load tutors right now.
          </p>
        )}

        {/* NO TUTORS */}
        {!tutorsLoading && !tutorsError && tutors.length === 0 && (
          <p className="rounded-2xl bg-slate-50 p-10 text-center text-slate-500">
            Tutor profiles will appear here after admin approval.
          </p>
        )}

        {/* TUTOR GRID */}
        {!tutorsLoading && !tutorsError && (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">

            {tutors.map((tutor) => (
              <article
                key={tutor._id}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
              >

                {/* CARD HEADER */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6">

                  {tutor.photo ? (
                    <img
                      src={tutor.photo}
                      alt={tutor.user?.name || "Tutor"}
                      loading="lazy"
                      className="h-20 w-20 rounded-2xl border-4 border-white object-cover shadow-md"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-100 text-3xl">
                      👨‍🏫
                    </div>
                  )}

                  <h3 className="mt-5 text-xl font-bold text-slate-900">
                    {tutor.user?.name || "Tutor"}
                  </h3>

                  <span className="mt-3 inline-flex rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                    ✓ Approved Tutor
                  </span>
                </div>

                {/* CARD DETAILS */}
                <div className="flex flex-1 flex-col p-6">

                  <p className="mb-3 text-sm font-medium leading-6 text-slate-700">
                    {tutor.subjects?.join(", ") || "Subjects not specified"}
                  </p>

                  <p className="mb-3 text-sm text-slate-500">
                    📍 {tutor.city || "Online"}
                  </p>

                  <p className="mb-6 text-sm font-medium text-slate-700">
                    ⭐ {tutor.totalReviews > 0
                      ? `${tutor.averageRating.toFixed(1)} (${tutor.totalReviews} reviews)`
                      : "No reviews yet"}
                  </p>

                  {/* PRICE + PROFILE */}
                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-5">

                    <strong className="text-lg font-extrabold text-slate-900">
                      Rs. {tutor.hourlyFee}
                      <span className="text-xs font-normal text-slate-400">
                        /hr
                      </span>
                    </strong>

                    <Link
                      to={`/tutors/${tutor._id}`}
                      className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                    >
                      View Profile
                    </Link>
                  </div>

                </div>
              </article>
            ))}

          </div>
        )}

        {/* VIEW ALL BUTTON */}
        <div className="mt-12 text-center">

          <Link
            to="/student/tutors"
            className="inline-flex items-center justify-center rounded-xl border-2 border-indigo-200 bg-white px-8 py-3.5 font-bold text-indigo-700 transition hover:border-indigo-500 hover:bg-indigo-50"
          >
            View All Tutors →
          </Link>

        </div>
      </div>
    </section>

    {/* CALL TO ACTION */}
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 px-5 py-20 text-white sm:px-6 lg:py-24">

      <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

      <div className="relative mx-auto max-w-3xl text-center">

        <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">
          START TODAY
        </span>

        <h2 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">
          Ready to Start Your Learning Journey?
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-indigo-100">
          Whether you're looking for a tutor or want
          to share your knowledge, get started today.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">

          <Link
            to="/student/register"
            className="rounded-xl bg-white px-8 py-4 text-center font-bold text-indigo-700 shadow-lg transition hover:bg-indigo-50"
          >
            Find a Tutor
          </Link>

          <Link
            to="/tutor/register"
            className="rounded-xl border border-white/40 bg-white/10 px-8 py-4 text-center font-bold text-white transition hover:bg-white/20"
          >
            Become a Tutor
          </Link>

        </div>
      </div>
    </section>

  </main>
);

}

export default Home;
