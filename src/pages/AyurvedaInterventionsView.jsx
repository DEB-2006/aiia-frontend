import React, { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

export default function AyurvedaInterventionsView({
  theme: t,
  panelStyle,
  thStyle,
  tdStyle,
}) {
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    patient_id: 1,
    formulation_name: "Ashwagandha Choorna",
    dosage_form: "Choorna (Powder)",
    dose_quantity: "3 grams",
    frequency: "Twice daily after meals",
    anupana: "Warm Milk / Luke-warm Water",
    batch_number: "AY-2026-B882",
    start_date: new Date().toISOString(),
    duration_days: 7,
    compliance_percentage: 100,
  });

  const fetchInterventions = async () => {
    try {
      setLoading(true);
      let data = [];
      try {
        data = await apiFetch("/api/v1/interventions/");
      } catch {
        data = await apiFetch("/api/v1/interventions");
      }
      if (Array.isArray(data)) {
        setInterventions(data);
      }
    } catch (err) {
      console.error("Failed to load interventions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterventions();
  }, []);

  const handleLogIntervention = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiFetch("/api/v1/interventions/log", {
        method: "POST",
        body: JSON.stringify({
          patient_id: Number(formData.patient_id),
          formulation_name: formData.formulation_name,
          dosage_form: formData.dosage_form,
          dose_quantity: formData.dose_quantity,
          frequency: formData.frequency,
          anupana: formData.anupana,
          batch_number: formData.batch_number,
          start_date: new Date().toISOString(),
          duration_days: Number(formData.duration_days),
          compliance_percentage: Number(formData.compliance_percentage),
        }),
      });

      alert("Ayurveda intervention logged successfully!");
      setShowModal(false);
      fetchInterventions();
    } catch (err) {
      alert("Failed to log intervention: " + (err.message || "Unknown error"));
    } finally {
      setSubmitting(false);
    }
  };

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
          <h2 style={{ color: t.text, margin: 0 }}>Ayurveda Interventions & Drug Tracking</h2>
          <p style={{ color: t.textMuted, margin: "4px 0 0 0" }}>
            Track traditional herbal formulations, anupana, batch numbers, and dosages
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            backgroundColor: t.accent || "#16834b",
            color: "#ffffff",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          + Log Intervention
        </button>
      </div>

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Patient ID</th>
            <th style={thStyle}>Formulation Name</th>
            <th style={thStyle}>Dosage & Anupana</th>
            <th style={thStyle}>Batch Number</th>
            <th style={thStyle}>Compliance</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" style={{ ...tdStyle, color: t.textMuted }}>
                Loading intervention records...
              </td>
            </tr>
          ) : interventions.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ ...tdStyle, textAlign: "center", color: t.textMuted }}>
                No ayurveda interventions logged yet.
              </td>
            </tr>
          ) : (
            interventions.map((item, idx) => {
              const displayId = item.id || item.log_id || idx + 1;
              const displayPatient = item.patient_id ? `Patient: ${item.patient_id}` : "N/A";
              const displayFormulation = item.formulation_name || item.formulation || item.intervention_name || item.drug_name || "Ashwagandha Choorna";
              const displayDose = item.dose_quantity || item.dosage || item.dose || "3g";
              const displayAnupana = item.anupana || item.carrier || "Warm Water";
              const displayBatch = item.batch_number || item.batch || "AY-2026-B882";
              const displayCompliance = item.compliance_percentage ?? item.compliance ?? 100;

              return (
                <tr key={displayId}>
                  <td style={tdStyle}>{displayId}</td>
                  <td style={tdStyle}>{displayPatient}</td>
                  <td style={{ ...tdStyle, fontWeight: "600" }}>{displayFormulation}</td>
                  <td style={tdStyle}>
                    {displayDose} ({displayAnupana})
                  </td>
                  <td style={tdStyle}>
                    <span style={{ background: t.accentBg || "#e8f5ee", color: t.accent, padding: "3px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "600" }}>
                      {displayBatch}
                    </span>
                  </td>
                  <td style={tdStyle}>{displayCompliance}%</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: t.panelBg || "#ffffff", padding: "24px", borderRadius: "12px", width: "450px", border: `1px solid ${t.border || "#e2e8f0"}` }}>
            <h3 style={{ marginTop: 0, color: t.text }}>Log Traditional Intervention</h3>
            <form onSubmit={handleLogIntervention}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: t.text }}>Patient Numeric ID</label>
                <input type="number" required value={formData.patient_id} onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })} style={{ width: "100%", padding: "8px", boxSizing: "border-box", borderRadius: "6px", border: `1px solid ${t.inputBorder || "#ccc"}` }} />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: t.text }}>Formulation Name</label>
                <input type="text" required value={formData.formulation_name} onChange={(e) => setFormData({ ...formData, formulation_name: e.target.value })} style={{ width: "100%", padding: "8px", boxSizing: "border-box", borderRadius: "6px", border: `1px solid ${t.inputBorder || "#ccc"}` }} />
              </div>
              <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: t.text }}>Dosage Form</label>
                  <input type="text" required value={formData.dosage_form} onChange={(e) => setFormData({ ...formData, dosage_form: e.target.value })} style={{ width: "100%", padding: "8px", boxSizing: "border-box", borderRadius: "6px", border: `1px solid ${t.inputBorder || "#ccc"}` }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: t.text }}>Dose Quantity</label>
                  <input type="text" required value={formData.dose_quantity} onChange={(e) => setFormData({ ...formData, dose_quantity: e.target.value })} style={{ width: "100%", padding: "8px", boxSizing: "border-box", borderRadius: "6px", border: `1px solid ${t.inputBorder || "#ccc"}` }} />
                </div>
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: t.text }}>Anupana (Carrier / Fluid)</label>
                <input type="text" required value={formData.anupana} onChange={(e) => setFormData({ ...formData, anupana: e.target.value })} style={{ width: "100%", padding: "8px", boxSizing: "border-box", borderRadius: "6px", border: `1px solid ${t.inputBorder || "#ccc"}` }} />
              </div>
              <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: t.text }}>Batch Number</label>
                  <input type="text" required value={formData.batch_number} onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })} style={{ width: "100%", padding: "8px", boxSizing: "border-box", borderRadius: "6px", border: `1px solid ${t.inputBorder || "#ccc"}` }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "13px", marginBottom: "4px", color: t.text }}>Duration (Days)</label>
                  <input type="number" required value={formData.duration_days} onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })} style={{ width: "100%", padding: "8px", boxSizing: "border-box", borderRadius: "6px", border: `1px solid ${t.inputBorder || "#ccc"}` }} />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: "8px 16px", background: "transparent", border: `1px solid ${t.border || "#ccc"}`, color: t.text, borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ padding: "8px 16px", background: t.accent, color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>{submitting ? "Saving..." : "Save Log"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}