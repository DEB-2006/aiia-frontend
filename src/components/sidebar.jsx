export default function Sidebar({ theme: t, menuItems, activeMenu, setActiveMenu }) {
  return (
    <aside
      style={{
        width: "240px",
        flex: "0 0 240px",
        background: t.sidebarBg,
        borderRight: `1px solid ${t.border}`,
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ margin: 0, color: t.text }}>AIIA</h2>
        <p style={{ margin: "5px 0", color: t.textMuted }}>Clinical Research</p>
      </div>

      <p style={{ fontSize: "12px", fontWeight: "bold", color: t.textFaint, letterSpacing: "0.05em" }}>
        MAIN MENU
      </p>

      {menuItems.map((item) => (
        <button
          key={item}
          onClick={() => setActiveMenu(item)}
          style={{
            display: "block",
            width: "100%",
            padding: "12px",
            marginBottom: "6px",
            textAlign: "left",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            background: activeMenu === item ? t.accentBg : "transparent",
            color: activeMenu === item ? t.accent : t.textMuted,
            fontWeight: activeMenu === item ? "bold" : "normal",
            fontSize: "14px",
          }}
        >
          {item}
        </button>
      ))}

      <div style={{ marginTop: "30px", padding: "12px", background: t.accentBg, borderRadius: "8px", color: t.accent }}>
        <strong>● System Operational</strong>
        <br />
        <small>GCP Compliant</small>
      </div>
    </aside>
  );
}