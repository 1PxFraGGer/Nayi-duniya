import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import API from "../services/api";

import "./checkout.css";

export default function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const [selectedAddress, setSelectedAddress] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================
     LOAD ADDRESSES
  ========================================= */

  const loadAddresses = async () => {
    try {
      const response = await API.get(
        "/customer/addresses"
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.addresses || [];

      setAddresses(data);

      const defaultAddress = data.find(
        (address) =>
          Number(address.isDefault) === 1
      );

      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else if (data.length > 0) {
        setSelectedAddress(data[0]);
      } else {
        setSelectedAddress(null);
      }

    } catch (err) {
      console.error(
        "Load addresses error:",
        err
      );

      throw err;
    }
  };

  /* =========================================
     LOAD CART
  ========================================= */

  const loadCart = async () => {
    try {
      const response = await API.get(
        "/cart"
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.cart || [];

      setCartItems(data);

    } catch (err) {
      console.error(
        "Load checkout cart error:",
        err
      );

      throw err;
    }
  };

  /* =========================================
     INITIAL LOAD
  ========================================= */

  useEffect(() => {
    const loadCheckout = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        await Promise.all([
          loadAddresses(),
          loadCart(),
        ]);

      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.response?.data?.msg ||
          "Failed to load checkout"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCheckout();
  }, [user]);

  /* =========================================
     SELECT ADDRESS
  ========================================= */

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setError("");
  };

  /* =========================================
     MANAGE ADDRESSES
  ========================================= */

  const handleManageAddresses = () => {
    navigate("/account/addresses");
  };

  /* =========================================
     PRICE
  ========================================= */

  const getPrice = (item) => {
    return Number(
      item.price ??
      item.service_price ??
      item.service?.price ??
      0
    );
  };

  /* =========================================
     TOTAL
  ========================================= */

  const cartTotal = cartItems.reduce(
    (sum, item) =>
      sum +
      getPrice(item) *
        Number(item.quantity || 1),
    0
  );

  /* =========================================
     PLACE ORDER
  ========================================= */

  const handlePlaceOrder = async () => {
  if (!selectedAddress) {
    setError("Please select a delivery address");
    return;
  }

  if (cartItems.length === 0) {
    setError("Your cart is empty");
    return;
  }

  try {
    setError("");

    /*
      Create one booking for each service
      in the cart.
    */

    const bookings = [];

    for (const item of cartItems) {
  const serviceId =
    item.service_id ||
    item.service?.id;

  if (!serviceId) {
    throw new Error(
      "Invalid service in cart"
    );
  }

  const response = await API.post(
    "/bookings/customer",
    {
      service_id: Number(serviceId),

      booking_date:
        new Date()
          .toISOString()
          .split("T")[0],

      booking_time:
        new Date()
          .toTimeString()
          .slice(0, 5),

      address:
        `${selectedAddress.fullName}, ` +
        `${selectedAddress.houseNo}, ` +
        `${selectedAddress.addressLine1}, ` +
        `${selectedAddress.addressLine2 ? selectedAddress.addressLine2 + ", " : ""}` +
        `${selectedAddress.city}, ` +
        `${selectedAddress.state} - ` +
        `${selectedAddress.pincode}`,

      notes:
        `Quantity: ${Number(
          item.quantity || 1
        )}`,
    }
  );

  const createdBooking =
    response.data?.booking;

  if (!createdBooking) {
    throw new Error(
      "Booking was created but booking details were not returned"
    );
  }

  bookings.push({
    ...createdBooking,

    title:
      createdBooking.service_name ||
      "Service",

    price:
      createdBooking.amount ??
      0,

    date:
      createdBooking.booking_date ||
      "—",

    time:
      createdBooking.booking_time ||
      "—",

    address:
      createdBooking.address ||
      "",

    phone:
      createdBooking.phone ||
      selectedAddress.mobile ||
      "",
  });
}
    /* =====================================
       CLEAR CART
    ===================================== */

    for (const item of cartItems) {
      await API.delete(
        `/cart/${item.id}`
      );
    }

    setCartItems([]);

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    /* =====================================
       SUCCESS
    ===================================== */
navigate("/booking-success", {
  state: {
    bookingSuccess: true,
    bookings,
  },
});

  } catch (err) {
    console.error(
      "Place order error:",
      err
    );

    setError(
      err.response?.data?.msg ||
      err.response?.data?.message ||
      err.message ||
      "Failed to place booking"
    );
  }
};
  /* =========================================
     NOT LOGGED IN
  ========================================= */

  if (!user) {
    return (
      <div className="checkout-container">

        <div className="checkout-card">

          <h2>
            Checkout
          </h2>

          <p>
            Please login before checkout.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
          >
            Login
          </button>

        </div>

      </div>
    );
  }

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="checkout-container">

        <div className="checkout-card">

          <h2>
            Checkout
          </h2>

          <p>
            Loading checkout...
          </p>

        </div>

      </div>
    );
  }

  /* =========================================
     PAGE
  ========================================= */

  return (
    <div className="checkout-container">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="checkout-header">

        <button
          type="button"
          className="checkout-back"
          onClick={() =>
            navigate("/cart")
          }
        >
          ← Back to Cart
        </button>

        <h1>
          Checkout
        </h1>

      </div>

      {error && (
        <div className="checkout-error">
          {error}
        </div>
      )}

      {/* =====================================
          DELIVERY ADDRESS
      ===================================== */}

      <div className="checkout-card">

        <div className="checkout-card-header">

          <div>
            <h2>
              Delivery Address
            </h2>

            <p>
              Select where you want the
              service to be provided.
            </p>
          </div>

          <button
            type="button"
            className="manage-address-btn"
            onClick={
              handleManageAddresses
            }
          >
            Manage Addresses
          </button>

        </div>

        {addresses.length === 0 ? (

          <div className="no-address">

            <p>
              You don't have any saved
              addresses yet.
            </p>

            <button
              type="button"
              onClick={
                handleManageAddresses
              }
            >
              + Add New Address
            </button>

          </div>

        ) : (

          <div className="checkout-address-list">

            {addresses.map(
              (address) => {

                const isSelected =
                  selectedAddress?.id ===
                  address.id;

                return (
                  <div
                    key={address.id}
                    className={
                      isSelected
                        ? "checkout-address selected"
                        : "checkout-address"
                    }
                    onClick={() =>
                      handleSelectAddress(
                        address
                      )
                    }
                  >

                    <div className="address-select">

                      <input
                        type="radio"
                        name="checkout-address"
                        checked={
                          isSelected
                        }
                        onChange={() =>
                          handleSelectAddress(
                            address
                          )
                        }
                      />

                    </div>

                    <div className="address-details">

                      <div className="address-title-row">

                        <strong>
                          {address.fullName}
                        </strong>

                        <span className="address-type">
                          {address.addressType}
                        </span>

                        {Number(
                          address.isDefault
                        ) === 1 && (
                          <span className="default-badge">
                            Default
                          </span>
                        )}

                      </div>

                      <p>
                        {address.houseNo},{" "}
                        {address.addressLine1}
                      </p>

                      {address.addressLine2 && (
                        <p>
                          {address.addressLine2}
                        </p>
                      )}

                      {address.landmark && (
                        <p>
                          Landmark:{" "}
                          {address.landmark}
                        </p>
                      )}

                      <p>
                        {address.city},{" "}
                        {address.state} -{" "}
                        {address.pincode}
                      </p>

                      <p>
                        {address.country}
                      </p>

                      <p>
                        Mobile:{" "}
                        {address.mobile}
                      </p>

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>

      {/* =====================================
          CART SUMMARY
      ===================================== */}

      <div className="checkout-card">

        <h2>
          Order Summary
        </h2>

        {cartItems.length === 0 ? (

          <div className="no-address">

            <p>
              Your cart is empty.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/services")
              }
            >
              Browse Services
            </button>

          </div>

        ) : (

          <div className="checkout-cart-list">

            {cartItems.map(
              (item) => {

                const price =
                  getPrice(item);

                const quantity =
                  Number(
                    item.quantity || 1
                  );

                const title =
                  item.title ||
                  item.service_title ||
                  item.service?.title ||
                  "Service";

                return (
                  <div
                    key={item.id}
                    className="checkout-cart-item"
                  >

                    <div>

                      <strong>
                        {title}
                      </strong>

                      <span>
                        ₹{price} × {quantity}
                      </span>

                    </div>

                    <strong>
                      ₹{price * quantity}
                    </strong>

                  </div>
                );
              }
            )}

          </div>
        )}

        {/* TOTAL */}

        {cartItems.length > 0 && (
          <div className="checkout-total">

            <span>
              Total
            </span>

            <strong>
              ₹{cartTotal}
            </strong>

          </div>
        )}

      </div>

      {/* =====================================
          SELECTED ADDRESS
      ===================================== */}

      {selectedAddress && (
        <div className="checkout-card">

          <h2>
            Selected Service Address
          </h2>

          <div className="selected-address-summary">

            <strong>
              {selectedAddress.fullName}
            </strong>

            <p>
              {selectedAddress.houseNo},{" "}
              {selectedAddress.addressLine1}
            </p>

            {selectedAddress.addressLine2 && (
              <p>
                {selectedAddress.addressLine2}
              </p>
            )}

            <p>
              {selectedAddress.city},{" "}
              {selectedAddress.state} -{" "}
              {selectedAddress.pincode}
            </p>

            <p>
              Mobile:{" "}
              {selectedAddress.mobile}
            </p>

          </div>

          <button
            type="button"
            className="place-order-btn"
            disabled={
              !selectedAddress ||
              cartItems.length === 0
            }
            onClick={
              handlePlaceOrder
            }
          >
            Continue to Place Order
          </button>

        </div>
      )}

    </div>
  );
}