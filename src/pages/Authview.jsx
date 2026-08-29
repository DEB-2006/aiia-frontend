import { useState } from "react";
import { apiFetch } from "../services/api";

export default function AuthView({ theme: t, setToken, panelStyle, inputStyle }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [forgotEmail, setForgotEmail] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getErrorMessage = (err) => {
    if (!err) return "Unknown error occurred";
    if (typeof err.message === "object") {
      try {
        return JSON.stringify(err.message);
      } catch {
        return "An error occurred";
      }
    }
    return err.message || JSON.stringify(err);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? "/api/v1/auth/register" : "/api/v1/auth/login";

    try {
      const data = await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (isRegistering) {
        alert("Account created successfully! Please log in.");
        setIsRegistering(false);
      } else {
        const token = data.access_token || data.token;
        if (token) {
          localStorage.setItem("access_token", token);
          setToken(token);
        } else {
          alert("Login successful, but no token was returned.");
        }
      }
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      alert(`${isRegistering ? "Registration" : "Login"} failed: ${errorMsg}`);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiFetch("/api/v1/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: forgotEmail }),
      });
      alert("Password reset instructions have been sent to your email.");
      setIsForgotPassword(false);
      setForgotEmail("");
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      alert(`Password reset failed: ${errorMsg}`);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: t.pageBg,
        color: t.text,
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ ...panelStyle, width: "400px", maxWidth: "100%" }}>
        <h2 style={{ marginTop: 0 }}>
          {isForgotPassword
            ? "Reset Password"
            : isRegistering
            ? "Register Account"
            : "AIIA CTMS Login"}
        </h2>
        <p style={{ color: t.textMuted }}>
          {isForgotPassword
            ? "Enter your email to receive password reset instructions."
            : isRegistering
            ? "Create an account to access the CTMS system."
            : "Sign in to access clinical trial data."}
        </p>

        {isForgotPassword ? (
          <form onSubmit={handleForgotPasswordSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
                Email Address
              </label>
              <input
                type="email"
                style={inputStyle}
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                background: t.accent,
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                marginBottom: "10px",
              }}
            >
              Send Reset Instructions
            </button>
            <button
              type="button"
              onClick={() => setIsForgotPassword(false)}
              style={{
                width: "100%",
                padding: "10px",
                background: "transparent",
                color: t.text,
                border: `1px solid ${t.border || "#ccc"}`,
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Back to Login
            </button>
          </form>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
                  Email / Username
                </label>
                <input
                  name="username"
                  style={inputStyle}
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              {isRegistering && (
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    style={inputStyle}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  style={inputStyle}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {!isRegistering && (
                <div style={{ textAlign: "right", marginBottom: "15px" }}>
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: t.accent,
                      cursor: "pointer",
                      fontSize: "13px",
                      padding: 0,
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "12px",
                  background: t.accent,
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {isRegistering ? "Create Account" : "Log In"}
              </button>
            </form>

            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <button
                onClick={() => setIsRegistering(!isRegistering)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: t.accent,
                  cursor: "pointer",
                  fontSize: "14px",
                  textDecoration: "underline",
                }}
              >
                {isRegistering
                  ? "Already have an account? Log In"
                  : "Don't have an account? Register"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}