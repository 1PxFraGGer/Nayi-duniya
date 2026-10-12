import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../../services/api";
import { getImageUrl } from "../../utils/imageUrl";

import "./HomeDailyDeals.css";

export default function HomeDailyDeals() {
  const [services, setServices] = useState([]);
  const [groupedServices, setGroupedServices] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  /* =========================================================
     GET SERVICE IMAGE
     ========================================================= */

  const getServiceImage = (service) => {
    let image = null;

    if (
      Array.isArray(service.images) &&
      service.images.length > 0
    ) {
      image = service.images[0];
    } else if (
      typeof service.images === "string" &&
      service.images.trim()
    ) {
      try {
        const parsed = JSON.parse(service.images);

        image = Array.isArray(parsed)
          ? parsed[0]
          : parsed;
      } catch {
        image = service.images;
      }
    }

    if (!image && service.image) {
      image = service.image;
    }

    if (!image && service.service_image) {
      image = service.service_image;
    }

    if (!image && service.service_images) {
      if (Array.isArray(service.service_images)) {
        image = service.service_images[0];
      } else if (
        typeof service.service_images === "string"
      ) {
        try {
          const parsed = JSON.parse(
            service.service_images
          );

          image = Array.isArray(parsed)
            ? parsed[0]
            : parsed;
        } catch {
          image = service.service_images;
        }
      }
    }

    return getImageUrl(image);
  };

  /* =========================================================
     FETCH DAILY DEALS
     ========================================================= */

  const fetchDailyDeals = async () => {
    try {
      setLoading(true);

      const res = await API.get("/services");

      const allServices = res.data || [];

      const dailyDeals = allServices.filter(
        (service) =>
          Number(service.is_daily_deal) === 1
      );

      const groupedMap = {};

      dailyDeals.forEach((service) => {
        const category =
          service.category_name ||
          service.category ||
          "Other";

        if (!groupedMap[category]) {
          groupedMap[category] = [];
        }

        groupedMap[category].push(service);
      });

      const grouped = Object.keys(groupedMap).map(
        (key) => ({
          name: key,
          services: groupedMap[key],
        })
      );

      setServices(dailyDeals);
      setGroupedServices(grouped);
      setActiveTab(0);
    } catch (error) {
      console.error(
        "Daily deals error:",
        error
      );

      setServices([]);
      setGroupedServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyDeals();
  }, []);

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <p className="hdd-loading">
        Loading daily deals...
      </p>
    );
  }

  /* =========================================================
     EMPTY
     ========================================================= */

  if (!services.length) {
    return null;
  }

  return (
    <section className="hdd-section">
      <div className="hdd-container">

        {/* HEADER */}

        <div className="hdd-header">
          <h2 className="hdd-title">
            Daily Deals
          </h2>

          <Link
            to="/daily-deals"
            className="hdd-view-all"
          >
            View All
          </Link>
        </div>

        {/* CATEGORY TABS */}

        {groupedServices.length > 0 && (
          <div className="hdd-tabs">
            {groupedServices.map(
              (category, index) => (
                <button
                  type="button"
                  key={category.name}
                  onClick={() =>
                    setActiveTab(index)
                  }
                  className={
                    activeTab === index
                      ? "hdd-tab hdd-tab-active"
                      : "hdd-tab"
                  }
                >
                  {category.name}
                </button>
              )
            )}
          </div>
        )}

        {/* GRID */}

        <div className="hdd-grid">
          {groupedServices.length > 0 &&
            groupedServices[
              activeTab
            ]?.services
              ?.slice(0, 4)
              .map((service) => {
                const image =
                  getServiceImage(service);

                const currentPrice =
                  Number(
                    service.daily_deal_price ||
                      service.price ||
                      0
                  );

                const originalPrice =
                  Number(
                    service.price || 0
                  );

                const hasDiscount =
                  service.daily_deal_price &&
                  currentPrice <
                    originalPrice;

                return (
                  <article
                    className="hdd-card"
                    key={service.id}
                  >
                    {/* IMAGE */}

                    <div className="hdd-image-wrap">
                      <img
                        className="hdd-image"
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

                      <span className="hdd-badge">
                        🔥 Deal
                      </span>
                    </div>

                    {/* CONTENT */}

                    <div className="hdd-content">
                      <h3 className="hdd-card-title">
                        {service.title}
                      </h3>

                      <div className="hdd-price-row">
                        <p className="hdd-price">
                          ₹
                          {currentPrice.toLocaleString(
                            "en-IN"
                          )}
                        </p>

                        {hasDiscount && (
                          <span className="hdd-old-price">
                            ₹
                            {originalPrice.toLocaleString(
                              "en-IN"
                            )}
                          </span>
                        )}
                      </div>

                      <Link
                        to={`/daily-deals/${service.id}`}
                        className="hdd-details-btn"
                      >
                        View Deal
                      </Link>
                    </div>
                  </article>
                );
              })}
        </div>
      </div>
    </section>
  );
}