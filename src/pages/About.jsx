import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import "./about.css";


/* =========================================================
   PREMIUM CODED ICONS
========================================================= */

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeWidth="1.7"
    />

    <circle
      cx="12"
      cy="12"
      r="6"
      fill="currentColor"
      opacity="0.1"
    />

    <path
      d="m8.3 12.2 2.3 2.3 5-5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


const RupeeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M5.5 5h13M5.5 8.7h13"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />

    <path
      d="M6 5h5.2a4 4 0 0 1 0 8H6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />

    <path
      d="m10.5 13 6.4 6.3"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
    />
  </svg>
);


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
      r="3.2"
      stroke="currentColor"
      strokeWidth="1.2"
      opacity="0.35"
    />

    <path
      d="M16.2 16.2 21 21"
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
      x="3.2"
      y="5.2"
      width="17.6"
      height="15"
      rx="3"
      stroke="currentColor"
      strokeWidth="1.8"
    />

    <path
      d="M7.5 3.5v3.4M16.5 3.5v3.4M3.5 9.2h17"
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


const TechnicianIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle
      cx="9.5"
      cy="7"
      r="3.4"
      stroke="currentColor"
      strokeWidth="1.8"
    />

    <path
      d="M4 20v-1.2a5.5 5.5 0 0 1 11 0V20"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />

    <path
      d="m16.5 9 1.8-1.8 2.5 2.5-1.8 1.8"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <path
      d="m15.3 10.2 4.5 4.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);


const StarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="m12 2.7 2.8 5.7 6.3.9-4.6 4.4 1.1 6.3L12 17l-5.6 3 1.1-6.3-4.6-4.4 6.3-.9L12 2.7Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />

    <path
      d="m12 6.3 1.5 3 3.3.5-2.4 2.3.6 3.3-3-1.6-3 1.6.6-3.3-2.4-2.3 3.3-.5 1.5-3Z"
      fill="currentColor"
      opacity="0.18"
    />
  </svg>
);


const BoltIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="m13.2 2.5-8 10.3h6.1L10 21.5l8.8-11h-6.3l.7-8Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />

    <path
      d="m13 6-4.4 5.4h3.8"
      stroke="currentColor"
      strokeWidth="1.2"
      opacity="0.35"
      strokeLinecap="round"
    />
  </svg>
);


const ShieldIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M12 2.5 19 5v6c0 5.2-3.1 8.6-7 10.5C8.1 19.6 5 16.2 5 11V5l7-2.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />

    <path
      d="m8.8 12 2 2 4.4-4.4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


const ArrowIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M5 12h13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />

    <path
      d="m13.5 6.5 5.5 5.5-5.5 5.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


/* =========================================================
   DATA
========================================================= */

const steps = [
  {
    number: "01",
    title: "Choose a Service",
    description:
      "Browse our range of professional home services.",
    Icon: SearchIcon,
  },
  {
    number: "02",
    title: "Pick a Time",
    description:
      "Select a convenient date and time for your service.",
    Icon: CalendarIcon,
  },
  {
    number: "03",
    title: "Meet Your Professional",
    description:
      "A professional arrives at your preferred location.",
    Icon: TechnicianIcon,
  },
  {
    number: "04",
    title: "Enjoy the Service",
    description:
      "Get your service completed and share your experience.",
    Icon: StarIcon,
  },
];


const benefits = [
  {
    title: "Verified Professionals",
    description:
      "We focus on connecting customers with reliable service professionals.",
    Icon: CheckIcon,
  },
  {
    title: "Clear Pricing",
    description:
      "Transparent service pricing helps you make informed decisions.",
    Icon: RupeeIcon,
  },
  {
    title: "Easy Booking",
    description:
      "Find and book the service you need without unnecessary hassle.",
    Icon: BoltIcon,
  },
  {
    title: "Customer First",
    description:
      "Your convenience and service experience remain our priority.",
    Icon: ShieldIcon,
  },
];


