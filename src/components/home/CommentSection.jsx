import { useEffect, useState } from "react";
import API from "../../services/api";
import "./CommentSection.css";

export default function CommentSection() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =========================================================
     LOAD APPROVED REVIEWS
  ========================================================= */
  const loadComments = async () => {
    try {
      setLoading(true);

      const res = await API.get("/comments/approved");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.comments || res.data?.data || [];

      setComments(data);
    } catch (error) {
      console.error("Error fetching approved reviews:", error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  return (
    <section className="cs-section">
      {/* ── ambient blobs ── */}
      <div className="cs-blob cs-blob--a" />
      <div className="cs-blob cs-blob--b" />

      <div className="cs-wrapper">

        {/* ── heading ── */}
        <header className="cs-header">
          <span className="cs-eyebrow">
            Customer Voices
          </span>

          <h2 className="cs-title">
            What Our Customers Say
          </h2>

          <p className="cs-subtitle">
            Real experiences from customers who have used our services.
          </p>
        </header>

        {/* ── loading ── */}
        {loading && (
          <div className="cs-list">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="cs-card"
              >
                <div className="cs-card-avatar">
                  ...
                </div>

                <div className="cs-card-body">
                  <div className="cs-card-meta">
                    <strong className="cs-card-name">
                      Loading...
                    </strong>
                  </div>

                  <p className="cs-card-text">
                    Loading customer review...
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── empty ── */}
        {!loading && comments.length === 0 && (
          <div className="cs-empty">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>

            <p>
              No customer reviews yet.
            </p>
          </div>
        )}

        {/* ── reviews ── */}
        {!loading && comments.length > 0 && (
          <>
            <div className="cs-divider">
              <span>
                {comments.length} review
                {comments.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="cs-list">
              {comments.map((comment, index) => {
                const name =
                  comment.user_name?.trim() ||
                  "Customer";

                const message =
                  comment.comment?.trim() ||
                  "";

                const rating =
                  Number(comment.rating) || 0;

                const avatar =
                  name.charAt(0).toUpperCase();

                return (
                  <div
                    key={comment.id || index}
                    className="cs-card"
                    style={{
                      animationDelay: `${index * 60}ms`,
                    }}
                  >
                    {/* Avatar */}
                    <div className="cs-card-avatar">
                      {avatar}
                    </div>

                    <div className="cs-card-body">

                      {/* Name + date */}
                      <div className="cs-card-meta">
                        <strong className="cs-card-name">
                          {name}
                        </strong>

                        {comment.created_at && (
                          <span className="cs-card-time">
                            {new Date(
                              comment.created_at
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {/* Rating */}
                      <div
                        className="cs-rating"
                        aria-label={`${rating} out of 5 stars`}
                      >
                        {[1, 2, 3, 4, 5].map(
                          (star) => (
                            <span
                              key={star}
                              className={
                                star <= rating
                                  ? "cs-rating-star active"
                                  : "cs-rating-star"
                              }
                            >
                              ★
                            </span>
                          )
                        )}
                      </div>

                      {/* Review */}
                      <p className="cs-card-text">
                        {message}
                      </p>

                      {/* Service */}
                      {comment.service_title && (
                        <span className="cs-service-name">
                          {comment.service_title}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

      </div>
    </section>
  );
}
