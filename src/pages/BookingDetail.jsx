import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useEffect, useState } from "react";

import API from "../services/api";
import { getImageUrl } from "../utils/imageUrl";

import "./bookingDetail.css";

export default function BookingDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [booking, setBooking] = useState(
    location.state?.booking || null
  );

  const [loading, setLoading] = useState(
    !location.state?.booking
  );

  const [cancelling, setCancelling] =
    useState(false);


  /* =========================================
     FORMAT BACKEND BOOKING
  ========================================= */

  const formatBooking = (b) => {
    if (!b) {
      return null;
    }

    const rawImage =
      b.service_image ||
      b.image ||
      null;

    return {
      ...b,

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
        "",

      phone:
        b.phone ||
        "",

      notes:
        b.notes ||
        "",

      customerName:
        b.customer_name ||
        b.customerName ||
        b.user_name ||
        "",

      customerEmail:
        b.customer_email ||
        b.customerEmail ||
        b.email ||
        "",

      description:
        b.service_description ||
        b.description ||
        "",
    };
  };


  /* =========================================
     LOAD BOOKING
  ========================================= */

  useEffect(() => {
    const loadBooking = async () => {
      /*
       * If navigation state already contains
       * the booking, use it immediately.
       */

      if (location.state?.booking) {
        setBooking(
          formatBooking(
            location.state.booking
          )
        );

        setLoading(false);

        return;
      }


      /*
       * No navigation state.
       * Load directly from backend.
       */

      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response =
          await API.get(
            `/bookings/${id}`
          );

        const data =
          response.data?.booking ||
          response.data?.data ||
          response.data;

        setBooking(
          formatBooking(data)
        );

      } catch (err) {
        console.error(
          "Load booking error:",
          err
        );

        setBooking(null);

      } finally {
        setLoading(false);
      }
    };

    loadBooking();

  }, [id, location.state]);


  /* =========================================
     CANCEL BOOKING
  ========================================= */

  const cancelBooking = async () => {
    if (!booking?.id) {
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to cancel this booking?"
      )
    ) {
      return;
    }

    try {
      setCancelling(true);

      await API.delete(
        `/bookings/${booking.id}`
      );

      const updatedBooking = {
        ...booking,
        status: "cancelled",
      };

      setBooking(updatedBooking);

      alert(
        "Booking cancelled successfully"
      );

      navigate("/my-bookings", {
        replace: true,
        state: {
          bookings: [updatedBooking],
        },
      });

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

    } finally {
      setCancelling(false);
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
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="booking-detail-container">

        <p>
          Loading booking details...
        </p>

      </div>
    );
  }


  /* =========================================
     NOT FOUND
  ========================================= */

  if (!booking) {
    return (
      <div className="booking-detail-container">

        <p className="error">
          Booking details are not available.
        </p>

        <Link
          to="/my-bookings"
          className="back-btn"
        >
          ← Back to My Bookings
        </Link>

      </div>
    );
  }


  /* =========================================
     SERVICE IMAGE
  ========================================= */

  const image =
    booking.image ||
    booking.service_image ||
    null;


  /* =========================================
     NORMALIZED STATUS
  ========================================= */

  const bookingStatus =
    String(
      booking.status ||
      "pending"
    ).toLowerCase();


  /* =========================================
     PAGE
  ========================================= */

  return (
    <div className="booking-detail-container">

      {/* =====================================
          BACK
      ===================================== */}

      <Link
        to="/my-bookings"
        className="back-btn"
      >
        ← Back to My Bookings
      </Link>


      {/* =====================================
          MAIN BOOKING CARD
      ===================================== */}

      <div className="booking-detail-card">

        {/* IMAGE */}

        <img
          src={
            getImageUrl(image) ||
            "/placeholder.jpg"
          }
          alt={
            booking.title ||
            "Service"
          }
          className="booking-image"
          onError={(e) => {
            e.currentTarget.onerror =
              null;

            e.currentTarget.src =
              "/placeholder.jpg";
          }}
        />


        {/* INFO */}

        <div className="booking-info">

          <span className="booking-number">
            Booking #{booking.id}
          </span>


          <h2>
            {booking.title ||
              "Service"}
          </h2>


          {/* PRICE */}

          {Number(booking.price) >= 0 && (
            <p className="price">
              ₹{booking.price}
            </p>
          )}


          {/* DATE */}

          <p>
            📅{" "}
            <strong>
              {booking.date || "—"}
            </strong>
          </p>


          {/* TIME */}

          <p>
            ⏰{" "}
            <strong>
              {booking.time || "—"}
            </strong>
          </p>


          {/* STATUS */}

          <span
            className={`status ${bookingStatus}`}
          >
            {formatStatus(
              booking.status
            )}
          </span>


          {/* =================================
              TECHNICIAN
          ================================= */}

          <div className="technician-box">

            <h4>
              Technician
            </h4>

            {booking.technician_name ? (
              <p>
                {booking.technician_name}
              </p>
            ) : (
              <p className="not-assigned">
                Technician will be assigned
                after booking confirmation.
              </p>
            )}

          </div>


          {/* =================================
              ADDRESS
          ================================= */}

          {booking.address && (
            <div className="technician-box">

              <h4>
                Service Address
              </h4>

              <p>
                📍 {booking.address}
              </p>

            </div>
          )}


          {/* =================================
              PHONE
          ================================= */}

          {booking.phone && (
            <div className="technician-box">

              <h4>
                Contact Number
              </h4>

              <p>
                📞 {booking.phone}
              </p>

            </div>
          )}


          {/* =================================
              CANCEL
          ================================= */}

          {bookingStatus === "pending" && (

            <button
              type="button"
              onClick={
                cancelBooking
              }
              className="cancel-btn"
              disabled={cancelling}
            >
              {cancelling
                ? "Cancelling..."
                : "Cancel Booking"}
            </button>

          )}

        </div>

      </div>


      {/* =====================================
          BOOKING INFORMATION
      ===================================== */}

      <div className="booking-desc">

        <h3>
          Booking Details
        </h3>


        <div className="booking-details-list">

          <p>
            <strong>
              Booking ID:
            </strong>{" "}
            #{booking.id}
          </p>


          {booking.customerName && (
            <p>
              <strong>
                Customer:
              </strong>{" "}
              {booking.customerName}
            </p>
          )}


          {booking.customerEmail && (
            <p>
              <strong>
                Email:
              </strong>{" "}
              {booking.customerEmail}
            </p>
          )}


          {booking.phone && (
            <p>
              <strong>
                Phone:
              </strong>{" "}
              {booking.phone}
            </p>
          )}


          {booking.address && (
            <p>
              <strong>
                Address:
              </strong>{" "}
              {booking.address}
            </p>
          )}


          {booking.notes && (
            <p>
              <strong>
                Notes:
              </strong>{" "}
              {booking.notes}
            </p>
          )}

        </div>

      </div>


      {/* =====================================
          SERVICE DESCRIPTION
      ===================================== */}

      {booking.description && (
        <div className="booking-desc">

          <h3>
            Service Details
          </h3>

          <div
            dangerouslySetInnerHTML={{
              __html:
                booking.description,
            }}
          />

        </div>
      )}

    </div>
  );
}