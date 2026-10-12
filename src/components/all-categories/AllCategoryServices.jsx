import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import API from "../../services/api";
import { getImageUrl } from "../../utils/imageUrl";

import "./AllCategoryServices.css";

export default function AllCategoryServices() {
  const [categories, setCategories] = useState([]);
  const [servicesByCategory, setServicesByCategory] =
    useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

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
    }

    else if (
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
      if (
        Array.isArray(service.service_images)
      ) {
        image =
          service.service_images[0];
      } else {
        try {
          const parsed = JSON.parse(
            service.service_images
          );

          image = Array.isArray(parsed)
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

  /* =========================================================
     LOAD DATA
     ========================================================= */

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        categoryRes,
        serviceRes,
      ] = await Promise.all([
        API.get("/categories"),
        API.get("/services"),
      ]);

      const allCategories =
        categoryRes.data || [];

      const allServices =
        serviceRes.data || [];

      setCategories(allCategories);

      /* =====================================================
         GROUP SERVICES BY CATEGORY
         ===================================================== */

      const grouped = {};

      allServices.forEach(
        (service) => {
          const categoryId =
            service.category_id;

          if (!grouped[categoryId]) {
            grouped[categoryId] = [];
          }

          grouped[categoryId].push(
            service
          );
        }
      );

      setServicesByCategory(grouped);

    } catch (err) {
      console.error(
        "Error loading categories/services:",
        err
      );

      setCategories([]);
      setServicesByCategory({});

    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <p className="acs-loading">
        Loading services...
      </p>
    );
  }

  /* =========================================================
     EMPTY
     ========================================================= */

  if (!categories.length) {
    return (
      <p className="acs-empty-page">
        No categories found
      </p>
    );
  }

  return (
    <section className="acs-section">
      <div className="acs-container">

        {categories.map((category) => {
          const categoryServices =
            servicesByCategory[
              category.id
            ] || [];

          return (
            <div
              key={category.id}
              className="acs-category-section"
            >

              {/* =====================================
                  HEADER
                  ===================================== */}

              <div className="acs-header">

                <h2 className="acs-title">
                  {category.name}
                </h2>

                <Link
                  to={`/services/category/${category.id}`}
                  className="acs-view-all-btn"
                >
                  View All
                </Link>

              </div>


              {/* =====================================
                  SERVICES
                  ===================================== */}

              {categoryServices.length >
              0 ? (

                <div className="acs-grid">

                  {categoryServices
                    .slice(0, 4)
                    .map((service) => {

                      const image =
                        getServiceImage(
                          service
                        );

                      return (
                        <article
                          className="acs-card"
                          key={service.id}
                        >

                          {/* IMAGE */}

                          <div className="acs-image-wrap">

                            <img
                              className="acs-image"
                              src={image}
                              alt={
                                service.title ||
                                category.name
                              }
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.onerror =
                                  null;

                                e.currentTarget.src =
                                  "/placeholder.jpg";
                              }}
                            />

                          </div>


                          {/* CONTENT */}

                          <div className="acs-content">

                            <span className="acs-category-tag">
                              {category.name}
                            </span>


                            <h3 className="acs-card-title">
                              {service.title}
                            </h3>


                            <p className="acs-price">
                              ₹
                              {Number(
                                service.price || 0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </p>


                            <Link
                              to={`/service/${service.id}`}
                              className="acs-details-btn"
                            >
                              View Details
                            </Link>

                          </div>

                        </article>
                      );
                    })}

                </div>

              ) : (

                <div className="acs-no-services">

                  <p>
                    No services available
                    in this category.
                  </p>

                </div>

              )}

            </div>
          );
        })}

      </div>
    </section>
  );
}