/* =========================================================
   ABOUT
========================================================= */

export default function About() {

  const spring = {
    type: "spring",
    stiffness: 85,
    damping: 17,
    mass: 0.9,
  };


  return (
    <main className="about-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="about-hero">

        <div
          className="about-hero-grid"
          aria-hidden="true"
        />

        <div
          className="about-hero-glow about-hero-glow--a"
          aria-hidden="true"
        />

        <div
          className="about-hero-glow about-hero-glow--b"
          aria-hidden="true"
        />


        <div className="about-container about-hero-content">

          <motion.span
            className="about-eyebrow"
            initial={{
              opacity: 0,
              y: 15,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              ...spring,
              delay: 0.05,
            }}
          >
            Your Home, Our Responsibility
          </motion.span>


          <motion.h1
            className="about-hero-title"
            initial={{
              opacity: 0,
              y: 30,
              filter: "blur(5px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            transition={{
              ...spring,
              delay: 0.12,
            }}
          >
            Making Home Services

            <br />

            <span>
              Simple & Reliable
            </span>
          </motion.h1>


          <motion.p
            className="about-hero-description"
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              ...spring,
              delay: 0.22,
            }}
          >
            From everyday home maintenance to specialized
            services, we connect you with trusted professionals
            who make your life easier.
          </motion.p>


          <motion.div
            className="about-hero-buttons"
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              ...spring,
              delay: 0.32,
            }}
          >

            <Link
              to="/services"
              className="about-primary-btn"
            >
              Explore Services

              <ArrowIcon />
            </Link>


            <Link
              to="/contact"
              className="about-secondary-btn"
            >
              Contact Us
            </Link>

          </motion.div>

        </div>

      </section>


      {/* =====================================================
          STATS
      ===================================================== */}

 {/* =====================================================
    STATS
===================================================== */}

