import kpicard from "../components/kpicard";

export default function ClinicalTrialsView({ 
  theme: t, 
  darkMode, 
  trials = [], 
  kpis, 
  setShowTrialForm, 
  panelStyle, 
  inputStyle, 
  thStyle, 
  tdStyle 
}) {
  return (
    <>
      {/* Header Banner */}
      <div style={{ ...panelStyle, marginBottom: "25px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
        <div>
          <p style={{ color: t.accent }}>AIIA / Clinical Research</p>
          <h2 style={{ color: t.text }}>Clinical Trials</h2>
          <p style={{ color: t.textMuted }}>Manage Ayurveda clinical trials, participants, milestones and regulatory compliance.</p>
        </div>
        <button 
          onClick={() => setShowTrialForm(true)} 
          style={{ padding: "14px 20px", background: t.accent, color: darkMode ? "#0f1216" : "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", whiteSpace: "nowrap" }}
        >
          + New Clinical Trial
        </button>
      </div>

      {/* Analytics KPI Cards linked to backend */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "25px" }}>
        <kpicard 
          theme={t} 
          title="Active Trials" 
          value={kpis?.active_trials ?? (trials.length > 0 ? `${trials.length}` : "0")} 
          subtitle="Currently running" 
        />
        <kpicard 
          theme={t} 
          title="Total Participants" 
          value={kpis?.total_patients ?? kpis?.total_participants ?? "1,286"} 
          subtitle="Across all trials" 
        />
        <kpicard 
          theme={t} 
          title="Recruiting" 
          value={kpis?.recruiting_trials ?? "8"} 
          subtitle="Trials recruiting" 
        />
        <kpicard 
          theme={t} 
          title="Regulatory Due" 
          value={kpis?.regulatory_due ?? "3"} 
          subtitle="Require attention" 
        />
      </div>

      {/* Filters */}
      <div style={{ ...panelStyle, padding: "20px", marginBottom: "20px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "15px" }}>
        <input placeholder="Search trials..." style={inputStyle} />
        <select style={inputStyle}>
          <option>All Status</option>
          <option>On-Going</option>
          <option>Recruiting</option>
          <option>Active</option>
          <option>Completed</option>
          <option>Suspended</option>
        </select>
        <select style={inputStyle}>
          <option>All Phases</option>
          <option>Phase I</option>
          <option>Phase II</option>
          <option>Phase III</option>
          <option>Phase IV</option>
        </select>
      </div>

      {/* Database Trial List Table */}
      <div style={{ ...panelStyle, overflowX: "auto" }}>
        <h2 style={{ color: t.text }}>Clinical Trial Portfolio</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr>
              <th style={thStyle}>Trial ID</th>
              <th style={thStyle}>Study Title</th>
              <th style={thStyle}>Phase</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Participants</th>
              <th style={thStyle}>CTRI Registration</th>
            </tr>
          </thead>
          <tbody>
            {trials.length > 0 ? (
              trials.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td style={tdStyle}>{item.id || item.trial_id || `AIIA-00${idx + 1}`}</td>
                  <td style={tdStyle}>{item.trial_title || item.title || item.study_title}</td>
                  <td style={tdStyle}>{item.phase || "Phase I"}</td>
                  <td style={tdStyle}>{item.status || "On-Going"}</td>
                  <td style={tdStyle}>{item.participants || "0 / 100"}</td>
                  <td style={tdStyle}>{item.ctri_registration_number || item.ctri_id || item.ctri || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ ...tdStyle, textAlign: "center", color: t.textMuted, padding: "30px" }}>
                  No clinical trials found in backend database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}