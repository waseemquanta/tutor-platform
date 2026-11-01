
import { Link } from "react-router-dom";

function Footer() {
  
return (
  <footer className="bg-slate-950 text-slate-300">

    {/* MAIN FOOTER */}
    <div className="mx-auto max-w-7xl px-6 pb-12 pt-16 sm:px-8 lg:pt-20">

      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">

        {/* BRAND SECTION */}
        <div className="lg:pr-6">

          {/* Logo */}
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-3"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-sm font-extrabold text-white shadow-lg shadow-indigo-500/20">
              TC
            </span>

            <span className="text-2xl font-extrabold tracking-tight text-white">
              Tutor<span className="text-indigo-400">Connect</span>
            </span>
          </Link>

          <p className="max-w-xs text-sm leading-7 text-slate-400">
            Connecting students with tutors for better
            learning experiences, online or in person.
          </p>

          <div className="mt-7 h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />

          <p className="mt-5 text-sm font-medium text-indigo-300">
            Learn. Teach. Grow.
          </p>

        </div>

        {/* EXPLORE */}
        <div>

          <h3 className="mb-6 text-base font-bold text-white">
            Explore
          </h3>

          <nav aria-label="Explore" className="flex flex-col items-start gap-4">

            <Link
              to="/"
              className="text-sm text-slate-400 transition duration-200 hover:translate-x-1 hover:text-indigo-400"
            >
              Home
            </Link>

            <Link
              to="/student/tutors"
              className="text-sm text-slate-400 transition duration-200 hover:translate-x-1 hover:text-indigo-400"
            >
              Find Tutors
            </Link>

            <Link
              to="/tutor/register"
              className="text-sm text-slate-400 transition duration-200 hover:translate-x-1 hover:text-indigo-400"
            >
              Become a Tutor
            </Link>

          </nav>
        </div>

        {/* FOR STUDENTS */}
        <div>

          <h3 className="mb-6 text-base font-bold text-white">
            For Students
          </h3>

          <nav aria-label="For students" className="flex flex-col items-start gap-4">

            <Link
              to="/student/register"
              className="text-sm text-slate-400 transition duration-200 hover:translate-x-1 hover:text-indigo-400"
            >
              Create Account
            </Link>

            <Link
              to="/student/login"
              className="text-sm text-slate-400 transition duration-200 hover:translate-x-1 hover:text-indigo-400"
            >
              Student Login
            </Link>

            <Link
              to="/student/dashboard"
              className="text-sm text-slate-400 transition duration-200 hover:translate-x-1 hover:text-indigo-400"
            >
              Student Dashboard
            </Link>

          </nav>
        </div>

        {/* FOR TUTORS */}
        <div>

          <h3 className="mb-6 text-base font-bold text-white">
            For Tutors
          </h3>

          <nav aria-label="For tutors" className="flex flex-col items-start gap-4">

            <Link
              to="/tutor/register"
              className="text-sm text-slate-400 transition duration-200 hover:translate-x-1 hover:text-indigo-400"
            >
              Become a Tutor
            </Link>

            <Link
              to="/tutor/login"
              className="text-sm text-slate-400 transition duration-200 hover:translate-x-1 hover:text-indigo-400"
            >
              Tutor Login
            </Link>

            <Link
              to="/tutor/dashboard"
              className="text-sm text-slate-400 transition duration-200 hover:translate-x-1 hover:text-indigo-400"
            >
              Tutor Dashboard
            </Link>

          </nav>
        </div>

      </div>
    </div>

    {/* BOTTOM FOOTER */}
    <div className="border-t border-slate-800/80">

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-7 text-center sm:flex-row sm:px-8 sm:text-left">

        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} TutorConnect.
          All rights reserved.
        </p>

        <p className="text-sm font-medium text-slate-400">
          Made for better learning
          <span className="mx-2 text-indigo-400">•</span>
          Learn • Teach • Grow
        </p>

      </div>
    </div>

  </footer>
);

}

export default Footer;
