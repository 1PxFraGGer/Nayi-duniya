import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import API from "../../services/api";

import "./HeroSection.css";

export default function HeroSection() {
  const [categories, setCategories] =
    useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res =
        await API.get("/categories");

      setCategories(
        res.data || []
      );
    } catch (err) {
      console.error(
        "Hero categories error:",
        err
      );
    }
  };

  /* =========================================================
     MOTION CONFIG
  ========================================================= */

  const smoothSpring = {
    type: "spring",
    stiffness: 90,
    damping: 18,
    mass: 0.9,
  };

  return (
    <section className="hs-section">

      {/* =====================================================
          AMBIENT BACKGROUND
      ===================================================== */}

      <div className="hs-blob hs-blob--a" />
      <div className="hs-blob hs-blob--b" />
      <div className="hs-blob hs-blob--c" />

      <div
        className="hs-grid-lines"
        aria-hidden="true"
      />

      <div
        className="hs-light-beam"
        aria-hidden="true"
      />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.5,
        }}
        className="hs-content"
      >

        {/* EYEBROW */}

        <motion.div
          initial={{
            opacity: 0,
            y: 18,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            ...smoothSpring,
            delay: 0.08,
          }}
          className="hs-eyebrow"
        >
          <span className="hs-eyebrow-dot" />

          Trusted Home Services
        </motion.div>


        {/* ===================================================
            TITLE
        =================================================== */}

        <motion.h1
          className="hs-title"
          initial={{
            opacity: 0,
            y: 35,
            filter: "blur(5px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          transition={{
            ...smoothSpring,
            delay: 0.14,
          }}
        >
          Book Trusted

          <br />

          <span className="hs-gradient-text">
            Home Services
          </span>

          <br />

          Instantly
        </motion.h1>


        {/* ===================================================
            SUBTITLE
        =================================================== */}

        <motion.p
          className="hs-subtitle"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            ...smoothSpring,
            delay: 0.23,
          }}
        >
          Verified professionals.
          Transparent pricing.
          Instant booking.
        </motion.p>


        {/* ===================================================
            CTA BUTTONS
        =================================================== */}

        <motion.div
          className="hs-buttons"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            ...smoothSpring,
            delay: 0.31,
          }}
        >

          <Link
            to="/services"
            className="hs-btn-primary"
          >
            <span>
              Explore Services
            </span>

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              aria-hidden="true"
            >
              <line
                x1="5"
                y1="12"
                x2="19"
                y2="12"
              />

              <polyline
                points="12 5 19 12 12 19"
              />
            </svg>
          </Link>


          <Link
            to="/about"
            className="hs-btn-outline"
          >
            Learn More
          </Link>

        </motion.div>


        {/* ===================================================
            TRUST BADGES
        =================================================== */}

        <motion.div
          className="hs-trust"
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.42,
          }}
        >
          {[
            {
              icon: "✦",
              label:
                "Verified Pros",
            },
            {
              icon: "✦",
              label:
                "Instant Booking",
            },
            {
              icon: "✦",
              label:
                "Secure Payments",
            },
          ].map(
            (badge, index) => (
              <motion.span
                key={badge.label}
                className="hs-trust-badge"
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay:
                    0.46 +
                    index * 0.08,
                }}
              >
                <span className="hs-trust-icon">
                  {badge.icon}
                </span>

                {badge.label}
              </motion.span>
            )
          )}
        </motion.div>

      </motion.div>


      {/* =====================================================
          CATEGORY CHIPS
      ===================================================== */}

      <motion.div
        className="hs-chips"
        initial={{
          opacity: 0,
          y: 24,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.55,
          delay: 0.55,
        }}
      >
        {categories
          .slice(0, 5)
          .map(
            (
              category,
              index
            ) => (

              <motion.div
                key={
                  category.id
                }
                initial={{
                  opacity: 0,
                  y: 14,
                  scale: 0.94,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  ...smoothSpring,
                  delay:
                    0.6 +
                    index *
                      0.07,
                }}
              >
                <Link
                  to={`/services/category/${category.id}`}
                  className="hs-chip"
                >
                  {category.name}
                </Link>
              </motion.div>

            )
          )}
      </motion.div>

    </section>
  );
}