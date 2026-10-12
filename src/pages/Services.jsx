import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";

import ServiceCard from "../components/ServiceCard";
import ServiceSkeleton from "../components/ServiceSkeleton";

import { useLocation } from "../context/LocationContext";

import API from "../services/api";
import { getImageUrl } from "../utils/imageUrl";

import "./services.css";


/* =========================================================
   CODED PREMIUM ICONS
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

    <path
      d="m16 16 5 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);


const SortIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M8 7h12M8 12h8M8 17h4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />

    <path
      d="m4 5-2 2 2 2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


const LayersIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="m12 3 9 5-9 5-9-5 9-5Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />

    <path
      d="m3 12 9 5 9-5"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.65"
    />

    <path
      d="m3 16 9 5 9-5"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.35"
    />
  </svg>
);


const EmptyIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle
      cx="11"
      cy="11"
      r="6"
      stroke="currentColor"
      strokeWidth="1.7"
    />

    <path
      d="m15.5 15.5 4.5 4.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />

    <path
      d="M8.8 11h4.4"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);


const ClearIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M7 7l10 10M17 7 7 17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);


/* =========================================================
   SERVICE TITLE FORMATTER

   Keeps the ORIGINAL title untouched for:
   - searching
   - filtering
   - API data

   Creates a DISPLAY title where a new line is inserted
   after every 3 words.
========================================================= */

const formatServiceTitle = (title = "") => {
  const words = String(title)
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .filter(Boolean);

  if (!words.length) {
    return "Service";
  }

  const lines = [];

  for (
    let i = 0;
    i < words.length;
    i += 3
  ) {
    lines.push(
      words
        .slice(i, i + 3)
        .join(" ")
    );
  }

  return lines.join("\n");
};


/* =========================================================
   SERVICES COMPONENT
========================================================= */

