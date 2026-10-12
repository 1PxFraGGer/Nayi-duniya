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

export default function PopularServiceDetail() {
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
     LOAD SERVICE
  ========================================= */

  const loadService = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `/services/${id}`
      );

      const data = res.data;

      setService(data);

      const firstImage =
        data.images?.[0] ||
        data.image ||
        null;

      setSelectedImage(
        getImageUrl(firstImage)
      );
    } catch (err) {
      console.error(
        "Failed to load service:",
        err
      );

      setError(
        "Failed to load service"
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
          "📍 POPULAR SERVICE ADDRESSES:",
          res.data
        );

        /*
         * Backend returns array directly.
         */

        const addressList =
          Array.isArray(res.data)
            ? res.data
            : res.data?.addresses ||
              res.data?.data ||
              [];

        console.log(
          "📍 ADDRESS LIST:",
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

        /*
         * Default address first.
         */

        const defaultAddress =
          addressList.find(
            (address) =>
              Number(
                address.isDefault
              ) === 1
          ) ||
          addressList[0];

        console.log(
          "📍 DEFAULT ADDRESS:",
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
      console.log(
        "Reviews loading error:",
        err
      );

      setReviews([]);
    }
  };

  /* =========================================
     INITIAL SERVICE LOAD
  ========================================= */

  useEffect(() => {
    loadService();
    loadReviews();
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
        "🛒 Service added to cart successfully."
      );
    } catch (err) {
      console.error(
        "Add to cart error:",
        err
      );

      setError(
        err.response?.data?.msg ||
          err.response?.data?.message ||
          "Failed to add service to cart"
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
        "📍 SELECTED BOOKING ADDRESS:",
        selectedAddress
      );

    await API.post("/bookings", {
  service_id: id,

  booking_date: formData.date,
  booking_time: formData.time,

  address: formData.address,

  address_id:
    selectedAddress?.id || null,

  address_type:
    selectedAddress?.addressType || null,

  full_name:
    selectedAddress?.fullName || null,

  mobile:
    selectedAddress?.mobile || null,

  house_no:
    selectedAddress?.houseNo || null,

  address_line1:
    selectedAddress?.addressLine1 || null,

  address_line2:
    selectedAddress?.addressLine2 || null,

  landmark:
    selectedAddress?.landmark || null,

  city:
    selectedAddress?.city || null,

  state:
    selectedAddress?.state || null,

  pincode:
    selectedAddress?.pincode || null,

  country:
    selectedAddress?.country || null,

  latitude:
    selectedAddress?.latitude || null,

  longitude:
    selectedAddress?.longitude || null,

  notes:
    formData.notes || null,
});

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

      loadReviews();
    } catch (err) {
      console.log(err);

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
      <p className="loading">
        Loading...
      </p>
    );
  }

  /* =========================================
     SERVICE NOT FOUND
  ========================================= */

  if (!service) {
    return (
      <p className="error">
        Service not found
      </p>
    );
  }

  /* =========================================
     IMAGE
  ========================================= */

  const currentImage =
    selectedImage ||
    getImageUrl(
      service.images?.[0] ||
        service.image
    );

  return (
    <div className="service-container">

      {/* =====================================
          BACK
      ===================================== */}

      <Link
        to="/popular-services-listing"
        className="back-btn"
      >
        ← Back
      </Link>

      <div className="service-layout">

        {/* =====================================
            LEFT SIDE
        ===================================== */}

        <div className="service-left">

          {/* MAIN IMAGE */}

          <img
            src={currentImage}
            alt={
              service.title ||
              "Popular Service"
            }
            className="main-img"
            onError={(e) => {
              e.currentTarget.onerror =
                null;

              e.currentTarget.src =
                "/placeholder.jpg";
            }}
          />

          {/* SERVICE DESCRIPTION */}

          <div className="box">

            <h2>
              About Service
            </h2>

            <div
              className="html-content"
              dangerouslySetInnerHTML={{
                __html:
                  service.description ||
                  "<p>No description available</p>",
              }}
            />

          </div>

        </div>

        {/* =====================================
            RIGHT SIDE
        ===================================== */}

        <div className="service-right">

          {/* HEADER */}

          <div className="service-header">

            <h1>
              {service.title}
            </h1>

            <div className="service-meta">

              <span className="rating">
                ⭐{" "}
                {service.rating ||
                  4.5}
              </span>

              <span className="price">
                ₹{service.price}
              </span>

            </div>

          </div>

          {/* ===================================
              BOOKING FORM
          =================================== */}

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

          {/* ===================================
              SUCCESS
          =================================== */}

          {message && (
            <div className="success">
              {message}
            </div>
          )}

          {/* =================================
              REVIEWS
          ================================= */}

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

                    <p>
                      {"⭐".repeat(
                        Number(
                          review.rating
                        ) || 0
                      )}
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

          {/* =================================
              REVIEW FORM
          ================================= */}

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

        </div>
      </div>
    </div>
  );
}