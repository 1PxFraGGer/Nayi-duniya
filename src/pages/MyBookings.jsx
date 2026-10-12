import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/imageUrl";
import "./bookings.css";

export default function MyBookings() {
  const location = useLocation();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================================
     API
  ========================================= */

  const loadBookings = async () => {
    try {
      const API =
        (await import("../services/api")).default;

      /*
       * Customer-authenticated endpoint.
       *
       * withCredentials should already be configured
       * in your axios instance.
       */

      const response = await API.get("/bookings");

      const rows =
        Array.isArray(response.data)
          ? response.data
          : response.data?.bookings ||
            response.data?.data ||
            [];

      const formatted = rows.map((b) => {
        const rawImage =
          b.service_image ||
          b.image ||
          null;

        return {
          id: b.id,

          title:
            b.service_name ||
            b.service_title ||
            b.title ||
            "Service",

          image:
            getImageUrl(rawImage),

          date:
            b.booking_date ||
            b.date ||
            "—",

          time:
            b.booking_time ||
            b.time ||
            "—",

          price:
            b.amount ??
            b.price ??
            0,

          status:
            b.status ||
            "pending",

          address:
            b.address ||
            "Address not provided",

          phone:
            b.phone ||
            "",

          notes:
            b.notes ||
            "",
        };
      });

      setBookings(formatted);

    } catch (err) {
      console.error(
        "Load bookings error:",
        err
      );

      /*
       * If the backend says unauthorized,
       * don't show a fake empty booking list.
       */
      if (err.response?.status === 401) {
        setBookings([]);
      }

    } finally {
      setLoading(false);
    }
  };


  /* =========================================
     LOAD BOOKINGS
  ========================================= */

  useEffect(() => {
    loadBookings();
  }, []);


  /* =========================================
     OPTIONAL CHECKOUT STATE
     ========================================= */

  useEffect(() => {
    const incomingBookings =
      location.state?.bookings || [];

    if (
      incomingBookings.length > 0 &&
      bookings.length === 0
    ) {
      const formatted =
        incomingBookings.map((b) => {
          const rawImage =
            b.service_image ||
            b.image ||
            null;

          return {
            id: b.id,

            title:
              b.service_name ||
              b.service_title ||
              "Service",

            image:
              getImageUrl(rawImage),

            date:
              b.booking_date ||
              b.date ||
              "—",

            time:
              b.booking_time ||
              b.time ||
              "—",

            price:
              b.amount ??
              b.price ??
              0,

            status:
              b.status ||
              "pending",

            address:
              b.address ||
              "Address not provided",

            phone:
              b.phone ||
              "",

            notes:
              b.notes ||
              "",
          };
        });

      setBookings(formatted);
    }
  }, [location.state, bookings.length]);


  /* =========================================
     CANCEL BOOKING
  ========================================= */

  const cancelBooking = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this booking?"
      )
    ) {
      return;
    }

    try {
      const API =
        (await import("../services/api")).default;

      await API.delete(
        `/bookings/${id}`
      );

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === id
            ? {
                ...booking,
                status: "cancelled",
              }
            : booking
        )
      );

    } catch (err) {
      console.error(
        "Cancel booking error:",
        err
      );

      alert(
        err.response?.data?.msg ||
        err.response?.data?.message ||
        "Cancel failed"
      );
    }
  };


  /* =========================================
     STATUS FORMAT
  ========================================= */

  const formatStatus = (status) => {
    if (!status) {
      return "Pending";
    }

    return String(status)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };


  /* =========================================
     STATUS CLASS
  ========================================= */

  const getStatusClass = (status) => {
    return String(
      status || "pending"
    ).toLowerCase();
  };


  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="bookings-container">
        <h2>My Bookings</h2>

        <div className="no-bookings">
          <p>
            Loading bookings...
          </p>
        </div>
      </div>
    );
  }


  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="bookings-container">

      <h2>
        My Bookings
      </h2>


      {/* =========================
          EMPTY STATE
      ========================= */}

      {bookings.length === 0 ? (

        <div className="no-bookings">

          <p>
            No bookings found
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/services")
            }
            className="view-btn"
          >
            Browse Services
          </button>

        </div>

      ) : (

        <div className="bookings-list">

          {bookings.map((booking) => (

            <div
              key={booking.id}
              className="booking-card"
            >

              {/* =========================
                  IMAGE
              ========================= */}

              <img
                src={
                  booking.image ||
                  "/placeholder.jpg"
                }
                alt={booking.title}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror =
                    null;

                  e.currentTarget.src =
                    "/placeholder.jpg";
                }}
              />


              {/* =========================
                  BOOKING INFO
              ========================= */}

              <div className="booking-info">

                <h3>
                  {booking.title}
                </h3>


                <p>
                  <strong>
                    Booking:
                  </strong>{" "}
                  #{booking.id}
                </p>


                <p>
                  📅 {booking.date}
                </p>


                <p>
                  ⏰ {booking.time}
                </p>


                <p>
                  📍 {booking.address}
                </p>


                <p>
                  📞 {booking.phone}
                </p>


                <p>
                  ₹{booking.price}
                </p>


                {/* =========================
                    STATUS
                ========================= */}

                <span
                  className={`status ${getStatusClass(
                    booking.status
                  )}`}
                >
                  {formatStatus(
                    booking.status
                  )}
                </span>

              </div>


              {/* =========================
                  ACTIONS
              ========================= */}

              <div className="booking-actions">

                <button
                  type="button"
                  className="view-details-btn"
                  onClick={() =>
                    navigate(
                      `/bookings/${booking.id}`,
                      {
                        state: { booking },
                      }
                    )
                  }
                >
                  View Details
                </button>


                <button
                  type="button"
                  className="track-btn"
                  onClick={() =>
                    navigate(
                      `/bookings/${booking.id}/track`,
                      {
                        state: { booking },
                      }
                    )
                  }
                >
                  📍 Track Booking
                </button>


                {booking.status?.toLowerCase() ===
                  "pending" && (

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() =>
                      cancelBooking(
                        booking.id
                      )
                    }
                  >
                    Cancel Booking
                  </button>

                )}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}