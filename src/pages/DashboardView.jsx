import React, { useEffect, useState } from "react";
import KpiCard from "../components/KpiCard";
import { apiFetch } from "../services/api";

export default function DashboardView({ theme: t, darkMode, trials, setShowTrialForm, panelStyle }) {
  const [kpis, setKpis] = useState({
    total_patients_enrolled: 0,
    active_interventions: 0,
    total_adverse_events: 0,
    serious_adverse_events: 0,
    ctri_compliance_rate: 96,
  });
  const [loadingKpis, setLoadingKpis] = useState(true);

  useEffect(() => {
    async function loadDashboardKpis() {
      try {
        const data = await apiFetch("/api/v1/dashboard/kpis");
        if (data) {
          setKpis(data);
        }
      } catch (err) {
        console.error("Failed to load live KPIs:", err);
      } finally {
        setLoadingKpis(false);
      }
    }
    loadDashboardKpis();
  }, []);

  return (
    <>
      <div style={{ ...panelStyle, marginBottom: "25px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
        <div>
          <p style={{ color: t.accent, fontWeight: "bold" }}>AYURVEDA RESEARCH PORTFOLIO</p>
          <h2 style={{ color: t.text }}>Good afternoon, Research Team 👋</h2>
          <p style={{ color: t.textMuted }}>Here's your current overview of clinical research activities across AIIA.</p>
        </div>
        <button onClick={() => setShowTrialForm(true)} style={{ padding: "14px 20px", background: t.accent, color: darkMode ? "#0f1216" : "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", whiteSpace: "nowrap" }}>
          + New Clinical Trial
        </button>
      </div>

      {/* KPI Cards section with live database values */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "25px" }}>
        <KpiCard 
          theme={t} 
          title="Active Trials" 
          value={loadingKpis ? "..." : `${kpis.active_interventions || trials.length}`} 
          subtitle="Currently running" 
        />
        <KpiCard 
          theme={t} 
          title="Total Participants" 
          value={loadingKpis ? "..." : `${kpis.total_patients_enrolled}`} 
          subtitle="Across all trials" 
        />
        <KpiCard 
          theme={t} 
          title="Research Sites" 
          value="18" 
          subtitle="Across India" 
        />
        <KpiCard 
          theme={t} 
          title="GCP Compliance" 
          value={loadingKpis ? "..." : `${kpis.ctri_compliance_rate}%`} 
          subtitle="CTRI audit compliant" 
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px", alignItems: "start" }}>
        {/* Dynamic Clinical Trial Portfolio */}
        <div style={panelStyle}>
          <h2 style={{ color: t.text }}>Clinical Trial Portfolio</h2>
          <p style={{ color: t.textMuted }}>Current research activities</p>

          {trials && trials.length > 0 ? (
            trials.slice(0, 3).map((item, idx) => (
              <TrialItem 
                key={item.id || idx} 
                theme={t} 
                id={item.trial_id || item.id || `AYU-2026-00${idx + 1}`} 
                name={item.trial_title || item.title || item.name} 
                status={item.status || "Recruiting"} 
              />
            ))
          ) : (
            <>
              <TrialItem theme={t} id="AYU-2026-001" name="Ashwagandha Efficacy Study" status="Recruiting" />
              <TrialItem theme={t} id="AYU-2026-002" name="Turmeric Clinical Study" status="Active" />
              <TrialItem theme={t} id="AYU-2026-003" name="Neem Formulation Trial" status="Under Review" />
            </>
          )}
        </div>

        {/* Dynamic Compliance Overview */}
        <div style={panelStyle}>
          <h2 style={{ color: t.text }}>Compliance Overview</h2>
          <p style={{ color: t.text }}><strong>GCP Compliance</strong></p>
          <div style={{ background: t.trackBg, height: "10px", borderRadius: "10px" }}>
            <div style={{ width: `${kpis.ctri_compliance_rate || 96}%`, height: "100%", background: t.accent, borderRadius: "10px" }} />
          </div>
          <p style={{ color: t.textMuted }}>{kpis.ctri_compliance_rate || 96}% compliant</p>

          <p style={{ color: t.text }}><strong>CTRI Registrations</strong></p>
          <div style={{ background: t.trackBg, height: "10px", borderRadius: "10px" }}>
            <div style={{ width: "100%", height: "100%", background: t.accent, borderRadius: "10px" }} />
          </div>
          <p style={{ color: t.textMuted }}>{trials.length} of {trials.length} trials registered</p>
        </div>
      </div>
    </>
  );
}

function TrialItem({ theme: t, id, name, status }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 0", borderBottom: `1px solid ${t.tableRowBorder}`, gap: "10px" }}>
      <div>
        <strong style={{ color: t.text }}>{id}</strong><br />
        <span style={{ color: t.textMuted }}>{name}</span>
      </div>
      <span style={{ color: t.text, whiteSpace: "nowrap" }}>{status}</span>
    </div>
  );
}