
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

 
return (
  <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">

    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">

      {/* LOGO */}
      <Link
        to="/"
        onClick={closeMenu}
        className="flex shrink-0 items-center gap-3"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-sm font-extrabold text-white shadow-lg shadow-indigo-500/20">
          TC
        </span>

        <span className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
          Tutor<span className="text-indigo-600">Connect</span>
        </span>
      </Link>

      {/* MOBILE MENU BUTTON */}
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-2xl text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 lg:hidden"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* NAVIGATION */}
      <nav
        id="main-navigation"
        aria-label="Main navigation"
        className={`${
          menuOpen ? "flex" : "hidden"
        } absolute left-0 right-0 top-full flex-col gap-2 border-b border-slate-200 bg-white px-4 py-5 shadow-xl sm:px-6 lg:static lg:flex lg:flex-row lg:items-center lg:gap-2 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}
      >

        {/* HOME */}
        <NavLink
          to="/"
          end
          onClick={closeMenu}
          className={({ isActive }) =>
            `rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 lg:py-2.5 ${
              isActive
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
            }`
          }
        >
          Home
        </NavLink>

        {/* FIND TUTORS */}
        <NavLink
          to="/student/tutors"
          onClick={closeMenu}
          className={({ isActive }) =>
            `rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 lg:py-2.5 ${
              isActive
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
            }`
          }
        >
          Find Tutors
        </NavLink>

        {/* BECOME A TUTOR */}
        <NavLink
          to="/tutor/register"
          onClick={closeMenu}
          className={({ isActive }) =>
            `rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 lg:py-2.5 ${
              isActive
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
            }`
          }
        >
          Become a Tutor
        </NavLink>

        {/* LOGIN BUTTONS */}
        <div className="mt-3 flex flex-col gap-3 border-t border-slate-100 pt-4 lg:ml-3 lg:mt-0 lg:flex-row lg:items-center lg:border-0 lg:pt-0">

          {/* STUDENT LOGIN */}
          <Link
            to="/student/login"
            onClick={closeMenu}
            className="rounded-xl border border-indigo-200 bg-white px-5 py-3 text-center text-sm font-semibold text-indigo-700 transition-all duration-200 hover:border-indigo-400 hover:bg-indigo-50 lg:py-2.5"
          >
            Student Login
          </Link>

          {/* TUTOR LOGIN */}
          <Link
            to="/tutor/login"
            onClick={closeMenu}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg lg:py-2.5"
          >
            Tutor Login
          </Link>

        </div>
      </nav>
    </div>
  </header>
);

}

export default Header;
