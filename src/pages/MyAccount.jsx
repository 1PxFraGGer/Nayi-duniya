import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import "./MyAddresses.css";

export default function MyAccount() {
  const navigate = useNavigate();
  const location = useLocation();

  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const isProfile =
    location.pathname === "/account" ||
    location.pathname === "/account/profile";

  const isAddresses =
    location.pathname.startsWith("/account/addresses");

  return (
    <div className="my-account">

      {/* ACCOUNT NAVIGATION */}
      <nav className="my-account-nav">

        <Link
          to="/account/profile"
          className={
            isProfile
              ? "my-account-nav-link active"
              : "my-account-nav-link"
          }
        >
          👤 My Account
        </Link>

        <Link
          to="/account/addresses"
          className={
            isAddresses
              ? "my-account-nav-link active"
              : "my-account-nav-link"
          }
        >
          📍 My Addresses
        </Link>

        <button
          type="button"
          className="my-account-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </nav>

      {/* CHILD PAGE */}
      <div className="my-account-content">
        <Outlet />
      </div>

    </div>
  );
}
