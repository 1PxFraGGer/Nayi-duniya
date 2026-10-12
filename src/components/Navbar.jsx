import { useState, useEffect, useRef } from "react";
import { Link, useLocation as useRouterLocation } from "react-router-dom";

import { useLocation } from "../context/LocationContext";
import { useAuth } from "../context/AuthContext";

import "./navbar.css";

export default function Navbar() {
  const { city, setCity } = useLocation();
  const { user, logout } = useAuth();

  const routerLocation = useRouterLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const profileRef = useRef(null);

  const cities = [
    "Jaipur",
    "Delhi",
    "Mumbai",
    "Bangalore",
  ];

  /* =========================================================
     WISHLIST COUNT
  ========================================================= */

  useEffect(() => {
    const updateWishlist = () => {
      if (!user) {
        setWishlistCount(0);
        return;
      }

      const key = `wishlist_${user.email}`;

      try {
        const stored =
          JSON.parse(localStorage.getItem(key)) || [];

        setWishlistCount(stored.length);
      } catch {
        setWishlistCount(0);
      }
    };

    updateWishlist();

    window.addEventListener(
      "wishlistUpdated",
      updateWishlist
    );

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        updateWishlist
      );
    };
  }, [user]);

  /* =========================================================
     CART COUNT
  ========================================================= */

  useEffect(() => {
    const updateCart = () => {
      if (!user) {
        setCartCount(0);
        return;
      }

      const key = `cart_${user.email}`;

      try {
        const stored =
          JSON.parse(localStorage.getItem(key)) || [];

        const totalItems = stored.reduce(
          (sum, item) =>
            sum + Number(item.quantity || 0),
          0
        );

        setCartCount(totalItems);
      } catch {
        setCartCount(0);
      }
    };

    updateCart();

    window.addEventListener(
      "cartUpdated",
      updateCart
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        updateCart
      );
    };
  }, [user]);

  /* =========================================================
     CLOSE PROFILE OUTSIDE CLICK
  ========================================================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =========================================================
     CLOSE MENU ON ROUTE CHANGE
  ========================================================= */

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [routerLocation.pathname]);

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");

      await logout();
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }

    setProfileOpen(false);
    setMenuOpen(false);
  };

  /* =========================================================
     MOBILE NAVIGATION
  ========================================================= */

  const closeMobileMenu = () => {
    setMenuOpen(false);
    setProfileOpen(false);
  };

  /* =========================================================
     USER INITIAL
  ========================================================= */

  const userInitial =
    (user?.name || "U")
      .charAt(0)
      .toUpperCase();

  return (
    <nav className="nb-nav">

      <div className="nb-container">

        {/* =====================================================
            LOGO
        ===================================================== */}

        <Link
          to="/"
          className="nb-logo"
          onClick={closeMobileMenu}
        >
          <span className="nb-logo-icon">
            S
          </span>

          <span className="nb-logo-text">
            ServiceHub
          </span>
        </Link>


        {/* =====================================================
            DESKTOP NAVIGATION
        ===================================================== */}

        <div className="nb-links">


          {/* CITY */}

          <div className="nb-city-wrap">

            <svg
              className="nb-city-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />

              <circle
                cx="12"
                cy="10"
                r="3"
              />
            </svg>

            <select
              value={city || ""}
              onChange={(e) =>
                setCity(e.target.value)
              }
              className="nb-city-select"
            >
              {cities.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>

          </div>


          {/* ABOUT */}

          <Link
            to="/about"
            className="nb-link"
          >
            About
          </Link>


          {/* SERVICES */}

          <Link
            to="/services"
            className="nb-link"
          >
            Services
          </Link>


          {/* ===================================================
              CART
          =================================================== */}

          {user && (
            <Link
              to="/cart"
              className="nb-icon-btn"
              aria-label="Cart"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle
                  cx="9"
                  cy="21"
                  r="1"
                />

                <circle
                  cx="20"
                  cy="21"
                  r="1"
                />

                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>

              {cartCount > 0 && (
                <span className="nb-badge">
                  {cartCount}
                </span>
              )}
            </Link>
          )}


          {/* ===================================================
              PROFILE
          =================================================== */}

          {user && (
            <div
              className="nb-profile-wrap"
              ref={profileRef}
            >

              <button
                type="button"
                className={`nb-profile-btn ${
                  profileOpen
                    ? "nb-profile-btn--open"
                    : ""
                }`}
                onClick={() =>
                  setProfileOpen(
                    (prev) => !prev
                  )
                }
                aria-label="Profile menu"
              >
                {userInitial}

                <span className="nb-profile-arrow">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </button>


              {/* PROFILE DROPDOWN */}

              {profileOpen && (
                <div className="nb-dropdown">

                  {/* HEADER */}

                  <div className="nb-drop-header">

                    <div className="nb-drop-avatar">
                      {userInitial}
                    </div>

                    <div className="nb-drop-info">

                      <span className="nb-drop-sub">
                        Signed in as
                      </span>

                      <strong className="nb-drop-name">
                        {user.name ||
                          "Customer"}
                      </strong>

                      {user.email && (
                        <span className="nb-drop-email">
                          {user.email}
                        </span>
                      )}

                    </div>

                  </div>


                  {/* MENU */}

                  <div className="nb-drop-menu">

                    <Link
                      to="/account/profile"
                      className="nb-drop-item"
                      onClick={() =>
                        setProfileOpen(false)
                      }
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />

                        <circle
                          cx="12"
                          cy="7"
                          r="4"
                        />
                      </svg>

                      <span>
                        Profile Details
                      </span>
                    </Link>


                    <Link
                      to="/wishlist"
                      className="nb-drop-item"
                      onClick={() =>
                        setProfileOpen(false)
                      }
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>

                      <span>
                        Wishlist
                      </span>

                      {wishlistCount > 0 && (
                        <span className="nb-drop-count">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>


                    <Link
                      to="/my-bookings"
                      className="nb-drop-item"
                      onClick={() =>
                        setProfileOpen(false)
                      }
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect
                          x="1"
                          y="3"
                          width="15"
                          height="13"
                          rx="2"
                        />

                        <path d="M16 8h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1l-3 3v-3H9a2 2 0 0 1-2-2v-1" />
                      </svg>

                      <span>
                        My Bookings
                      </span>
                    </Link>

                  </div>


                  <div className="nb-drop-divider" />


                  {/* LOGOUT */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="nb-logout-btn"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />

                      <polyline points="16 17 21 12 16 7" />

                      <line
                        x1="21"
                        y1="12"
                        x2="9"
                        y2="12"
                      />
                    </svg>

                    Logout
                  </button>

                </div>
              )}

            </div>
          )}


          {/* ===================================================
              LOGIN / REGISTER
          =================================================== */}

          {!user && (
            <div className="nb-auth">

              <Link
                to="/login"
                className="nb-link"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="nb-register"
              >
                Register
              </Link>

            </div>
          )}

        </div>


        {/* =====================================================
            MOBILE HAMBURGER
        ===================================================== */}

        <button
          type="button"
          className={`nb-hamburger ${
            menuOpen
              ? "nb-hamburger--open"
              : ""
          }`}
          onClick={() =>
            setMenuOpen(
              (prev) => !prev
            )
          }
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

      </div>


      {/* =======================================================
          MOBILE MENU
      ======================================================= */}

      {menuOpen && (
        <div className="nb-mobile">

          {/* CITY */}

          <div className="nb-mobile-city">

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />

              <circle
                cx="12"
                cy="10"
                r="3"
              />
            </svg>

            <select
              value={city || ""}
              onChange={(e) =>
                setCity(e.target.value)
              }
              className="nb-city-select"
            >
              {cities.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>

          </div>


          {/* HOME */}

          <Link
            to="/"
            className="nb-mobile-link"
            onClick={closeMobileMenu}
          >
            Home
          </Link>


          {/* ABOUT */}

          <Link
            to="/about"
            className="nb-mobile-link"
            onClick={closeMobileMenu}
          >
            About
          </Link>


          {/* SERVICES */}

          <Link
            to="/services"
            className="nb-mobile-link"
            onClick={closeMobileMenu}
          >
            Services
          </Link>


          {user && (
            <>

              <Link
                to="/cart"
                className="nb-mobile-link"
                onClick={closeMobileMenu}
              >
                <span>Cart</span>

                {cartCount > 0 && (
                  <span className="nb-mobile-count">
                    {cartCount}
                  </span>
                )}
              </Link>


              <Link
                to="/account/profile"
                className="nb-mobile-link"
                onClick={closeMobileMenu}
              >
                Profile Details
              </Link>


              <Link
                to="/wishlist"
                className="nb-mobile-link"
                onClick={closeMobileMenu}
              >
                <span>Wishlist</span>

                {wishlistCount > 0 && (
                  <span className="nb-mobile-count">
                    {wishlistCount}
                  </span>
                )}
              </Link>


              <Link
                to="/bookings"
                className="nb-mobile-link"
                onClick={closeMobileMenu}
              >
                My Bookings
              </Link>


              <button
                type="button"
                onClick={handleLogout}
                className="nb-mobile-logout"
              >
                Logout
              </button>

            </>
          )}


          {!user && (
            <div className="nb-mobile-auth">

              <Link
                to="/login"
                className="nb-mobile-link"
                onClick={closeMobileMenu}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="nb-mobile-register"
                onClick={closeMobileMenu}
              >
                Register
              </Link>

            </div>
          )}

        </div>
      )}

    </nav>
  );
}