<section className="about-stats">

  <div className="about-container about-stats-grid">

    {[
      {
        number: "10K+",
        label: "Happy Customers",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle
              cx="9"
              cy="7"
              r="4"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M22 21v-2a4 4 0 0 0-3-3.87"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        ),
      },
      {
        number: "500+",
        label: "Verified Professionals",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="m9 12 2 2 4-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
      {
        number: "50+",
        label: "Services",
        icon: (
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
        ),
      },
      {
        number: "4.8",
        label: "Average Rating",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="m12 2.7 2.8 5.7 6.3.9-4.6 4.4 1.1 6.3L12 17l-5.6 3 1.1-6.3-4.6-4.4 6.3-.9L12 2.7Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
    ].map((item, index) => (
      <motion.div
        key={item.label}
        className="about-stat-card"
        initial={{
          opacity: 0,
          y: 22,
          scale: 0.97,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        viewport={{
          once: true,
          amount: 0.3,
        }}
        transition={{
          type: "spring",
          stiffness: 90,
          damping: 16,
          delay: index * 0.07,
        }}
      >
        <div className="about-stat-icon">
          {item.icon}
        </div>

        <div className="about-stat-number">
          {item.number}
        </div>

        <p className="about-stat-label">
          {item.label}
        </p>
      </motion.div>
    ))}

  </div>

</section>


      {/* =====================================================
          STORY
      ===================================================== */}

      <section className="about-story-section">

        <div className="about-container about-story-grid">

          <motion.div
            className="about-story-content"
            initial={{
              opacity: 0,
              x: -35,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={spring}
          >

            <span className="about-section-label">
              About ServiceHub
            </span>


            <h2>
              We believe finding a trusted
              professional shouldn't be difficult.
            </h2>


            <p>
              ServiceHub is a home services platform built
              to make professional services convenient,
              transparent and accessible.
            </p>


            <p>
              Whether you need plumbing, electrical work,
              cleaning, painting, appliance repair or other
              home services, we help you find the right
              professional for the job.
            </p>


            <p>
              Our goal is simple — make booking a home
              service as easy as ordering anything online.
            </p>


            <Link
              to="/services"
              className="about-story-btn"
            >
              Find a Service

              <ArrowIcon />
            </Link>

          </motion.div>


          <motion.div
            className="about-story-visual"
            initial={{
              opacity: 0,
              x: 35,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              ...spring,
              delay: 0.1,
            }}
          >

            <div className="about-visual-card about-visual-card--primary">

              <div className="about-visual-icon">
                <CheckIcon />
              </div>


              <h3>
                Trusted Professionals
              </h3>


              <p>
                Quality service providers selected with
                customer satisfaction in mind.
              </p>

            </div>


            <div className="about-visual-card about-visual-card--dark">

              <div className="about-visual-icon">
                <RupeeIcon />
              </div>


              <h3>
                Transparent Pricing
              </h3>


              <p>
                Know what you're paying for before booking.
              </p>

            </div>

          </motion.div>

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section className="about-how-section">

        <div className="about-container">

          <motion.div
            className="about-section-heading"
            initial={{
              opacity: 0,
              y: 22,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={spring}
          >

            <span className="about-section-label">
              How It Works
            </span>


            <h2>
              Getting things done is easy
            </h2>


            <p>
              Book a professional in just a few simple steps.
            </p>

          </motion.div>


          <div className="about-steps-grid">

            {steps.map(
              (
                step,
                index
              ) => {

                const Icon =
                  step.Icon;

                return (

                  <motion.article
                    key={step.number}
                    className="about-step-card"
                    initial={{
                      opacity: 0,
                      y: 25,
                      scale: 0.97,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.2,
                    }}
                    transition={{
                      ...spring,
                      delay:
                        index *
                        0.08,
                    }}
                  >

                    <span className="about-step-number">
                      {step.number}
                    </span>


                    <div className="about-step-icon">
                      <Icon />
                    </div>


                    <h3>
                      {step.title}
                    </h3>


                    <p>
                      {step.description}
                    </p>

                  </motion.article>

                );
              }
            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          WHY SERVICEHUB
      ===================================================== */}

      <section className="about-why-section">

        <div className="about-container">

          <motion.div
            className="about-section-heading"
            initial={{
              opacity: 0,
              y: 22,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={spring}
          >

            <span className="about-section-label">
              Why ServiceHub
            </span>


            <h2>
              Built around your convenience
            </h2>


            <p>
              Everything is designed to make booking
              professional home services simpler.
            </p>

          </motion.div>


          <div className="about-benefits-grid">

            {benefits.map(
              (
                benefit,
                index
              ) => {

                const Icon =
                  benefit.Icon;

                return (

                  <motion.article
                    key={
                      benefit.title
                    }
                    className="about-benefit-card"
                    initial={{
                      opacity: 0,
                      y: 25,
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
                      ...spring,
                      delay:
                        index *
                        0.07,
                    }}
                  >

                    <div className="about-benefit-icon">
                      <Icon />
                    </div>


                    <h3>
                      {benefit.title}
                    </h3>


                    <p>
                      {
                        benefit.description
                      }
                    </p>

                  </motion.article>

                );
              }
            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="about-cta">

        <div
          className="about-cta-glow"
          aria-hidden="true"
        />


        <div className="about-container">

          <motion.div
            className="about-cta-content"
            initial={{
              opacity: 0,
              y: 25,
              scale: 0.98,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            transition={spring}
          >

            <span>
              Ready to get started?
            </span>


            <h2>
              Your next home service is
              just a few clicks away.
            </h2>


            <p>
              Find a trusted professional and book
              your service today.
            </p>


            <Link
              to="/services"
              className="about-cta-btn"
            >
              Explore Services

              <ArrowIcon />
            </Link>

          </motion.div>

        </div>

      </section>

    </main>
  );
}