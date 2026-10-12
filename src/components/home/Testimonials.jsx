import {
  useEffect,
  useState,
} from "react";

import { motion } from "framer-motion";

import API from "../../services/api";

import "./Testimonials.css";

export default function Testimonials() {
  /* =========================================
     STATE
  ========================================= */

  const [
    testimonials,
    setTestimonials,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  /* =========================================
     LOAD TESTIMONIALS
  ========================================= */

  const loadTestimonials =
    async () => {
      try {
        setLoading(true);

        const res =
          await API.get(
            "/admin/testimonials"
          );

        const data =
          Array.isArray(
            res.data
          )
            ? res.data
            : res.data
                ?.testimonials ||
              res.data?.data ||
              [];

        setTestimonials(
          data.slice(0, 3)
        );

      } catch (err) {
        console.error(
          "Error fetching testimonials:",
          err
        );

        setTestimonials([]);

      } finally {
        setLoading(false);
      }
    };

  /* =========================================
     INITIAL LOAD
  ========================================= */

  useEffect(() => {
    loadTestimonials();
  }, []);

  /* =========================================
     SPRING
  ========================================= */

  const spring = {
    type: "spring",
    stiffness: 90,
    damping: 17,
    mass: 0.85,
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <section className="tm-section">

      {/* BACKGROUND */}

      <div className="tm-blob tm-blob--a" />
      <div className="tm-blob tm-blob--b" />

      <div
        className="tm-grid-bg"
        aria-hidden="true"
      />

      <div className="tm-wrapper">

        {/* =====================================
            HEADER
        ===================================== */}

        <motion.header
          className="tm-header"
          initial={{
            opacity: 0,
            y: 24,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.4,
          }}
          transition={{
            ...spring,
          }}
        >
          <motion.span
            className="tm-eyebrow"
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              ...spring,
              delay: 0.05,
            }}
          >
            Customer Stories
          </motion.span>

          <h2 className="tm-title">
            What Our Customers Say
          </h2>

          <p className="tm-subtitle">
            Real reviews from real
            homeowners across the city.
          </p>
        </motion.header>

        {/* =====================================
            LOADING
        ===================================== */}

        {loading && (
          <div className="tm-grid">

            {[1, 2, 3].map(
              (n) => (
                <div
                  key={n}
                  className="tm-skeleton"
                >
                  <div className="tm-skeleton-line tm-skeleton-line--stars" />

                  <div className="tm-skeleton-line tm-skeleton-line--text" />

                  <div className="tm-skeleton-line tm-skeleton-line--text2" />

                  <div className="tm-skeleton-footer">

                    <div className="tm-skeleton-avatar" />

                    <div className="tm-skeleton-line tm-skeleton-line--name" />

                  </div>
                </div>
              )
            )}

          </div>
        )}

        {/* =====================================
            TESTIMONIALS
        ===================================== */}

        {!loading &&
          testimonials.length >
            0 && (

            <div className="tm-grid">

              {testimonials.map(
                (
                  testimonial,
                  index
                ) => {

                  const customerName =
                    testimonial
                      .name
                      ?.trim() ||
                    "Customer";

                  const review =
                    testimonial
                      .review
                      ?.trim() ||
                    "";

                  const avatarLetter =
                    customerName
                      .charAt(0)
                      .toUpperCase();

                  return (

                    <motion.article
                      key={
                        testimonial.id ||
                        index
                      }
                      className="tm-card"
                      initial={{
                        opacity: 0,
                        y: 28,
                        scale: 0.97,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      viewport={{
                        once: true,
                        amount: 0.25,
                      }}
                      transition={{
                        ...spring,
                        delay:
                          index *
                          0.08,
                      }}
                    >

                      {/* CARD GLOW */}

                      <div className="tm-card-glow" />

                      {/* QUOTE ICON */}

                      <div
                        className="tm-quote-mark"
                        aria-hidden="true"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M7.2 6C4.3 6 2 8.3 2 11.2V18h7v-7H5.2c.1-1.3 1.1-2.2 2.4-2.2V6H7.2Zm9.8 0c-2.9 0-5.2 2.3-5.2 5.2V18h7v-7H15c.1-1.3 1.1-2.2 2.4-2.2V6H17Z" />
                        </svg>
                      </div>

                      {/* STARS */}

                      <div
                        className="tm-stars"
                        aria-label="5 star rating"
                      >
                        {[
                          1,
                          2,
                          3,
                          4,
                          5,
                        ].map(
                          (star) => (
                            <motion.svg
                              key={star}
                              className="tm-star"
                              viewBox="0 0 24 24"
                              initial={{
                                opacity: 0,
                                scale:
                                  0.7,
                              }}
                              whileInView={{
                                opacity: 1,
                                scale: 1,
                              }}
                              viewport={{
                                once: true,
                              }}
                              transition={{
                                delay:
                                  0.1 +
                                  index *
                                    0.05 +
                                  star *
                                    0.04,
                                type:
                                  "spring",
                                stiffness:
                                  180,
                                damping:
                                  13,
                              }}
                              aria-hidden="true"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </motion.svg>
                          )
                        )}
                      </div>

                      {/* REVIEW */}

                      <p className="tm-review">
                        “{review}”
                      </p>

                      {/* AUTHOR */}

                      <div className="tm-author">

                        <motion.div
                          className="tm-avatar"
                          whileHover={{
                            rotate: -5,
                            scale:
                              1.07,
                          }}
                          transition={{
                            type:
                              "spring",
                            stiffness:
                              220,
                            damping:
                              14,
                          }}
                          aria-hidden="true"
                        >
                          {
                            avatarLetter
                          }
                        </motion.div>

                        <div className="tm-author-info">

                          <strong className="tm-name">
                            {
                              customerName
                            }
                          </strong>

                          <span className="tm-tag">
                            Verified Customer
                          </span>

                        </div>

                      </div>

                    </motion.article>

                  );
                }
              )}

            </div>
          )}

        {/* =====================================
            EMPTY
        ===================================== */}

        {!loading &&
          testimonials.length ===
            0 && (

            <div className="tm-empty">

              <div
                className="tm-empty-icon"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 21h8" />
                  <path d="M12 17v4" />
                  <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
                  <path d="M7 6H4v1a4 4 0 0 0 4 4" />
                  <path d="M17 6h3v1a4 4 0 0 1-4 4" />
                </svg>
              </div>

              <h3>
                No customer stories yet
              </h3>

              <p>
                Customer reviews will
                appear here once they
                are published.
              </p>

            </div>
          )}

      </div>

    </section>
  );
}