
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/authApi";

function StudentReview() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/reviews", {
        bookingId,
        rating: Number(rating),
        comment,
      });

      navigate("/student/bookings");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Review could not be submitted"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>Review Your Tutor</h1>

      {error && <p role="alert">{error}</p>}

      <form onSubmit={submitReview}>
        <label htmlFor="rating">Rating</label>

        <select
          id="rating"
          value={rating}
          onChange={e => setRating(Number(e.target.value))}
        >
          <option value={5}>5 - Excellent</option>
          <option value={4}>4 - Good</option>
          <option value={3}>3 - Average</option>
          <option value={2}>2 - Poor</option>
          <option value={1}>1 - Very Poor</option>
        </select>

        <label htmlFor="comment">Your experience</label>

        <textarea
          id="comment"
          value={comment}
          maxLength={1000}
          onChange={e => setComment(e.target.value)}
          placeholder="Tell other students about this tutor"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </main>
  );
}

export default StudentReview;
