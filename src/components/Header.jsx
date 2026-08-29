import React, { useState, useEffect, useRef } from "react";
import { apiFetch } from "../services/api";

export default function Header({ theme: t, activeMenu, darkMode, setDarkMode, setToken }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch profile on load so we can display the actual user name in the header
  useEffect(() => {
    async function loadHeaderProfile() {
      try {
        const data = await apiFetch("/api/v1/auth/me");
        if (data) setProfileData(data);
      } catch (err) {
        console.error("Could not load header profile", err);
      }
    }
    loadHeaderProfile();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFetchProfile = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/v1/auth/me");
      setProfileData(data);
      setShowProfileModal(true);
    } catch (err) {
      alert("Failed to load user profile: " + (err.message || err));
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "15px" }}>
      <div>
        <p style={{ color: t.textMuted, margin: 0 }}>AIIA / Research Management</p>
        <h1 style={{ margin: "8px 0 0", color: t.text }}>{activeMenu}</h1>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <button
          onClick={() => setDarkMode((d) => !d)}
          aria-label="Toggle dark mode"
          style={{
            padding: "10px 15px",
            border: `1px solid ${t.border}`,
            background: t.panelBg,
            color: t.text,
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
          }}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        <button
          onClick={() => alert("Notifications clicked!")}
          style={{ padding: "10px 15px", border: `1px solid ${t.border}`, background: t.panelBg, color: t.text, borderRadius: "8px", cursor: "pointer" }}
        >
          🔔
        </button>

        {/* Profile Dropdown Container */}
        <div style={{ position: "relative" }} ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: t.panelBg,
              border: `1px solid ${t.border}`,
              color: t.text,
              padding: "10px 15px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>{profileData?.name || profileData?.username || "Dr. Researcher"}</span>
            <span style={{ fontSize: "10px" }}>▼</span>
          </button>

          {isOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                marginTop: "8px",
                width: "160px",
                background: t.panelBg,
                border: `1px solid ${t.border}`,
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                zIndex: 100,
                overflow: "hidden",
              }}
            >
              <button
                onClick={handleFetchProfile}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "transparent",
                  border: "none",
                  textAlign: "left",
                  color: t.text,
                  cursor: "pointer",
                  fontSize: "13px",
                  borderBottom: `1px solid ${t.border}`,
                }}
              >
                {loading ? "Loading..." : "My Profile"}
              </button>
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "transparent",
                  border: "none",
                  textAlign: "left",
                  color: "#ef4444",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && profileData && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: t.panelBg, padding: "24px", borderRadius: "12px", width: "380px", border: `1px solid ${t.border}`, color: t.text }}>
            <h3 style={{ marginTop: 0 }}>User Profile</h3>
            <p style={{ margin: "8px 0" }}><strong>ID:</strong> {profileData.user_id || profileData.id || "N/A"}</p>
            <p style={{ margin: "8px 0" }}><strong>Name:</strong> {profileData.name || profileData.username || "N/A"}</p>
            <p style={{ margin: "8px 0" }}><strong>Email:</strong> {profileData.email || "Not specified"}</p>
            <p style={{ margin: "8px 0" }}><strong>Role:</strong> {profileData.role || "N/A"}</p>
            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <button onClick={() => setShowProfileModal(false)} style={{ padding: "8px 16px", background: t.accent, color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}