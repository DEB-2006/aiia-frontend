import React, { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

export default function EthicsRegulatoryView({
  theme: t,
  panelStyle,
  thStyle,
  tdStyle,
}) {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    protocol_number: "AIIA-IEC-2026-TR-05",
    committee_name: "Institutional Ethics Committee (IEC), AIIA",
    regulatory_body: "CTRI / CDSCO",
    approval_status: "Approved",
    submission_date: "2026-08-29",
    valid_until: "2027-08-28",
  });

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/api/v1/ethics/");
      if (Array.isArray(data)) {
        setApprovals(data);
      }
    } catch (err) {
      console.error("Failed to load ethics approvals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiFetch("/api/v1/ethics/", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      alert("Ethics clearance added successfully!");
      setShowModal(false);
      fetchApprovals();
    } catch (err) {
      alert("Failed to save record: " + (err.message || "Unknown error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ ...panelStyle, overflowX: "auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h2 style={{ color: t.text, margin: 0 }}>Ethics & Regulatory Approvals</h2>
          <p style={{ color: t.textMuted, margin: "4px 0 0 0" }}>
            Track Institutional Ethics Committee (IEC) clearances and CDSCO/CTRI filings
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            backgroundColor: t.accent || "#16834b",
            color: "#ffffff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          + Add Approval
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>Protocol Number</th>
            <th style={thStyle}>Ethics Committee / Board</th>
            <th style={thStyle}>Regulatory Body</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Submission Date</th>
            <th style={thStyle}>Valid Until</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" style={{ ...tdStyle, color: t.textMuted }}>
                Loading ethics approvals...
              </td>
            </tr>
          ) : approvals.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ ...tdStyle, textAlign: "center", color: t.textMuted }}>
                No ethics records found.
              </td>
            </tr>
          ) : (
            approvals.map((item) => (
              <tr key={item.id || item.protocol_number}>
                <td style={{ ...tdStyle, fontWeight: "600" }}>{item.protocol_number}</td>
                <td style={tdStyle}>{item.committee_name}</td>
                <td style={tdStyle}>{item.regulatory_body}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "600",
                      backgroundColor:
                        item.approval_status === "Approved" ? "#d1fae5" : "#fef3c7",
                      color:
                        item.approval_status === "Approved" ? "#065f46" : "#92400e",
                    }}
                  >
                    {item.approval_status}
                  </span>
                </td>
                <td style={tdStyle}>{item.submission_date}</td>
                <td style={{ ...tdStyle, color: t.textMuted, fontSize: "12px" }}>
                  {item.valid_until}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: t.panelBg || "#ffffff", padding: "24px", borderRadius: "12px", width: "420px", border: `1px solid ${t.border || "#e2e8f0"}` }}>
            <h3 style={{ marginTop: 0, color: t.text }}>Add Ethics Clearance</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: t.text }}>Protocol Number</label>
                <input type="text" required value={formData.protocol_number} onChange={(e) => setFormData({ ...formData, protocol_number: e.target.value })} style={{ width: "100%", padding: "8px", boxSizing: "border-box", borderRadius: "6px", border: `1px solid ${t.inputBorder || "#ccc"}` }} />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: t.text }}>Committee Name</label>
                <input type="text" required value={formData.committee_name} onChange={(e) => setFormData({ ...formData, committee_name: e.target.value })} style={{ width: "100%", padding: "8px", boxSizing: "border-box", borderRadius: "6px", border: `1px solid ${t.inputBorder || "#ccc"}` }} />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: t.text }}>Regulatory Body</label>
                <input type="text" required value={formData.regulatory_body} onChange={(e) => setFormData({ ...formData, regulatory_body: e.target.value })} style={{ width: "100%", padding: "8px", boxSizing: "border-box", borderRadius: "6px", border: `1px solid ${t.inputBorder || "#ccc"}` }} />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: t.text }}>Status</label>
                <select value={formData.approval_status} onChange={(e) => setFormData({ ...formData, approval_status: e.target.value })} style={{ width: "100%", padding: "8px", boxSizing: "border-box", borderRadius: "6px", border: `1px solid ${t.inputBorder || "#ccc"}` }}>
                  <option value="Approved">Approved</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: "8px 16px", background: "transparent", border: `1px solid ${t.border || "#ccc"}`, color: t.text, borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ padding: "8px 16px", background: t.accent, color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>{submitting ? "Saving..." : "Save Record"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}