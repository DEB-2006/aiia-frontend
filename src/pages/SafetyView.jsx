import React, { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

export default function SafetyView({
  theme: t,
  panelStyle,
  thStyle,
  tdStyle,
}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    patient_id: 1,
    event_term: "",
    onset_date: new Date().toISOString(),
    severity: "Mild",
    is_serious: false,
    causality: "Possible",
    action_taken: "Dose reduced by 50%",
    ctri_reported: false,
  });

  const fetchAdverseEvents = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/api/v1/safety/adverse-events");
      if (Array.isArray(data)) {
        setEvents(data);
      }
    } catch (err) {
      console.error("Failed to load adverse events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdverseEvents();
  }, []);

  const handleReportEvent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        patient_id: Number(formData.patient_id) || 1,
        event_term: formData.event_term,
        onset_date: new Date().toISOString(),
        severity: formData.severity,
        is_serious: Boolean(formData.is_serious),
        causality: formData.causality,
        action_taken: formData.action_taken,
        ctri_reported: Boolean(formData.ctri_reported),
      };

      await apiFetch("/api/v1/safety/adverse-event", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      alert("Adverse Event recorded successfully!");
      setShowModal(false);
      setFormData((prev) => ({ ...prev, event_term: "" }));
      fetchAdverseEvents();
    } catch (err) {
      alert("Failed to record event: " + (err.message || "Validation Error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ ...panelStyle, overflowX: "auto" }}>
      {/* Header Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h2 style={{ color: t.text, margin: 0 }}>Safety & Pharmacovigilance</h2>
          <p style={{ color: t.textMuted, margin: "4px 0 0 0" }}>
            Live adverse event logging & safety monitoring from Neon DB
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            backgroundColor: "#ef4444",
            color: "#ffffff",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          + Report Adverse Event
        </button>
      </div>

      {/* Events Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>Patient ID</th>
            <th style={thStyle}>Event Term</th>
            <th style={thStyle}>Causality</th>
            <th style={thStyle}>Severity</th>
            <th style={thStyle}>Type</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" style={{ ...tdStyle, color: t.textMuted }}>
                Loading adverse events...
              </td>
            </tr>
          ) : events.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                style={{
                  ...tdStyle,
                  textAlign: "center",
                  color: t.textMuted,
                }}
              >
                No adverse events recorded.
              </td>
            </tr>
          ) : (
            events.map((ev, idx) => (
              <tr key={ev.id || idx}>
                <td style={tdStyle}>{ev.patient_id || "1"}</td>
                <td style={tdStyle}>{ev.event_term || ev.event_description || ev.description}</td>
                <td style={tdStyle}>{ev.causality || "Possible"}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "600",
                      backgroundColor:
                        ev.severity === "Severe" ? "#fee2e2" : "#fef3c7",
                      color:
                        ev.severity === "Severe" ? "#991b1b" : "#92400e",
                    }}
                  >
                    {ev.severity || "Mild"}
                  </span>
                </td>
                <td style={tdStyle}>
                  {ev.is_serious ? (
                    <span
                      style={{
                        color: "#dc2626",
                        fontWeight: "bold",
                        fontSize: "12px",
                      }}
                    >
                      SAE ⚠️
                    </span>
                  ) : (
                    <span style={{ color: t.textMuted, fontSize: "12px" }}>
                      Standard AE
                    </span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Report Event Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
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
              width: "420px",
              border: `1px solid ${t.border || "#e2e8f0"}`,
            }}
          >
            <h3 style={{ marginTop: 0, color: t.text }}>Report Adverse Event</h3>
            <form onSubmit={handleReportEvent}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: t.text }}>
                  Patient Numeric ID (e.g. 1)
                </label>
                <input
                  type="number"
                  required
                  value={formData.patient_id}
                  onChange={(e) =>
                    setFormData({ ...formData, patient_id: e.target.value })
                  }
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box", borderRadius: "6px", border: `1px solid ${t.inputBorder || "#ccc"}` }}
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: t.text }}>
                  Event Term
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nausea after Kashaya administration"
                  value={formData.event_term}
                  onChange={(e) =>
                    setFormData({ ...formData, event_term: e.target.value })
                  }
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box", borderRadius: "6px", border: `1px solid ${t.inputBorder || "#ccc"}` }}
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: t.text }}>
                  Action Taken
                </label>
                <input
                  type="text"
                  required
                  value={formData.action_taken}
                  onChange={(e) =>
                    setFormData({ ...formData, action_taken: e.target.value })
                  }
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box", borderRadius: "6px", border: `1px solid ${t.inputBorder || "#ccc"}` }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: t.text }}>
                    Severity
                  </label>
                  <select
                    value={formData.severity}
                    onChange={(e) =>
                      setFormData({ ...formData, severity: e.target.value })
                    }
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: `1px solid ${t.inputBorder || "#ccc"}` }}
                  >
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                  </select>
                </div>
                <div style={{ flex: 1, display: "flex", alignItems: "center", paddingTop: "18px" }}>
                  <label style={{ fontSize: "13px", cursor: "pointer", color: t.text }}>
                    <input
                      type="checkbox"
                      checked={formData.is_serious}
                      onChange={(e) =>
                        setFormData({ ...formData, is_serious: e.target.checked })
                      }
                    />{" "}
                    Serious (SAE)
                  </label>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: "8px 16px", background: "transparent", border: `1px solid ${t.border || "#ccc"}`, color: t.text, borderRadius: "6px", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ padding: "8px 16px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: submitting ? "not-allowed" : "pointer" }}
                >
                  {submitting ? "Submitting..." : "Report Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}