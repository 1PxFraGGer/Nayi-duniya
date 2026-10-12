import {
  useEffect,
  useState,
} from "react";

import { motion } from "framer-motion";

import API from "../../services/api";

import "./TrustBadges.css";

/* =========================================================
   CODED SVG ICONS
========================================================= */

const TrophyIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M8 21h8" />
    <path d="M12 17v4" />
    <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
    <path d="M7 6H4v1a4 4 0 0 0 4 4" />
    <path d="M17 6h3v1a4 4 0 0 1-4 4" />
  </svg>
);


const UsersIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);


const StarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m12 2 3.09 6.26 6.91 1-5 4.87 1.18 6.87L12 17.77 5.82 21 7 14.13l-5-4.87 6.91-1L12 2Z" />
  </svg>
);


const ShieldIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);


const ICONS = [
  TrophyIcon,
  UsersIcon,
  StarIcon,
  ShieldIcon,
];


/* =========================================================
   COMPONENT
========================================================= */

export default function TrustBadges() {
  /* BACKEND LOGIC */

  const [highlights, setHighlights] =
    useState([]);

  const [loading, setLoading] =
    useState(false);


  const loadHighlights = async () => {
    try {
      setLoading(true);

      const res =
        await API.get(
          "/admin/highlights"
        );

      setHighlights(
        res.data || []
      );

    } catch (err) {
      console.error(
        "Error fetching highlights",
        err
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadHighlights();
  }, []);


  /* =======================================================
     MOTION CONFIG
  ======================================================= */

  const spring = {
    type: "spring",
    stiffness: 90,
    damping: 17,
    mass: 0.8,
  };


  return (
    <section className="tb-section">

      {/* BACKGROUND */}

      <div className="tb-blob tb-blob--a" />

      <div className="tb-blob tb-blob--b" />

      <div
        className="tb-grid-bg"
        aria-hidden="true"
      />


      {/* TOP DIVIDER */}

      <div
        className="tb-wave"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
        >
          <path
            d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z"
            fill="#faf8f3"
          />
        </svg>
      </div>


      <div className="tb-wrapper">

        {/* =================================================
            HEADER
        ================================================= */}

        <motion.header
          className="tb-header"
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
            className="tb-eyebrow"
            initial={{
              opacity: 0,
              scale: 0.94,
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
            By the Numbers
          </motion.span>


          <h2 className="tb-title">
            Our Achievements
          </h2>


          <p className="tb-subtitle">
            Numbers that speak louder
            than words.
          </p>

        </motion.header>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="tb-grid">

            {[1, 2, 3, 4].map(
              (n) => (

                <div
                  key={n}
                  className="tb-skeleton"
                >

                  <div className="tb-sk-icon" />

                  <div className="tb-sk-line tb-sk-line--num" />

                  <div className="tb-sk-line tb-sk-line--label" />

                </div>

              )
            )}

          </div>
        )}


        {/* =================================================
            CARDS
        ================================================= */}

        {!loading && (

          <div className="tb-grid">

            {highlights.map(
              (h, i) => {

                const Icon =
                  ICONS[
                    i %
                    ICONS.length
                  ];

                return (

                  <motion.article
                    key={h.id}
                    className="tb-card"
                    initial={{
                      opacity: 0,
                      y: 28,
                      scale: 0.96,
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
                        i * 0.08,
                    }}
                  >

                    {/* GLOW */}

                    <div className="tb-card-glow" />


                    {/* ICON */}

                    <motion.div
                      className="tb-icon-wrap"
                      whileHover={{
                        rotate: -5,
                        scale: 1.07,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 220,
                        damping: 14,
                      }}
                    >

                      <Icon />

                    </motion.div>


                    {/* NUMBER */}

                    <motion.span
                      className="tb-number"
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        duration: 0.4,
                        delay:
                          0.1 +
                          i *
                            0.06,
                      }}
                    >
                      {h.number}
                    </motion.span>


                    {/* LABEL */}

                    <p className="tb-label">
                      {h.label}
                    </p>


                    {/* BOTTOM BAR */}

                    <div className="tb-bar" />

                  </motion.article>

                );

              }
            )}

          </div>

        )}

      </div>


      {/* BOTTOM DIVIDER */}

      <div
        className="tb-wave tb-wave--bottom"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
        >
          <path
            d="M0,30 C360,0 1080,60 1440,30 L1440,60 L0,60 Z"
            fill="#faf8f3"
          />
        </svg>
      </div>

    </section>
  );
}