import "./HowItWorks.css";
import { motion } from "framer-motion";

/* =========================================================
   PREMIUM CODED ICONS
========================================================= */

const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle
      cx="11"
      cy="11"
      r="6.5"
      stroke="currentColor"
      strokeWidth="1.9"
    />

    <circle
      cx="11"
      cy="11"
      r="3"
      stroke="currentColor"
      strokeWidth="1.1"
      opacity="0.35"
    />

    <path
      d="M16 16l5 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <rect
      x="3"
      y="5"
      width="18"
      height="16"
      rx="3"
      stroke="currentColor"
      strokeWidth="1.8"
    />

    <path
      d="M7.5 3.5v3.5M16.5 3.5v3.5M3 9.5h18"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />

    <rect
      x="7"
      y="12"
      width="3"
      height="3"
      rx="0.8"
      fill="currentColor"
      opacity="0.3"
    />

    <rect
      x="14"
      y="12"
      width="3"
      height="3"
      rx="0.8"
      fill="currentColor"
      opacity="0.3"
    />
  </svg>
);

const ToolIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M14.7 6.3a4 4 0 0 0-5.6 5.6l-6.1 6.1a2 2 0 0 0 2.8 2.8l6.1-6.1a4 4 0 0 0 5.6-5.6l-2.4 2.4-2.6-2.6 2.2-2.6Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SparkleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M12 3c.6 3.4 2.6 5.4 6 6-3.4.6-5.4 2.6-6 6-.6-3.4-2.6-5.4-6-6 3.4-.6 5.4-2.6 6-6Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />

    <path
      d="M18 15c.3 1.7 1.3 2.7 3 3-1.7.3-2.7 1.3-3 3-.3-1.7-1.3-2.7-3-3 1.7-.3 2.7-1.3 3-3Z"
      stroke="currentColor"
      strokeWidth="1.4"
      opacity="0.55"
    />
  </svg>
);

export default function HowItWorks() {
  const steps = [
    {
      step: "1",
      title: "Choose Service",
      desc: "Select service",
      Icon: SearchIcon,
    },
    {
      step: "2",
      title: "Book Schedule",
      desc: "Pick time",
      Icon: CalendarIcon,
    },
    {
      step: "3",
      title: "Expert Visit",
      desc: "Professional comes",
      Icon: ToolIcon,
    },
    {
      step: "4",
      title: "Relax",
      desc: "Enjoy service",
      Icon: SparkleIcon,
    },
  ];

  return (
    <section className="hiw-section">
      <div className="hiw-blob hiw-blob--a" />
      <div className="hiw-blob hiw-blob--b" />

      <div className="hiw-grid-bg" aria-hidden="true" />

      <div className="hiw-wrapper">

        {/* HEADER */}

        <motion.header
          className="hiw-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
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
          <span className="hiw-eyebrow">
            Simple Process
          </span>

          <h2 className="hiw-title">
            How It Works
          </h2>

          <p className="hiw-subtitle">
            From booking to bliss — in four easy steps.
          </p>
        </motion.header>

        {/* STEPS */}

        <div className="hiw-grid">
          {steps.map((s, i) => {
            const Icon = s.Icon;

            return (
              <motion.article
                key={s.step}
                className="hiw-card"
                initial={{
                  opacity: 0,
                  y: 24,
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
                  type: "spring",
                  stiffness: 90,
                  damping: 16,
                  delay: i * 0.08,
                }}
              >
                {/* CONNECTOR */}

                {i < steps.length - 1 && (
                  <div
                    className="hiw-connector"
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 70 16"
                      fill="none"
                    >
                      <path
                        d="M0 8 C18 1 50 1 70 8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="5 5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                )}

                {/* ICON */}

                <div className="hiw-icon-wrap">
                  <Icon />

                  <span className="hiw-step-num">
                    {s.step}
                  </span>
                </div>

                <h3 className="hiw-card-title">
                  {s.title}
                </h3>

                <p className="hiw-card-desc">
                  {s.desc}
                </p>
              </motion.article>
            );
          })}
        </div>

      </div>
    </section>
  );
}