export default function Services() {
  const { city } = useLocation();

  const [services, setServices] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("All");

  const [sortBy, setSortBy] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  /* =========================================================
     FETCH SERVICES
  ========================================================= */

  const loadServices = async () => {
    try {
      setLoading(true);

      const res =
        await API.get("/services");

      const formatted =
        (res.data || []).map(
          (s) => {

            /* =====================================
               HANDLE IMAGES
            ===================================== */

            const images =
              Array.isArray(
                s.images
              ) &&
              s.images.length > 0
                ? s.images.map(
                    (img) =>
                      getImageUrl(
                        img
                      )
                  )
                : s.image
                  ? [
                      getImageUrl(
                        s.image
                      ),
                    ]
                  : [
                      "/placeholder.jpg",
                    ];


            /* =====================================
               ORIGINAL TITLE
            ===================================== */

            const originalTitle =
              s.title ||
              "Service";


            return {
              id: s.id,

              /*
                Keep the real title.
                Search/filter uses this.
              */

              title:
                originalTitle,

              /*
                Premium display title.
                Forced newline every 3 words.
              */

              displayTitle:
                formatServiceTitle(
                  originalTitle
                ),

              category:
                s.category_name ||
                s.category ||
                "Other",

              city:
                s.city ||
                city,

              images,

              price:
                Number(
                  s.price
                ) || 0,

              rating:
                Number(
                  s.rating
                ) || 4.5,

              badge:
                Number(
                  s.is_popular
                ) === 1
                  ? "Popular"

                  : Number(
                        s.is_daily_deal
                      ) === 1
                    ? "Deal"

                    : "",
            };
          }
        );


      setServices(
        formatted
      );

    } catch (err) {

      console.error(
        "Error loading services:",
        err
      );

      setServices([]);

    } finally {

      setLoading(false);

    }
  };


  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    loadServices();
  }, []);


  /* =========================================================
     CATEGORIES
  ========================================================= */

  const categories =
    useMemo(
      () => [
        "All",

        ...new Set(
          services.map(
            (service) =>
              service.category
          )
        ),
      ],
      [services]
    );


  /* =========================================================
     FILTER + SORT
  ========================================================= */

  const filteredServices =
    useMemo(() => {

      let result =
        services.filter(
          (service) => {

            const query =
              search
                .trim()
                .toLowerCase();


            const matchesSearch =
              !query ||

              service.title
                .toLowerCase()
                .includes(
                  query
                ) ||

              service.category
                .toLowerCase()
                .includes(
                  query
                );


            const matchesCategory =
              selectedCategory ===
                "All" ||

              service.category ===
                selectedCategory;


            return (
              matchesSearch &&
              matchesCategory
            );
          }
        );


      result = [
        ...result,
      ];


      /* =========================
         PRICE LOW TO HIGH
      ========================= */

      if (
        sortBy ===
        "priceLow"
      ) {
        result.sort(
          (a, b) =>
            a.price -
            b.price
        );
      }


      /* =========================
         PRICE HIGH TO LOW
      ========================= */

      if (
        sortBy ===
        "priceHigh"
      ) {
        result.sort(
          (a, b) =>
            b.price -
            a.price
        );
      }


      /* =========================
         RATING
      ========================= */

      if (
        sortBy ===
        "rating"
      ) {
        result.sort(
          (a, b) =>
            b.rating -
            a.rating
        );
      }


      return result;

    }, [
      services,
      search,
      selectedCategory,
      sortBy,
    ]);


  /* =========================================================
     RESET FILTERS
  ========================================================= */

  const resetFilters = () => {
    setSearch("");

    setSelectedCategory(
      "All"
    );

    setSortBy("");
  };


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <main className="services-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <motion.section
        className="services-hero"

        initial={{
          opacity: 0,
          y: -18,
          scale: 0.985,
        }}

        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}

        transition={{
          type: "spring",
          stiffness: 85,
          damping: 18,
        }}
      >

        {/* PREMIUM LABEL */}

        <motion.div
          className="services-hero-eyebrow"

          initial={{
            opacity: 0,
            y: 12,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            delay: 0.12,
            duration: 0.45,
          }}
        >
          <LayersIcon />

          <span>
            Professional Services
          </span>
        </motion.div>


        {/* TITLE */}

        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            delay: 0.18,
            duration: 0.5,
          }}
        >
          Explore Trusted

          <span className="services-hero-gradient">
            {" "}
            Home Services
          </span>

          {city && (
            <>
              <br />

              <span className="services-city">
                in {city}
              </span>
            </>
          )}
        </motion.h1>


        {/* DESCRIPTION */}

        <motion.p
          initial={{
            opacity: 0,
            y: 14,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            delay: 0.26,
            duration: 0.45,
          }}
        >
          Find skilled professionals,
          transparent pricing and
          reliable services designed
          around your needs.
        </motion.p>

      </motion.section>


      {/* =====================================================
          SEARCH + SORT
      ===================================================== */}

      <motion.div
        className="services-toolbar"

        initial={{
          opacity: 0,
          y: 20,
          scale: 0.98,
        }}

        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}

        transition={{
          delay: 0.18,
          duration: 0.48,
        }}
      >

        {/* ================================
            SEARCH
        ================================ */}

        <div className="services-search-wrap">

          <span className="services-search-icon">
            <SearchIcon />
          </span>


          <input
            type="text"

            placeholder="Search services..."

            value={search}

            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }

            className="service-search"

            aria-label="Search services"
          />


          {search && (
            <button
              type="button"

              className="services-search-clear"

              onClick={() =>
                setSearch("")
              }

              aria-label="Clear search"
            >
              <ClearIcon />
            </button>
          )}

        </div>


        {/* ================================
            SORT
        ================================ */}

        <div className="services-sort-wrap">

          <span className="services-sort-icon">
            <SortIcon />
          </span>


          <select
            value={sortBy}

            onChange={(e) =>
              setSortBy(
                e.target.value
              )
            }

            aria-label="Sort services"
          >

            <option value="">
              Sort By
            </option>

            <option value="priceLow">
              Price Low → High
            </option>

            <option value="priceHigh">
              Price High → Low
            </option>

            <option value="rating">
              Top Rated
            </option>

          </select>

        </div>

      </motion.div>


      {/* =====================================================
          CATEGORY TABS
      ===================================================== */}

      <motion.div
        className="category-tabs"

        initial={{
          opacity: 0,
          y: 15,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        transition={{
          delay: 0.25,
          duration: 0.48,
        }}
      >

        {categories.map(
          (
            cat,
            index
          ) => (

            <motion.button
              type="button"

              key={cat}

              className={
                selectedCategory ===
                  cat
                  ? "active"
                  : ""
              }

              onClick={() =>
                setSelectedCategory(
                  cat
                )
              }

              initial={{
                opacity: 0,
                y: 8,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              transition={{
                delay:
                  0.28 +
                  index *
                    0.045,
              }}

              whileTap={{
                scale: 0.95,
              }}
            >
              {cat}
            </motion.button>

          )
        )}

      </motion.div>


      {/* =====================================================
          RESULT INFORMATION
      ===================================================== */}

      {!loading && (

        <motion.div
          className="result-count"

          initial={{
            opacity: 0,
            x: -12,
          }}

          animate={{
            opacity: 1,
            x: 0,
          }}

          transition={{
            delay: 0.32,
          }}
        >

          <span className="result-count-number">
            {
              filteredServices.length
            }
          </span>

          {" "}

          {filteredServices.length ===
          1
            ? "Service Found"
            : "Services Found"}

        </motion.div>

      )}


      {/* =====================================================
          SERVICES GRID
      ===================================================== */}

      <motion.div
        key={`${selectedCategory}-${sortBy}-${search}`}

        className="services-grid"

        initial={{
          opacity: 0,
          y: 15,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        transition={{
          duration: 0.3,
        }}
      >

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          Array.from({
            length: 8,
          }).map(
            (_, i) => (

              <motion.div
                key={i}

                initial={{
                  opacity: 0,
                  y: 18,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                transition={{
                  delay:
                    i *
                    0.04,
                }}
              >

                <ServiceSkeleton />

              </motion.div>

            )
          )

        ) : filteredServices.length >
          0 ? (

          /* =================================================
             SERVICE CARDS
          ================================================= */

          filteredServices.map(
            (
              service,
              index
            ) => (

              <motion.div
                key={
                  service.id
                }

                className="services-card-motion"

                initial={{
                  opacity: 0,
                  y: 28,
                  scale: 0.975,
                  filter:
                    "blur(5px)",
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter:
                    "blur(0px)",
                }}

                transition={{
                  duration: 0.52,

                  delay:
                    Math.min(
                      index *
                        0.055,
                      0.4
                    ),

                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
              >

                <ServiceCard
                  {...service}

                  /*
                    IMPORTANT:

                    We keep all original service
                    properties intact.

                    Only the DISPLAY title is
                    changed for card rendering.
                  */

                  title={
                    service.displayTitle
                  }

                  /*
                    Preserve original title too
                    in case ServiceCard needs it
                    for accessibility or logic.
                  */

                  originalTitle={
                    service.title
                  }

                  detailsRoute={`/services/${service.id}`}
                />

              </motion.div>

            )
          )

        ) : (

          /* =================================================
             EMPTY STATE
          ================================================= */

          <motion.div
            className="services-empty-state"

            initial={{
              opacity: 0,
              scale: 0.96,
            }}

            animate={{
              opacity: 1,
              scale: 1,
            }}
          >

            <div className="services-empty-icon">
              <EmptyIcon />
            </div>


            <h3>
              No services found
            </h3>


            <p>
              We couldn't find a service
              matching your current search
              and filters.
            </p>


            <button
              type="button"

              onClick={
                resetFilters
              }

              className="services-reset-btn"
            >
              Reset Filters
            </button>

          </motion.div>

        )}

      </motion.div>

    </main>
  );
}