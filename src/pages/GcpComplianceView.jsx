import React, { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

export default function GcpComplianceView({
  theme: t,
  panelStyle,
  thStyle,
  tdStyle,
}) {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/api/v1/safety/adverse-events");
      if (Array.isArray(data)) {
        setAuditLogs(data);
      }
    } catch (err) {
      console.error("Failed to load compliance logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  return (
    <div style={{ ...panelStyle, overflowX: "auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h2 style={{ color: t.text, margin: 0 }}>GCP Compliance & Audit Trail</h2>
          <p style={{ color: t.textMuted, margin: "4px 0 0 0" }}>
            Immutable GCP-compliant safety audit logs from Neon DB
          </p>
        </div>
        <button
          onClick={fetchAuditLogs}
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
          🔄 Refresh Logs
        </button>
      </div>

      {/* Audit Trail Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>Log ID</th>
            <th style={thStyle}>Action / Severity Type</th>
            <th style={thStyle}>Trial / Patient ID</th>
            <th style={thStyle}>Event Term</th>
            <th style={thStyle}>Reported By</th>
            <th style={thStyle}>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" style={{ ...tdStyle, color: t.textMuted }}>
                Loading GCP compliance logs...
              </td>
            </tr>
          ) : auditLogs.length === 0 ? (
            <tr>
              <td
                colSpan="6"
                style={{
                  ...tdStyle,
                  textAlign: "center",
                  color: t.textMuted,
                }}
              >
                No audit trail logs recorded yet.
              </td>
            </tr>
          ) : (
            auditLogs.map((log) => (
              <tr key={log.log_id}>
                <td style={tdStyle}>{log.log_id}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "600",
                      backgroundColor:
                        log.severity_type?.includes("SERIOUS")
                          ? "#fee2e2"
                          : "#d1fae5",
                      color:
                        log.severity_type?.includes("SERIOUS")
                          ? "#991b1b"
                          : "#065f46",
                    }}
                  >
                    {log.severity_type}
                  </span>
                </td>
                <td style={tdStyle}>
                  Patient: {log.patient_id} (Trial {log.trial_id})
                </td>
                <td style={tdStyle}>{log.event_term}</td>
                <td style={tdStyle}>User ID: {log.reported_by}</td>
                <td style={{ ...tdStyle, fontSize: "12px", color: t.textMuted }}>
                  {log.timestamp ? new Date(log.timestamp).toLocaleString() : "N/A"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}