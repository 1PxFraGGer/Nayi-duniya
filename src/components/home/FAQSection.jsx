import {
  useEffect,
  useState,
} from "react";

import { motion } from "framer-motion";

import API from "../../services/api";

import "./FAQSection.css";

export default function FAQSection() {
  /* =========================================
     STATE
  ========================================= */

  const [open, setOpen] =
    useState(null);

  const [faqs, setFaqs] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  /* =========================================
     LOAD FAQS
  ========================================= */

  const loadFaqs = async () => {
    try {
      setLoading(true);

      const res =
        await API.get("/faqs");

      setFaqs(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (err) {
      console.error(
        "Error fetching FAQs",
        err
      );

      setFaqs([]);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  /* =========================================
     RENDER
  ========================================= */

  return (
    <section className="faq-section">

      {/* AMBIENT BACKGROUND */}

      <div className="faq-blob faq-blob--a" />
      <div className="faq-blob faq-blob--b" />

      <div
        className="faq-grid-bg"
        aria-hidden="true"
      />

      <div className="faq-wrapper">

        {/* =====================================
            HEADER
        ===================================== */}

        <motion.header
          className="faq-header"
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
            type: "spring",
            stiffness: 90,
            damping: 17,
          }}
        >
          <span className="faq-eyebrow">
            Got Questions?
          </span>

          <h2 className="faq-title">
            Frequently Asked
            <br />
            Questions
          </h2>

          <p className="faq-subtitle">
            Everything you need to know —
            answered clearly.
          </p>
        </motion.header>

        {/* =====================================
            BODY
        ===================================== */}

        <div className="faq-list">

          {/* LOADING */}

          {loading && (
            <div className="faq-skeleton-wrap">
              {[1, 2, 3, 4].map(
                (n) => (
                  <div
                    key={n}
                    className="faq-skeleton"
                  />
                )
              )}
            </div>
          )}

          {/* EMPTY */}

          {!loading &&
            faqs.length === 0 && (

            <div className="faq-empty">

              <div className="faq-empty-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                  />

                  <path
                    d="M9.5 9a2.7 2.7 0 0 1 5.2 1c0 1.8-2.7 2.7-2.7 2.7"
                  />

                  <path
                    d="M12 17h.01"
                  />
                </svg>
              </div>

              <p>
                No FAQs available at the moment.
              </p>

            </div>
          )}

          {/* FAQ ITEMS */}

          {!loading &&
            faqs.map(
              (f, i) => {

                const isOpen =
                  open === i;

                return (

                  <motion.div
                    key={f.id || i}
                    className={`faq-item ${
                      isOpen
                        ? "faq-item--open"
                        : ""
                    }`}
                    initial={{
                      opacity: 0,
                      y: 18,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.2,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 95,
                      damping: 17,
                      delay:
                        i * 0.055,
                    }}
                  >

                    <button
                      type="button"
                      className="faq-q"
                      onClick={() =>
                        setOpen(
                          isOpen
                            ? null
                            : i
                        )
                      }
                      aria-expanded={isOpen}
                    >

                      {/* NUMBER */}

                      <span className="faq-q-num">
                        {String(
                          i + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      {/* QUESTION */}

                      <span className="faq-q-text">
                        {f.question}
                      </span>

                      {/* CHEVRON */}

                      <span
                        className="faq-chevron"
                        aria-hidden="true"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m7 9 5 5 5-5" />
                        </svg>
                      </span>

                    </button>

                    {/* ANSWER */}

                    <div className="faq-a">
                      <div className="faq-a-inner">
                        <p>
                          {f.answer}
                        </p>
                      </div>
                    </div>

                  </motion.div>

                );
              }
            )}

        </div>

      </div>

    </section>
  );
}