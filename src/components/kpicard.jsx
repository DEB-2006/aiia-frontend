export default function kpicard({ theme: t, title, value, subtitle }) {
  return (
    <div style={{ background: t.panelBg, padding: "20px", borderRadius: "12px", border: `1px solid ${t.border}`, boxShadow: t.shadow, minWidth: 0 }}>
      <p style={{ color: t.textMuted, margin: 0 }}>{title}</p>
      <h2 style={{ fontSize: "30px", margin: "10px 0", color: t.text }}>{value}</h2>
      <small style={{ color: t.accent }}>{subtitle}</small>
    </div>
  );
}