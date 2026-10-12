import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { getImageUrl } from "../utils/imageUrl";
import "./profile.css";

export default function Profile() {
  const { user, setUser, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    image: "",
  });

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================================
  // LOAD PROFILE FROM AUTH CONTEXT
  // =========================================

  useEffect(() => {
    if (!user) return;

    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      city: user.city || "",
      image: user.image || "",
    });
  }, [user]);

  // =========================================
  // INPUT
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================
  // IMAGE PREVIEW
  // =========================================

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    setError("");

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  // =========================================
  // SAVE PROFILE
  // =========================================

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim(),
      };

      // Send image only when a new Base64 image was selected
      if (
        formData.image &&
        formData.image.startsWith("data:")
      ) {
        payload.image = formData.image;
      }

      const res = await API.put(
        "/auth/customer/profile",
        payload
      );

      const updatedProfile =
        res.data?.user ||
        res.data?.customer ||
        res.data;

      if (updatedProfile) {
        const finalProfile = {
          ...user,
          ...updatedProfile,
          name:
            updatedProfile.name ??
            formData.name,
          email:
            updatedProfile.email ??
            formData.email,
          phone:
            updatedProfile.phone ??
            formData.phone,
          city:
            updatedProfile.city ??
            formData.city,
          image:
            updatedProfile.image ??
            formData.image,
        };

        setUser(finalProfile);

        setFormData({
          name: finalProfile.name || "",
          email: finalProfile.email || "",
          phone: finalProfile.phone || "",
          city: finalProfile.city || "",
          image: finalProfile.image || "",
        });
      }

      setEditing(false);
      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error("Profile update error:", err);

      setError(
        err.response?.data?.msg ||
          err.response?.data?.error ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // CANCEL EDIT
  // =========================================

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        city: user.city || "",
        image: user.image || "",
      });
    }

    setMessage("");
    setError("");
    setEditing(false);
  };

  // =========================================
  // LOADING
  // =========================================

  if (authLoading) {
    return (
      <div className="profile-container">
        <div className="profile-box">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // =========================================
  // AUTH CHECK
  // =========================================

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-box">
          <p>Please login to view your account.</p>
        </div>
      </div>
    );
  }

  // =========================================
  // PROFILE IMAGE
  // =========================================

  const profileImage = formData.image
    ? formData.image.startsWith("data:")
      ? formData.image
      : getImageUrl(formData.image)
    : "/placeholder.jpg";

  // =========================================
  // UI
  // =========================================

  return (
    <div className="profile-container">
      <div className="profile-box">

        {/* HEADER */}
        <div className="profile-header">
          <div>
            <h2>My Account</h2>

            <p>
              Manage your personal information
            </p>
          </div>

          {!editing ? (
            <button
              type="button"
              className="btn-edit"
              onClick={() => {
                setMessage("");
                setError("");
                setEditing(true);
              }}
            >
              Edit Profile
            </button>
          ) : (
            <div className="profile-header-actions">

              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn-save"
                onClick={handleSave}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>
          )}
        </div>

        {/* MESSAGES */}

        {message && (
          <div className="success">
            {message}
          </div>
        )}

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {/* PROFILE IMAGE */}

        <div className="profile-image-section">
          <div className="avatar-wrapper">

            <img
              src={profileImage}
              alt="Profile"
              className="profile-image"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "/placeholder.jpg";
              }}
            />

            {editing && (
              <label className="upload-btn">
                Change Photo

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  hidden
                />
              </label>
            )}

          </div>
        </div>

        {/* FORM */}

        <div className="profile-grid">

          {/* NAME */}

          <div className="field">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              disabled={!editing}
              onChange={handleChange}
            />
          </div>

          {/* EMAIL */}

          <div className="field">
            <label>Email</label>

            <input
              type="email"
              value={formData.email}
              disabled
            />

            <small>
              Email cannot be changed.
            </small>
          </div>

          {/* PHONE */}

          <div className="field">
            <label>Phone</label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              disabled={!editing}
              onChange={handleChange}
            />
          </div>

          {/* CITY */}

          <div className="field">
            <label>City</label>

            <input
              type="text"
              name="city"
              value={formData.city}
              disabled={!editing}
              onChange={handleChange}
            />
          </div>

        </div>

      </div>
    </div>
  );
}
