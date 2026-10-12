import {
  useParams,
  Link,
} from "react-router-dom";

import {
  useState,
  useEffect,
} from "react";

import API from "../../services/api";

import {
  getImageUrl,
} from "../../utils/imageUrl";

import {
  useAuth,
} from "../../context/AuthContext";

import "../../pages/serviceDetails.css";

export default function DailyDealDetail() {
  const { id } = useParams();

  /* =========================================
     AUTH
  ========================================= */

  const {
    user,
    loading: authLoading,
  } = useAuth();

  /* =========================================
     SERVICE
  ========================================= */

  const [service, setService] =
    useState(null);

  const [selectedImage, setSelectedImage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /* =========================================
     BOOKING FORM
  ========================================= */

  const [formData, setFormData] =
    useState({
      date: "",
      time: "",
      address: "",
      notes: "",
    });

  /* =========================================
     CUSTOMER ADDRESSES
  ========================================= */

  const [addresses, setAddresses] =
    useState([]);

  const [selectedAddressId, setSelectedAddressId] =
    useState("");

  const [addressLoading, setAddressLoading] =
    useState(false);

  /* =========================================
     MESSAGES
  ========================================= */

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  /* =========================================
     REVIEWS
  ========================================= */

  const [reviews, setReviews] =
    useState([]);

  const [comment, setComment] =
    useState("");

  const [rating, setRating] =
    useState(5);

  const [canReview, setCanReview] =
    useState(false);

  /* =========================================
     FORMAT ADDRESS
  ========================================= */

  const formatAddress = (address) => {
    if (!address) return "";

    return [
      address.fullName,
      address.mobile,
      address.houseNo,
      address.addressLine1,
      address.addressLine2,
      address.landmark,
      address.city,
      address.state,
      address.pincode,
      address.country,
    ]
      .filter(Boolean)
      .join(", ");
  };

  /* =========================================
     INITIAL SERVICE + REVIEWS
  ========================================= */

  useEffect(() => {
    loadService();
    loadReviews();
    checkReviewEligibility();
  }, [id]);

  /* =========================================
     LOAD ADDRESS AFTER AUTH
  ========================================= */

  useEffect(() => {
    if (
      !authLoading &&
      user
    ) {
      loadCustomerAddresses();
    }
  }, [
    user,
    authLoading,
  ]);

  /* =========================================
     LOAD SERVICE
  ========================================= */

  const loadService = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get(
        `/services/${id}`
      );

      const data = res.data;

      setService(data);

      const image =
        data.images?.[0] ||
        data.image ||
        null;

      setSelectedImage(
        getImageUrl(image)
      );
    } catch (err) {
      console.error(
        "Error loading daily deal:",
        err
      );

      setError(
        "Failed to load deal"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     LOAD CUSTOMER ADDRESSES
  ========================================= */

  const loadCustomerAddresses =
    async () => {
      if (!user) {
        return;
      }

      try {
        setAddressLoading(true);

        const res = await API.get(
          "/customer/addresses"
        );

        console.log(
          "📍 DAILY DEAL CUSTOMER ADDRESSES:",
          res.data
        );

        const addressList =
          Array.isArray(res.data)
            ? res.data
            : res.data?.addresses ||
              res.data?.data ||
              [];

        console.log(
          "📍 DAILY DEAL ADDRESS LIST:",
          addressList
        );

        setAddresses(addressList);

        if (
          addressList.length === 0
        ) {
          setSelectedAddressId("");

          setFormData((prev) => ({
            ...prev,
            address: "",
          }));

          return;
        }

        const defaultAddress =
          addressList.find(
            (address) =>
              Number(
                address.isDefault
              ) === 1
          ) ||
          addressList[0];

        console.log(
          "📍 DAILY DEAL DEFAULT ADDRESS:",
          defaultAddress
        );

        setSelectedAddressId(
          String(defaultAddress.id)
        );

        setFormData((prev) => ({
          ...prev,
          address:
            formatAddress(
              defaultAddress
            ),
        }));
      } catch (err) {
        console.error(
          "❌ Error loading customer addresses:",
          err
        );

        setAddresses([]);
        setSelectedAddressId("");
      } finally {
        setAddressLoading(false);
      }
    };

  /* =========================================
     LOAD REVIEWS
  ========================================= */

  const loadReviews = async () => {
    try {
      const res = await API.get(
        `/comments/service/${id}`
      );

      setReviews(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (err) {
      console.error(
        "Error loading reviews:",
        err
      );

      setReviews([]);
    }
  };

  /* =========================================
     CHECK REVIEW ELIGIBILITY
  ========================================= */

  const checkReviewEligibility =
    async () => {
      try {
        const res = await API.get(
          "/bookings/my-bookings"
        );

        const bookings =
          res.data || [];

        const completedBooking =
          bookings.find(
            (booking) =>
              String(
                booking.service_id
              ) === String(id) &&
              booking.status ===
                "completed"
          );

        setCanReview(
          !!completedBooking
        );
      } catch (err) {
        console.error(
          "Review eligibility error:",
          err
        );

        setCanReview(false);
      }
    };

  /* =========================================
     BOOKING INPUT
  ========================================= */

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================
     ADDRESS CHANGE
  ========================================= */

  const handleAddressChange = (
    e
  ) => {
    const addressId =
      e.target.value;

    setSelectedAddressId(
      addressId
    );

    const selected =
      addresses.find(
        (address) =>
          String(address.id) ===
          String(addressId)
      );

    if (selected) {
      setFormData((prev) => ({
        ...prev,
        address:
          formatAddress(
            selected
          ),
      }));
    }
  };

  /* =========================================
     ADD TO CART
  ========================================= */

  const handleAddToCart = async () => {
    try {
      setError("");
      setMessage("");

      if (!user) {
        setError(
          "Please login to add this service to cart."
        );

        return;
      }

      await API.post(
        "/cart",
        {
          service_id: id,
          quantity: 1,
        }
      );

      setMessage(
        "🛒 Daily Deal added to cart successfully."
      );
    } catch (err) {
      console.error(
        "Add to cart error:",
        err
      );

      setError(
        err.response?.data?.msg ||
          err.response?.data?.message ||
          "Failed to add deal to cart"
      );
    }
  };

  /* =========================================
     BOOK SERVICE
  ========================================= */

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (authLoading) {
      return;
    }

    if (!user) {
      setError(
        "Please login before booking a service."
      );

      return;
    }

    if (
      !formData.date ||
      !formData.time
    ) {
      setError(
        "Date & time required"
      );

      return;
    }

    if (
      addresses.length === 0
    ) {
      setError(
        "Please add a service address from your profile before booking."
      );

      return;
    }

    if (
      !selectedAddressId
    ) {
      setError(
        "Please select a service address."
      );

      return;
    }

    try {
      const selectedAddress =
        addresses.find(
          (address) =>
            String(address.id) ===
            String(
              selectedAddressId
            )
        );

      if (!selectedAddress) {
        setError(
          "Selected address not found."
        );

        return;
      }

      console.log(
        "📍 DAILY DEAL SELECTED ADDRESS:",
        selectedAddress
      );

      await API.post(
        "/bookings",
        {
          service_id: id,

          booking_date:
            formData.date,

          booking_time:
            formData.time,

          address:
            formData.address,

          address_id:
            selectedAddress.id,

          address_type:
            selectedAddress.addressType ||
            null,

          full_name:
            selectedAddress.fullName ||
            null,

          mobile:
            selectedAddress.mobile ||
            null,

          house_no:
            selectedAddress.houseNo ||
            null,

          address_line1:
            selectedAddress.addressLine1 ||
            null,

          address_line2:
            selectedAddress.addressLine2 ||
            null,

          landmark:
            selectedAddress.landmark ||
            null,

          city:
            selectedAddress.city ||
            null,

          state:
            selectedAddress.state ||
            null,

          pincode:
            selectedAddress.pincode ||
            null,

          country:
            selectedAddress.country ||
            null,

          latitude:
            selectedAddress.latitude ||
            null,

          longitude:
            selectedAddress.longitude ||
            null,

          notes:
            formData.notes || "",
        }
      );

      setMessage(
        "✅ Booking Successful"
      );

      setFormData((prev) => ({
        ...prev,
        date: "",
        time: "",
        notes: "",
        address:
          formatAddress(
            selectedAddress
          ),
      }));
    } catch (err) {
      console.error(
        "Booking error:",
        err
      );

      setError(
        err.response?.data?.msg ||
          err.response?.data?.message ||
          "Booking failed"
      );
    }
  };

  /* =========================================
     SUBMIT REVIEW
  ========================================= */

  const submitReview = async () => {
    if (!user) {
      alert(
        "Please login to submit a review."
      );

      return;
    }

    if (!comment.trim()) {
      alert(
        "Please write review"
      );

      return;
    }

    try {
      setError("");
      setMessage("");

      await API.post(
        "/comments",
        {
          service_id: id,
          comment:
            comment.trim(),
          rating:
            Number(rating),
        }
      );

      setComment("");
      setRating(5);

      setMessage(
        "Your review has been submitted and is waiting for admin approval."
      );

      await loadReviews();
    } catch (err) {
      console.error(
        "Review error:",
        err
      );

      alert(
        err.response?.data?.msg ||
          "Review failed"
      );
    }
  };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="service-container">
        <p>Loading...</p>
      </div>
    );
  }

  /* =========================================
     NOT FOUND
  ========================================= */

  if (!service) {
    return (
      <div className="service-container">
        <p>
          {error ||
            "Deal not found"}
        </p>
      </div>
    );
  }

  /* =========================================
     IMAGE
  ========================================= */

  const serviceImage =
    service.images?.[0] ||
    service.image ||
    null;

  const imageUrl =
    selectedImage ||
    getImageUrl(
      serviceImage
    );

  /* =========================================
     PRICES
  ========================================= */

  const originalPrice =
    Number(
      service.price || 0
    );

  const dealPrice =
    Number(
      service.daily_deal_price ||
        service.price ||
        0
    );

  return (
    <div className="service-container">

      {/* =================================================
          BACK
      ================================================= */}

      <Link
        to="/daily-deals-listing"
        className="back-btn"
      >
        ← Back
      </Link>

      <div className="service-layout">

        {/* =================================================
            LEFT
        ================================================= */}

        <div className="service-left">

          {/* MAIN IMAGE */}

          <img
            src={imageUrl}
            alt={
              service.title ||
              "Daily Deal"
            }
            className="main-img"
            onError={(e) => {
              e.currentTarget.onerror =
                null;

              e.currentTarget.src =
                "/placeholder.jpg";
            }}
          />

          {/* DETAILS */}

          <div className="box">

            <h2>
              Deal Details
            </h2>

            <div
              className="html-content"
              dangerouslySetInnerHTML={{
                __html:
                  service.description ||
                  "<p>No details available</p>",
              }}
            />

          </div>

        </div>

        {/* =================================================
            RIGHT
        ================================================= */}

        <div className="service-right">

          {/* TITLE */}

          <h1>
            {service.title}
          </h1>

          {/* DEAL BADGE */}

          <div className="deal-badge">
            🔥 Daily Deal
          </div>

          {/* PRICE */}

          <div className="service-meta">

            {originalPrice >
              dealPrice && (
              <span
                style={{
                  textDecoration:
                    "line-through",
                }}
              >
                ₹{originalPrice}
              </span>
            )}

            <span className="price">
              ₹{dealPrice}
            </span>

          </div>

          {/* =================================================
              BOOKING
          ================================================= */}

          <form
            onSubmit={
              handleSubmit
            }
            className="form"
          >

            {error && (
              <div className="error">
                {error}
              </div>
            )}

            {/* NAME */}

            <div className="form-group">

              <label htmlFor="booking-name">
                Name
              </label>

              <input
                id="booking-name"
                type="text"
                value={
                  user?.name || ""
                }
                placeholder="Enter your name"
                readOnly
                className="form-control"
              />

            </div>

            {/* MOBILE */}

            <div className="form-group">

              <label htmlFor="booking-phone">
                Mobile
              </label>

              <input
                id="booking-phone"
                type="tel"
                value={
                  user?.phone || ""
                }
                placeholder="Enter your mobile number"
                readOnly
                className="form-control"
              />

            </div>

            {/* EMAIL */}

            <div className="form-group">

              <label htmlFor="booking-email">
                Email
              </label>

              <input
                id="booking-email"
                type="email"
                value={
                  user?.email || ""
                }
                placeholder="Enter your email"
                readOnly
                className="form-control"
              />

            </div>

            {/* DATE */}

            <div className="form-group">

              <label htmlFor="booking-date">
                Booking Date
              </label>

              <input
                id="booking-date"
                type="date"
                name="date"
                value={
                  formData.date
                }
                onChange={
                  handleChange
                }
                required
                className="form-control"
              />

            </div>

            {/* TIME */}

            <div className="form-group">

              <label htmlFor="booking-time">
                Booking Time
              </label>

              <input
                id="booking-time"
                type="time"
                name="time"
                value={
                  formData.time
                }
                onChange={
                  handleChange
                }
                required
                className="form-control"
              />

            </div>

            {/* SERVICE ADDRESS */}

            <div className="form-group">

              <label htmlFor="booking-address">
                Service Address
              </label>

              {addressLoading ? (
                <div className="form-control">
                  Loading saved address...
                </div>
              ) : addresses.length >
                0 ? (
                <>
                  <select
                    id="booking-address"
                    value={
                      selectedAddressId
                    }
                    onChange={
                      handleAddressChange
                    }
                    className="form-control address-selector"
                    required
                  >

                    {addresses.map(
                      (address) => (
                        <option
                          key={
                            address.id
                          }
                          value={
                            address.id
                          }
                        >
                          {address.addressType ||
                            "Address"}{" "}
                          —{" "}
                          {address.city ||
                            address.addressLine1 ||
                            "Saved Address"}
                        </option>
                      )
                    )}

                  </select>

                  <textarea
                    className="form-control address-display"
                    value={
                      formData.address
                    }
                    readOnly
                    rows={5}
                  />

                </>
              ) : (
                <textarea
                  id="booking-address"
                  name="address"
                  placeholder="Please add a service address from your profile"
                  value={
                    formData.address
                  }
                  readOnly
                  required
                  className="form-control textarea-control"
                />
              )}

            </div>

            {/* NOTES */}

            <div className="form-group">

              <label htmlFor="booking-notes">
                Additional Notes
              </label>

              <textarea
                id="booking-notes"
                name="notes"
                placeholder="Additional notes (optional)"
                value={
                  formData.notes
                }
                onChange={
                  handleChange
                }
                className="form-control textarea-control"
              />

            </div>

            {/* ADD TO CART */}

            <button
              type="button"
              onClick={
                handleAddToCart
              }
              disabled={
                authLoading
              }
              className="add-cart-btn"
            >
              🛒 Add to Cart
            </button>

            {/* BOOK NOW */}

            <button
              type="submit"
              disabled={
                authLoading
              }
              className="book-btn"
            >
              {authLoading
                ? "Loading..."
                : "Book Now"}
            </button>

          </form>

          {/* SUCCESS MESSAGE */}

          {message && (
            <div className="success">
              {message}
            </div>
          )}

          {/* =================================================
              REVIEWS
          ================================================= */}

          <div className="reviews-list">

            <h3>
              Customer Reviews
            </h3>

            {reviews.length ===
            0 ? (
              <p>
                No reviews yet
              </p>
            ) : (
              reviews.map(
                (review) => (
                  <div
                    key={
                      review.id
                    }
                    className="review-item"
                  >

                    <h4>
                      {review.user_name ||
                        "Customer"}
                    </h4>

                    <p className="review-rating">
                      ⭐{" "}
                      {
                        review.rating
                      }
                      /5
                    </p>

                    <p>
                      {
                        review.comment
                      }
                    </p>

                  </div>
                )
              )
            )}

          </div>

          {/* =================================================
              REVIEW FORM
          ================================================= */}

          {canReview && (
            <div className="review-box">

              <h3>
                Leave Review
              </h3>

              <select
                value={rating}
                onChange={(e) =>
                  setRating(
                    Number(
                      e.target.value
                    )
                  )
                }
              >

                <option value={5}>
                  5 Star
                </option>

                <option value={4}>
                  4 Star
                </option>

                <option value={3}>
                  3 Star
                </option>

                <option value={2}>
                  2 Star
                </option>

                <option value={1}>
                  1 Star
                </option>

              </select>

              <textarea
                placeholder="Write review..."
                value={comment}
                onChange={(e) =>
                  setComment(
                    e.target.value
                  )
                }
              />

              <button
                type="button"
                onClick={
                  submitReview
                }
              >
                Submit Review
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}