import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "./services/api";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import TrialModal from "./components/TrialModal";

import AuthView from "./pages/AuthView";
import DashboardView from "./pages/DashboardView";
import ClinicalTrialsView from "./pages/ClinicalTrialsView";
import ParticipantsView from "./pages/ParticipantsView";
import SafetyView from "./pages/SafetyView";
import GcpComplianceView from "./pages/GcpComplianceView";
import AyurvedaInterventionsView from "./pages/AyurvedaInterventionsView";
import EthicsRegulatoryView from "./pages/EthicsRegulatoryView";

/* ================= THEMES ================= */
export const themes = {
  light: {
    pageBg: "#f5f7fa",
    panelBg: "#ffffff",
    sidebarBg: "#ffffff",
    border: "#e2e5ea",
    text: "#1c1f24",
    textMuted: "#6b7280",
    textFaint: "#9aa1ab",
    accent: "#16834b",
    accentBg: "#e8f5ee",
    trackBg: "#e5e7eb",
    warnBg: "#fff5df",
    warnText: "#7a5b00",
    overlay: "rgba(15, 23, 20, 0.55)",
    inputBg: "#ffffff",
    inputBorder: "#cfd4da",
    tableHeadBorder: "#dfe3e8",
    tableRowBorder: "#eef0f2",
    shadow: "0 1px 2px rgba(16,24,32,0.04)",
  },
  dark: {
    pageBg: "#0f1216",
    panelBg: "#171b21",
    sidebarBg: "#13161b",
    border: "#262b33",
    text: "#e8eaed",
    textMuted: "#9aa1ab",
    textFaint: "#6b7280",
    accent: "#3ddc84",
    accentBg: "#173327",
    trackBg: "#262b33",
    warnBg: "#3a2f10",
    warnText: "#f2c94c",
    overlay: "rgba(0, 0, 0, 0.65)",
    inputBg: "#1d222a",
    inputBorder: "#333a45",
    tableHeadBorder: "#2a3039",
    tableRowBorder: "#20252c",
    shadow: "0 1px 2px rgba(0,0,0,0.3)",
  },
};

function App() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [showTrialForm, setShowTrialForm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Auth States
  const [token, setToken] = useState(localStorage.getItem("access_token") || "");

  // Data States
  const [trials, setTrials] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    ctri_registration_number: "",
    trial_title: "",
    phase: "Phase I",
    sponsor_name: "AIIA",
    status: "On-Going",
    start_date: "",
  });

  const t = darkMode ? themes.dark : themes.light;

  const menuItems = [
    "Dashboard",
    "Clinical Trials",
    "Participants",
    "Sites",
    "Safety & PV",
    "GCP Compliance",
    "Ethics & Regulatory",
  ];

  const fetchBackendData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      if (activeMenu === "Clinical Trials" || activeMenu === "Dashboard") {
        const trialsData = await apiFetch("/api/v1/trials/");
        if (Array.isArray(trialsData)) {
          setTrials(trialsData);
        }
      }
      if (activeMenu === "Participants") {
        const patientsData = await apiFetch("/api/v1/patients/");
        if (Array.isArray(patientsData)) {
          setPatients(patientsData);
        }
      }
    } catch (err) {
      console.warn("Backend request failed:", err.message);
    } finally {
      setLoading(false);
    }
  }, [activeMenu, token]);

  useEffect(() => {
    fetchBackendData();
  }, [fetchBackendData]);

  const handleSaveTrial = async (e) => {
    e.preventDefault();
    try {
      const response = await apiFetch("/api/v1/trials/", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (response) {
        setTrials((prev) => [...prev, response]);
      }

      await fetchBackendData();

      setShowTrialForm(false);
      setFormData({
        ctri_registration_number: "",
        trial_title: "",
        phase: "Phase I",
        sponsor_name: "AIIA",
        status: "On-Going",
        start_date: "",
      });
      alert("Clinical Trial saved to database successfully!");
    } catch (err) {
      console.error("Failed to save trial:", err);
      alert("Failed to save trial to backend database: " + err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const panelStyle = { background: t.panelBg, padding: "25px", borderRadius: "12px", border: `1px solid ${t.border}`, boxShadow: t.shadow };
  const inputStyle = { padding: "12px", border: `1px solid ${t.inputBorder}`, borderRadius: "8px", boxSizing: "border-box", width: "100%", background: t.inputBg, color: t.text };
  const thStyle = { textAlign: "left", padding: "12px", borderBottom: `2px solid ${t.tableHeadBorder}`, color: t.textMuted, fontSize: "13px" };
  const tdStyle = { padding: "12px", borderBottom: `1px solid ${t.tableRowBorder}`, color: t.text };

  if (!token) {
    return (
      <AuthView 
        theme={t} 
        setToken={setToken} 
        panelStyle={panelStyle} 
        inputStyle={inputStyle} 
      />
    );
  }

  return (
    <div style={{ minHeight: "100vh", width: "100%", display: "flex", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif", background: t.pageBg, color: t.text, margin: 0, padding: 0, boxSizing: "border-box" }}>
      <Sidebar theme={t} menuItems={menuItems} activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      <main style={{ flex: "1 1 480px", minWidth: 0, padding: "30px", boxSizing: "border-box" }}>
        <Header theme={t} activeMenu={activeMenu} darkMode={darkMode} setDarkMode={setDarkMode} setToken={setToken} />

        {activeMenu === "Dashboard" && (
          <DashboardView theme={t} darkMode={darkMode} trials={trials} setShowTrialForm={setShowTrialForm} panelStyle={panelStyle} />
        )}

        {activeMenu === "Clinical Trials" && (
          <ClinicalTrialsView theme={t} darkMode={darkMode} trials={trials} setShowTrialForm={setShowTrialForm} panelStyle={panelStyle} inputStyle={inputStyle} thStyle={thStyle} tdStyle={tdStyle} />
        )}

        {activeMenu === "Participants" && (
          <ParticipantsView theme={t} patients={patients} loading={loading} panelStyle={panelStyle} thStyle={thStyle} tdStyle={tdStyle} />
        )}

        {activeMenu === "Sites" && (
          <AyurvedaInterventionsView theme={t} panelStyle={panelStyle} thStyle={thStyle} tdStyle={tdStyle} />
        )}

        {activeMenu === "Safety & PV" && (
          <SafetyView theme={t} panelStyle={panelStyle} thStyle={thStyle} tdStyle={tdStyle} />
        )}

        {activeMenu === "GCP Compliance" && (
          <GcpComplianceView theme={t} panelStyle={panelStyle} thStyle={thStyle} tdStyle={tdStyle} />
        )}

        {activeMenu === "Ethics & Regulatory" && (
          <EthicsRegulatoryView theme={t} panelStyle={panelStyle} thStyle={thStyle} tdStyle={tdStyle} />
        )}
      </main>

      {showTrialForm && (
        <TrialModal theme={t} darkMode={darkMode} formData={formData} handleInputChange={handleInputChange} handleSaveTrial={handleSaveTrial} setShowTrialForm={setShowTrialForm} />
      )}
    </div>
  );
}

export default App;