import { useLocation, useNavigate } from "react-router-dom";

import "./bookingSuccess.css";

export default function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const bookings =
    location.state?.bookings || [];

  /* =========================================
     NO BOOKING DATA
  ========================================= */

  if (bookings.length === 0) {
    return (
      <div className="booking-success-container">

        <div className="booking-success-card">

          <div className="success-icon">
            ✓
          </div>

          <h1>
            Booking Successful
          </h1>

          <p>
            Your booking has been created
            successfully.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/my-bookings")
            }
            className="success-primary-btn"
          >
            My Bookings
          </button>

        </div>

      </div>
    );
  }


  /* =========================================
     PAGE
  ========================================= */

  return (
    <div className="booking-success-container">

      <div className="booking-success-card">

        {/* SUCCESS ICON */}

        <div className="success-icon">
          ✓
        </div>


        {/* TITLE */}

        <h1>
          Booking Successful!
        </h1>


        <p className="success-message">
          Your service booking has been
          placed successfully.
        </p>


        {/* BOOKING LIST */}

        <div className="success-bookings">

          {bookings.map((booking) => (

            <div
              key={booking.id}
              className="success-booking"
            >

              <div>
                <span>
                  Booking ID
                </span>

                <strong>
                  #{booking.id}
                </strong>
              </div>


              <div>
                <span>
                  Service
                </span>

                <strong>
                  {booking.title ||
                    booking.service_name ||
                    "Service"}
                </strong>
              </div>


              <div>
                <span>
                  Date
                </span>

                <strong>
                  {booking.date ||
                    booking.booking_date ||
                    "—"}
                </strong>
              </div>


              <div>
                <span>
                  Time
                </span>

                <strong>
                  {booking.time ||
                    booking.booking_time ||
                    "—"}
                </strong>
              </div>


              <div>
                <span>
                  Amount
                </span>

                <strong>
                  ₹
                  {booking.price ??
                    booking.amount ??
                    0}
                </strong>
              </div>


              <div>
                <span>
                  Status
                </span>

                <strong className="success-status">
                  Pending
                </strong>
              </div>

            </div>

          ))}

        </div>


        {/* ACTIONS */}

        <div className="success-actions">

          <button
            type="button"
            className="success-primary-btn"
            onClick={() =>
              navigate("/my-bookings", {
                state: {
                  bookings,
                },
              })
            }
          >
            View My Bookings
          </button>


          <button
            type="button"
            className="success-secondary-btn"
            onClick={() =>
              navigate("/services")
            }
          >
            Continue Shopping
          </button>

        </div>

      </div>

    </div>
  );
}
