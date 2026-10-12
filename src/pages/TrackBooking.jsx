import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./trackBooking.css";

const TrackBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state?.booking;

  if (!booking) {
    return (
      <div className="track-page">
        <div className="track-empty">
          <div className="track-empty-icon">📦</div>

          <h2>Booking Details Not Available</h2>

          <p>
            This tracking page was opened directly or the booking information
            is no longer available.
          </p>

          <button
            type="button"
            onClick={() => navigate("/my-bookings")}
            className="track-back-btn"
          >
            ← Back to My Bookings
          </button>
        </div>
      </div>
    );
  }

  const status = String(booking.status || "pending").toLowerCase();

  /*
    Backend currently supports:
    pending
    confirmed
    completed
    cancelled
  */

  const isCancelled = status === "cancelled";
  const isCompleted = status === "completed";
  const isConfirmed =
    status === "confirmed" ||
    status === "completed";

  const steps = [
    {
      key: "pending",
      title: "Booking Placed",
      description: "Your booking request has been received.",
      icon: "📝",
      active: true,
    },
    {
      key: "confirmed",
      title: "Booking Confirmed",
      description: "Your service booking has been confirmed.",
      icon: "✅",
      active: isConfirmed,
    },
    {
      key: "assigned",
      title: "Technician Assignment",
      description:
        "Technician assignment will be reflected when available.",
      icon: "👨‍🔧",
      active: isCompleted,
      informational: true,
    },
    {
      key: "progress",
      title: "Service In Progress",
      description:
        "Service progress information will be available when provided.",
      icon: "🔧",
      active: isCompleted,
      informational: true,
    },
    {
      key: "completed",
      title: "Service Completed",
      description: "Your service has been completed.",
      icon: "🎉",
      active: isCompleted,
    },
  ];

  const getCurrentStatus = () => {
    if (isCancelled) return "Cancelled";
    if (isCompleted) return "Completed";
    if (status === "confirmed") return "Confirmed";
    return "Pending";
  };

  const getStatusClass = () => {
    if (isCancelled) return "cancelled";
    if (isCompleted) return "completed";
    if (status === "confirmed") return "confirmed";
    return "pending";
  };

  return (
    <div className="track-page">

      {/* HEADER */}
      <div className="track-header">
        <button
          type="button"
          className="track-back"
          onClick={() => navigate("/my-bookings")}
        >
          ← My Bookings
        </button>

        <div>
          <h1>Track Booking</h1>
          <p>Follow the current status of your service booking.</p>
        </div>
      </div>

      {/* BOOKING SUMMARY */}
      <div className="track-summary">

        <div className="track-service">
          <div className="track-service-image">
            {booking.image ? (
              <img
                src={booking.image}
                alt={booking.title || "Service"}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <span>🔧</span>
            )}
          </div>

          <div>
            <h2>{booking.title || "Service Booking"}</h2>

            <p className="track-booking-id">
              Booking ID: <strong>#{booking.id}</strong>
            </p>
          </div>
        </div>

        <div className={`track-status ${getStatusClass()}`}>
          <span className="track-status-dot"></span>
          {getCurrentStatus()}
        </div>
      </div>

      {/* CANCELLED */}
      {isCancelled && (
        <div className="track-cancelled">
          <div className="cancelled-icon">✕</div>

          <div>
            <h3>Booking Cancelled</h3>
            <p>
              This booking has been cancelled and the service will not proceed.
            </p>
          </div>
        </div>
      )}

      {/* TIMELINE */}
      {!isCancelled && (
        <div className="track-card">
          <div className="track-card-header">
            <div>
              <h2>Booking Timeline</h2>
              <p>Current progress of your booking</p>
            </div>

            <span className={`timeline-status ${getStatusClass()}`}>
              {getCurrentStatus()}
            </span>
          </div>

          <div className="booking-timeline">
            {steps.map((step, index) => (
              <div
                key={step.key}
                className={`timeline-item ${
                  step.active ? "active" : ""
                } ${step.informational ? "informational" : ""}`}
              >
                <div className="timeline-left">

                  <div className="timeline-icon">
                    {step.active ? "✓" : step.icon}
                  </div>

                  {index !== steps.length - 1 && (
                    <div
                      className={`timeline-line ${
                        step.active ? "active" : ""
                      }`}
                    />
                  )}
                </div>

                <div className="timeline-content">
                  <h3>{step.title}</h3>

                  <p>{step.description}</p>

                  {step.informational && !step.active && (
                    <span className="timeline-note">
                      Waiting for service update
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DETAILS */}
      <div className="track-details-grid">

        <div className="track-detail-card">
          <h3>Booking Details</h3>

          <div className="detail-row">
            <span>Service</span>
            <strong>{booking.title || "—"}</strong>
          </div>

          <div className="detail-row">
            <span>Booking ID</span>
            <strong>#{booking.id || "—"}</strong>
          </div>

          <div className="detail-row">
            <span>Date</span>
            <strong>{booking.date || "—"}</strong>
          </div>

          <div className="detail-row">
            <span>Time</span>
            <strong>{booking.time || "—"}</strong>
          </div>

          <div className="detail-row">
            <span>Amount</span>
            <strong>
              ₹{Number(booking.price || 0).toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        <div className="track-detail-card">
          <h3>Service Address</h3>

          <div className="address-box">
            <span className="address-icon">📍</span>

            <div>
              <strong>Service Location</strong>

              <p>{booking.address || "Address not available"}</p>
            </div>
          </div>

          {booking.phone && (
            <div className="phone-box">
              <span>📞</span>

              <div>
                <strong>Contact Number</strong>
                <p>{booking.phone}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* INFORMATION */}
      <div className="tracking-info">
        <span>ℹ️</span>

        <div>
          <strong>Tracking information</strong>

          <p>
            Booking status is based on the latest information available for
            this booking. Technician location or live service progress is not
            available unless provided by the service system.
          </p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="track-actions">

        <button
          type="button"
          className="track-primary-btn"
          onClick={() => navigate("/my-bookings")}
        >
          View My Bookings
        </button>

        <button
          type="button"
          className="track-secondary-btn"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>

      </div>
    </div>
  );
};

export default TrackBooking;
