import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

function MainWrapper() {
  const [token, setToken] = useState(() => {
    return localStorage.getItem("access_token") || localStorage.getItem("token") || "";
  });

  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    role: "Investigator" 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!token) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f7fa", fontFamily: "sans-serif" }}>
        <div style={{ background: "#ffffff", padding: "32px", borderRadius: "12px", border: "1px solid #e2e5ea", width: "380px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <h2 style={{ marginTop: 0, color: "#1c1f24" }}>
            {isRegistering ? "Register Account" : "AIIA CTMS Login"}
          </h2>
          <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "20px" }}>
            {isRegistering ? "Create an account to access the CTMS system." : "Enter your credentials to access clinical trial data."}
          </p>
          
          <form onSubmit={async (e) => {
            e.preventDefault();
            const endpoint = isRegistering ? "/api/v1/auth/register" : "/api/v1/auth/login";

            try {
              let res, data;
              
              if (isRegistering) {
                // Use relative path so Vite proxy handles it and bypasses CORS
                res = await fetch(endpoint, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role
                  })
                });
                data = await res.json();

                if (res.ok) {
                  alert("Account registered successfully! Please log in.");
                  setIsRegistering(false);
                  setFormData({ name: "", email: "", password: "", role: "Investigator" });
                } else {
                  const errorMsg = Array.isArray(data.detail)
                    ? data.detail.map(err => `${err.loc?.join('.')}: ${err.msg}`).join(", ")
                    : (data.detail || "Error registering account");
                  alert("Registration failed: " + errorMsg);
                }
              } else {
                const bodyParams = new URLSearchParams();
                bodyParams.append("username", formData.email);
                bodyParams.append("password", formData.password);

                // Use relative path for login too
                res = await fetch(endpoint, {
                  method: "POST",
                  headers: { "Content-Type": "application/x-www-form-urlencoded" },
                  body: bodyParams
                });
                data = await res.json();

                const authToken = data.access_token || data.token;
                if (res.ok && authToken) {
                  localStorage.setItem("access_token", authToken);
                  setToken(authToken);
                } else {
                  const errorMsg = Array.isArray(data.detail)
                    ? data.detail.map(err => `${err.loc?.join('.')}: ${err.msg}`).join(", ")
                    : (data.detail || "Invalid credentials");
                  alert("Login failed: " + errorMsg);
                }
              }
            } catch (err) {
              alert("Network error: " + err.message);
            }
          }}>
            {isRegistering && (
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#374151" }}>Full Name</label>
                <input 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cfd4da", boxSizing: "border-box" }} 
                  required 
                />
              </div>
            )}

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#374151" }}>
                {isRegistering ? "Email Address" : "Email / Username"}
              </label>
              <input 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cfd4da", boxSizing: "border-box" }} 
                required 
              />
            </div>

            {isRegistering && (
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#374151" }}>Role</label>
                <select 
                  name="role" 
                  value={formData.role}
                  onChange={handleChange}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cfd4da", boxSizing: "border-box", background: "#fff" }}
                >
                  <option value="Investigator">Investigator</option>
                  <option value="Admin">Admin</option>
                  <option value="Monitor">Monitor</option>
                </select>
              </div>
            )}
            
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#374151" }}>Password</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password}
                onChange={handleChange}
                minLength="8" 
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cfd4da", boxSizing: "border-box" }} 
                required 
              />
              {isRegistering && (
                <span style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px", display: "block" }}>
                  Must be at least 8 characters long.
                </span>
              )}
            </div>

            <button type="submit" style={{ width: "100%", padding: "12px", background: "#16834b", color: "#ffffff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
              {isRegistering ? "Create Account" : "Log In"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => { setIsRegistering(!isRegistering); setFormData({ name: "", email: "", password: "", role: "Investigator" }); }}
            style={{ marginTop: "15px", background: "none", border: "none", color: "#16834b", cursor: "pointer", width: "100%", fontSize: "13px", textDecoration: "underline" }}
          >
            {isRegistering ? "Already have an account? Log In" : "Need an account? Register"}
          </button>
        </div>
      </div>
    );
  }

  return <App />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MainWrapper />
  </StrictMode>,
)