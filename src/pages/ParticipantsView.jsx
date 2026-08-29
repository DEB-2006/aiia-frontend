import React, { useState } from "react";
import { apiFetch } from "../services/api";

export default function ParticipantsView({
  theme: t,
  patients,
  loading,
  panelStyle,
  thStyle,
  tdStyle,
  refreshData,
}) {
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    ctri_number: "CTRI/2026/07/009876",
    subject_identifier: "",
    age: 25,
    gender: "Female",
    prakriti_baseline: "Vata",
    consent_status: "Obtained",
    consent_date: new Date().toISOString(),
  });

  const handleEnroll = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiFetch("/api/v1/patients/enroll", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          age: Number(formData.age),
        }),
      });
      alert("Participant enrolled successfully!");
      setShowModal(false);
      setFormData((prev) => ({ ...prev, subject_identifier: "" }));
      if (refreshData) {
        refreshData();
      } else {
        window.location.reload();
      }
    } catch (err) {
      alert("Enrollment failed: " + (err.message || "Unknown error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ ...panelStyle, overflowX: "auto" }}>
      {/* Header section with Enroll Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div>
          <h2 style={{ color: t.text, margin: 0 }}>Participants Directory</h2>
          <p style={{ color: t.textMuted, margin: "4px 0 0 0" }}>
            Live participant data from Neon DB
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            backgroundColor: t.accent || "#10b981",
            color: "#ffffff",
            border: "none",
            padding: "9px 16px",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          + Enroll Patient
        </button>
      </div>

      {/* Main Table */}
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "12px" }}
      >
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Name / Subject ID</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Trial ID</th>
          </tr>
        </thead>
        <tbody>
          {patients && patients.length > 0 ? (
            patients.map((p, idx) => (
              <tr key={p.id || idx}>
                <td style={tdStyle}>{p.id}</td>
                <td style={tdStyle}>{p.name || `Subject ${p.id}`}</td>
                <td style={tdStyle}>{p.status || "Enrolled"}</td>
                <td style={tdStyle}>{p.trial_id || "AYU-2026-001"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={tdStyle}>
                {loading
                  ? "Loading participants from backend..."
                  : "No participant records found."}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Enroll Patient Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: t.overlay || "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: t.panelBg || "#ffffff",
              padding: "24px",
              borderRadius: "12px",
              width: "400px",
              border: `1px solid ${t.border || "#e2e8f0"}`,
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ marginTop: 0, color: t.text }}>
              Enroll New Patient
            </h3>
            <form onSubmit={handleEnroll}>
              <div style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "500",
                    marginBottom: "4px",
                    color: t.text,
                  }}
                >
                  CTRI Registration Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.ctri_number}
                  onChange={(e) =>
                    setFormData({ ...formData, ctri_number: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: `1px solid ${t.border || "#e2e8f0"}`,
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "500",
                    marginBottom: "4px",
                    color: t.text,
                  }}
                >
                  Subject Identifier (e.g. AIIA-CT-2026-002)
                </label>
                <input
                  type="text"
                  required
                  placeholder="AIIA-CT-2026-002"
                  value={formData.subject_identifier}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subject_identifier: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: `1px solid ${t.border || "#e2e8f0"}`,
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  marginBottom: "12px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "500",
                      marginBottom: "4px",
                      color: t.text,
                    }}
                  >
                    Age
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: `1px solid ${t.border || "#e2e8f0"}`,
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "500",
                      marginBottom: "4px",
                      color: t.text,
                    }}
                  >
                    Prakriti Baseline
                  </label>
                  <select
                    value={formData.prakriti_baseline}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        prakriti_baseline: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: `1px solid ${t.border || "#e2e8f0"}`,
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="Vata">Vata</option>
                    <option value="Pitta">Pitta</option>
                    <option value="Kapha">Kapha</option>
                  </select>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "16px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: `1px solid ${t.border || "#e2e8f0"}`,
                    backgroundColor: "transparent",
                    color: t.text,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: t.accent || "#10b981",
                    color: "#ffffff",
                    fontWeight: "600",
                    cursor: submitting ? "not-allowed" : "pointer",
                  }}
                >
                  {submitting ? "Enrolling..." : "Enroll Patient"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}