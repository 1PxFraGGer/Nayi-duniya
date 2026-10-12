import {
  useEffect,
  useRef,
  useState,
} from "react";

import { Link } from "react-router-dom";

import API from "../../services/api";
import { getImageUrl } from "../../utils/imageUrl";

import "./HomeDailyDeals.css";

export default function HomeDailyDeals() {
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [groupedServices, setGroupedServices] =
    useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================================
     TAB CHANGE ANIMATION STATE
  ========================================= */

  const [
    isChangingTab,
    setIsChangingTab,
  ] = useState(false);

  const tabTimerRef = useRef(null);

  /* =========================================
     INITIAL FETCH
  ========================================= */

  useEffect(() => {
    fetchDailyDeals();
  }, []);

  /* =========================================
     CLEANUP TIMER
  ========================================= */

  useEffect(() => {
    return () => {
      if (tabTimerRef.current) {
        clearTimeout(
          tabTimerRef.current
        );
      }
    };
  }, []);

  /* =========================================
     GET SERVICE IMAGE
  ========================================= */

  const getServiceImage = (service) => {
    let image = null;

    /* ARRAY */

    if (
      Array.isArray(service.images) &&
      service.images.length > 0
    ) {
      image = service.images[0];
    }

    /* JSON STRING / NORMAL STRING */

    else if (
      typeof service.images === "string" &&
      service.images.trim()
    ) {
      try {
        const parsed =
          JSON.parse(service.images);

        if (Array.isArray(parsed)) {
          image = parsed[0];
        } else if (
          typeof parsed === "string"
        ) {
          image = parsed;
        }
      } catch {
        image = service.images;
      }
    }

    /* FALLBACK */

    if (!image && service.image) {
      image = service.image;
    }

    if (
      !image &&
      service.service_image
    ) {
      image = service.service_image;
    }

    if (
      !image &&
      service.service_images
    ) {
      if (
        Array.isArray(
          service.service_images
        )
      ) {
        image =
          service.service_images[0];
      } else if (
        typeof service.service_images ===
        "string"
      ) {
        try {
          const parsed = JSON.parse(
            service.service_images
          );

          image =
            Array.isArray(parsed)
              ? parsed[0]
              : parsed;
        } catch {
          image =
            service.service_images;
        }
      }
    }

    return getImageUrl(image);
  };

  /* =========================================
     FETCH DAILY DEALS
  ========================================= */

  const fetchDailyDeals = async () => {
    try {
      setLoading(true);

      const res =
        await API.get("/services");

      const allServices =
        res.data || [];

      /* DAILY DEAL FILTER */

      const dailyDeals =
        allServices.filter(
          (service) =>
            Number(
              service.is_daily_deal
            ) === 1
        );

      /* =====================================
         GROUP BY CATEGORY
      ===================================== */

      const groupedMap = {};

      dailyDeals.forEach(
        (service) => {
          const category =
            service.category_name ||
            service.category ||
            "Other";

          if (!groupedMap[category]) {
            groupedMap[category] = [];
          }

          groupedMap[category].push(
            service
          );
        }
      );

      const grouped =
        Object.keys(groupedMap).map(
          (key) => ({
            name: key,
            services:
              groupedMap[key],
          })
        );

      setServices(dailyDeals);
      setGroupedServices(grouped);
      setActiveTab(0);

    } catch (err) {
      console.error(
        "Daily deals error:",
        err
      );

      setServices([]);
      setGroupedServices([]);
      setActiveTab(0);

    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     ANIMATED CATEGORY CHANGE
  ========================================= */

  const handleCategoryChange = (
    index
  ) => {
    /* SAME TAB - DO NOTHING */

    if (index === activeTab) {
      return;
    }

    /* PREVENT MULTIPLE TIMERS */

    if (tabTimerRef.current) {
      clearTimeout(
        tabTimerRef.current
      );
    }

    /* EXIT ANIMATION */

    setIsChangingTab(true);

    tabTimerRef.current =
      setTimeout(() => {
        /* CHANGE CATEGORY */

        setActiveTab(index);

        /* ENTER ANIMATION */

        setIsChangingTab(false);

        tabTimerRef.current =
          null;
      }, 180);
  };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <p className="hdd-loading">
        Loading daily deals...
      </p>
    );
  }

  /* =========================================
     EMPTY
  ========================================= */

  if (!services.length) {
    return null;
  }

  return (
    <section className="hdd-section">

      <div className="hdd-container">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="hdd-header">

          <h2 className="hdd-title">
            Daily Deals
          </h2>

          <Link
            to="/daily-deals-listing"
            className="hdd-view-all-btn"
          >
            View All
          </Link>

        </div>

        {/* =====================================
            CATEGORY TABS
        ===================================== */}

        {groupedServices.length >
          0 && (

          <div className="hdd-category-tabs">

            {groupedServices.map(
              (
                category,
                index
              ) => (

                <button
                  type="button"
                  key={
                    category.name
                  }
                  onClick={() =>
                    handleCategoryChange(
                      index
                    )
                  }
                  disabled={
                    isChangingTab
                  }
                  className={
                    activeTab ===
                    index
                      ? "hdd-category-tab hdd-category-tab-active"
                      : "hdd-category-tab"
                  }
                >
                  {category.name}
                </button>

              )
            )}

          </div>

        )}

        {/* =====================================
            SERVICES GRID
        ===================================== */}

        <div
          key={activeTab}
          className={`hdd-services-grid ${
            isChangingTab
              ? "hdd-grid-switching"
              : "hdd-grid-active"
          }`}
        >

          {groupedServices.length >
            0 &&
            groupedServices[
              activeTab
            ]?.services?.map(
              (service) => {

                const image =
                  getServiceImage(
                    service
                  );

                const dealPrice =
                  Number(
                    service.daily_deal_price ||
                      service.price ||
                      0
                  );

                const originalPrice =
                  Number(
                    service.price ||
                      0
                  );

                const hasDiscount =
                  dealPrice <
                  originalPrice;

                return (

                  <div
                    className="hdd-service-card"
                    key={service.id}
                  >

                    {/* =========================
                        IMAGE
                    ========================= */}

                    <div className="hdd-service-image">

                      <img
                        src={image}
                        alt={
                          service.title ||
                          "Daily Deal"
                        }
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror =
                            null;

                          e.currentTarget.src =
                            "/placeholder.jpg";
                        }}
                      />

                      <span className="hdd-deal-badge">
                        🔥 Deal
                      </span>

                    </div>

                    {/* =========================
                        CONTENT
                    ========================= */}

                    <div className="hdd-service-content">

                      <h3>
                        {service.title}
                      </h3>

                      {/* PRICE */}

                      <div className="hdd-price-wrapper">

                        <p className="hdd-deal-price">
                          ₹
                          {dealPrice.toLocaleString(
                            "en-IN"
                          )}
                        </p>

                        {hasDiscount && (

                          <span className="hdd-original-price">
                            ₹
                            {originalPrice.toLocaleString(
                              "en-IN"
                            )}
                          </span>

                        )}

                      </div>

                      {/* BUTTON */}

                      <Link
                        to={`/daily-deals/${service.id}`}
                        className="hdd-details-btn"
                      >
                        View Deal
                      </Link>

                    </div>

                  </div>

                );
              }
            )}

        </div>

      </div>

    </section>
  );
}