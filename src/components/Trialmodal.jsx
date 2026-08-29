export default function TrialModal({ theme: t, darkMode, formData, handleInputChange, handleSaveTrial, setShowTrialForm }) {
  const inputStyle = {
    padding: "12px",
    border: `1px solid ${t.inputBorder}`,
    borderRadius: "8px",
    boxSizing: "border-box",
    width: "100%",
    background: t.inputBg,
    color: t.text,
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: t.overlay, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px", boxSizing: "border-box" }}>
      <div style={{ background: t.panelBg, color: t.text, width: "650px", maxWidth: "100%", maxHeight: "90vh", overflowY: "auto", padding: "30px", borderRadius: "15px", boxShadow: "0 20px 50px rgba(0,0,0,0.3)", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ color: t.text }}>New Clinical Trial</h2>
            <p style={{ color: t.textMuted }}>Enter clinical trial details.</p>
          </div>
          <button onClick={() => setShowTrialForm(false)} style={{ border: "none", background: "transparent", color: t.text, fontSize: "24px", cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>

        <form onSubmit={handleSaveTrial}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "15px", marginTop: "20px" }}>
            <input 
              name="ctri_registration_number" 
              value={formData.ctri_registration_number} 
              onChange={handleInputChange} 
              placeholder="CTRI Registration Number" 
              style={inputStyle} 
              required 
            />
            <input 
              name="trial_title" 
              value={formData.trial_title} 
              onChange={handleInputChange} 
              placeholder="Study Title" 
              style={inputStyle} 
              required 
            />
            <select 
              name="phase" 
              value={formData.phase} 
              onChange={handleInputChange} 
              style={inputStyle}
            >
              <option>Phase I</option>
              <option>Phase II</option>
              <option>Phase III</option>
              <option>Phase IV</option>
            </select>
            <input 
              name="sponsor_name" 
              value={formData.sponsor_name} 
              onChange={handleInputChange} 
              placeholder="Sponsor Name" 
              style={inputStyle} 
            />
            <select 
              name="status" 
              value={formData.status} 
              onChange={handleInputChange} 
              style={inputStyle}
            >
              <option>On-Going</option>
              <option>Recruiting</option>
              <option>Active</option>
              <option>Completed</option>
              <option>Suspended</option>
            </select>
            <input 
              type="date" 
              name="start_date" 
              value={formData.start_date} 
              onChange={handleInputChange} 
              style={inputStyle} 
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "25px", flexWrap: "wrap" }}>
            <button type="button" onClick={() => setShowTrialForm(false)} style={{ padding: "12px 20px", border: `1px solid ${t.border}`, background: t.panelBg, color: t.text, borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
            <button type="submit" style={{ padding: "12px 20px", border: "none", background: t.accent, color: darkMode ? "#0f1216" : "white", borderRadius: "8px", cursor: "pointer" }}>Save Clinical Trial</button>
          </div>
        </form>
      </div>
    </div>
  );
}