
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/authApi";

function AdminTutors() {
  const navigate = useNavigate();

  const [tutors, setTutors] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadTutors = async () => {
    const res = await api.get("/admin/tutors");
    setTutors(res.data.tutors);
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const auth = await api.get("/auth/me");

        if (auth.data.user.role !== "admin") {
          navigate("/admin/login", { replace: true });
          return;
        }

        await loadTutors();
      } catch (err) {
        if (err.response?.status === 401 ||
            err.response?.status === 403) {
          navigate("/admin/login", { replace: true });
        } else {
          setError("Unable to load tutors");
        }
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [navigate]);

  const updateVerification = async (id, status) => {
    try {
      setError("");

      await api.patch(
        `/admin/tutors/${id}/verification`,
        { verificationStatus: status }
      );

      await loadTutors();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to update verification"
      );
    }
  };

  if (loading) return <p>Loading tutors...</p>;

  
return (
  <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-10">

    <div className="mx-auto max-w-7xl space-y-8">

      {/* PAGE HEADER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-800 p-7 text-white shadow-xl sm:p-10">

        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-300">
            ADMINISTRATION PORTAL
          </p>

          <h1 className="text-3xl font-extrabold sm:text-4xl">
            Manage Tutors
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
            Review tutor profiles, manage verification
            requests, and maintain your tutoring platform.
          </p>

          {/* TOTAL TUTORS */}
          <div className="mt-8 inline-flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-6 py-4 backdrop-blur-sm">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/30 text-2xl">
              👨‍🏫
            </div>

            <div>
              <p className="text-xs font-medium text-indigo-200">
                Total Tutor Profiles
              </p>

              <p className="text-3xl font-extrabold text-white">
                {tutors.length}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ERROR MESSAGE */}
      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm font-medium text-red-700"
        >
          {error}
        </div>
      )}

      {/* TUTORS SECTION */}
      <section>

        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Tutor Profiles
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review and manage tutor verification status.
            </p>
          </div>

          <span className="self-start rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-700">
            {tutors.length} Total Tutors
          </span>
        </div>

        {/* EMPTY STATE */}
        {!error && tutors.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl">
              👨‍🏫
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              No Tutor Profiles Found
            </h3>

            <p className="mt-2 text-slate-500">
              Tutor profiles will appear here when available.
            </p>
          </div>
        )}

        {/* TUTOR CARDS */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {tutors.map((tutor) => (

            <article
              key={tutor._id}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-lg"
            >

              {/* CARD HEADER */}
              <div className="flex flex-col gap-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/70 p-6 sm:flex-row sm:items-center sm:justify-between">

                {/* Tutor Name */}
                <div className="flex min-w-0 items-center gap-4">

                  {/* Avatar */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-xl font-bold text-indigo-700">
                    {tutor.user?.name?.charAt(0)?.toUpperCase() || "T"}
                  </div>

                  <div className="min-w-0">
                    <h3 className="break-words text-lg font-bold text-slate-900">
                      {tutor.user?.name || "Tutor"}
                    </h3>

                    <p className="mt-1 break-all text-sm text-slate-500">
                      {tutor.user?.email || "Email not available"}
                    </p>
                  </div>

                </div>

                {/* VERIFICATION BADGE */}
                <span
                  className={`inline-flex self-start rounded-full px-4 py-2 text-xs font-bold capitalize ${
                    tutor.verificationStatus === "approved"
                      ? "bg-emerald-100 text-emerald-700"
                      : tutor.verificationStatus === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {tutor.verificationStatus || "Pending"}
                </span>

              </div>

              {/* CARD CONTENT */}
              <div className="flex-1 p-6">

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  {/* SUBJECTS */}
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Subjects
                    </p>

                    <p className="break-words text-sm font-semibold text-slate-800">
                      {tutor.subjects?.join(", ") || "Not specified"}
                    </p>
                  </div>

                  {/* CITY */}
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      City
                    </p>

                    <p className="text-sm font-semibold text-slate-800">
                      {tutor.city || "Not specified"}
                    </p>
                  </div>

                  {/* EDUCATION */}
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Education
                    </p>

                    <p className="break-words text-sm font-semibold text-slate-800">
                      {tutor.education || "Not specified"}
                    </p>
                  </div>

                  {/* EXPERIENCE */}
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Experience
                    </p>

                    <p className="text-sm font-semibold text-slate-800">
                      {tutor.experienceYears ?? 0} years
                    </p>
                  </div>

                </div>
              </div>

              {/* ADMIN ACTION BUTTONS */}
              <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 p-6 sm:flex-row">

                {tutor.verificationStatus !== "approved" && (
                  <button
                    type="button"
                    onClick={() =>
                      updateVerification(tutor._id, "approved")
                    }
                    className="flex-1 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    ✓ Approve Tutor
                  </button>
                )}

                {tutor.verificationStatus !== "rejected" && (
                  <button
                    type="button"
                    onClick={() =>
                      updateVerification(tutor._id, "rejected")
                    }
                    className="flex-1 rounded-xl border border-red-200 bg-red-50 px-5 py-3 font-semibold text-red-700 transition-all duration-200 hover:border-red-300 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    ✕ Reject Tutor
                  </button>
                )}

              </div>
            </article>

          ))}

        </div>
      </section>

    </div>
  </main>
);

}

export default AdminTutors;
