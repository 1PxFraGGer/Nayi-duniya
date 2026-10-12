import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./notifications.css";

const Notifications = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/notifications");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.notifications || [];

      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (notification) => {
    try {
      await API.put(`/notifications/${notification.id}/read`);

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notification.id
            ? { ...item, is_read: 1, read: 1 }
            : item
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (
      notification.is_read === 0 ||
      notification.is_read === false ||
      notification.read === 0 ||
      notification.read === false
    ) {
      await markAsRead(notification);
    }

    const bookingId =
      notification.booking_id ||
      notification.bookingId;

    if (bookingId) {
      navigate(`/bookings/${bookingId}`);
    }
  };

  const getNotificationTitle = (notification) => {
    return (
      notification.title ||
      notification.heading ||
      notification.type ||
      "Notification"
    );
  };

  const getNotificationMessage = (notification) => {
    return (
      notification.message ||
      notification.description ||
      "You have a new notification."
    );
  };

  const isUnread = (notification) => {
    return (
      notification.is_read === 0 ||
      notification.is_read === false ||
      notification.read === 0 ||
      notification.read === false
    );
  };

  const formatDate = (date) => {
    if (!date) return "";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="notifications-page">

      <div className="notifications-header">
        <div>
          <h1>Notifications</h1>
          <p>
            Stay updated with your bookings and service activities.
          </p>
        </div>

        <button
          type="button"
          className="notification-refresh-btn"
          onClick={fetchNotifications}
        >
          ↻ Refresh
        </button>
      </div>

      {loading && (
        <div className="notifications-loading">
          <div className="notification-spinner"></div>
          <p>Loading notifications...</p>
        </div>
      )}

      {!loading && error && (
        <div className="notifications-error">
          <span>⚠️</span>
          <p>{error}</p>

          <button
            type="button"
            onClick={fetchNotifications}
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && notifications.length === 0 && (
        <div className="notifications-empty">
          <div className="notifications-empty-icon">
            🔔
          </div>

          <h2>No Notifications</h2>

          <p>
            You don't have any notifications right now.
          </p>
        </div>
      )}

      {!loading && !error && notifications.length > 0 && (
        <div className="notifications-list">

          {notifications.map((notification) => {
            const unread = isUnread(notification);

            return (
              <div
                key={notification.id}
                className={`notification-card ${
                  unread ? "unread" : ""
                }`}
                onClick={() =>
                  handleNotificationClick(notification)
                }
              >
                <div className="notification-icon">
                  🔔
                </div>

                <div className="notification-content">
                  <div className="notification-title-row">
                    <h3>
                      {getNotificationTitle(notification)}
                    </h3>

                    {unread && (
                      <span className="unread-dot"></span>
                    )}
                  </div>

                  <p className="notification-message">
                    {getNotificationMessage(notification)}
                  </p>

                  <span className="notification-date">
                    {formatDate(
                      notification.created_at ||
                      notification.createdAt ||
                      notification.date
                    )}
                  </span>
                </div>

                {unread && (
                  <button
                    type="button"
                    className="mark-read-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notification);
                    }}
                  >
                    Mark as read
                  </button>
                )}
              </div>
            );
          })}

        </div>
      )}
    </div>
  );
};

export default Notifications;
