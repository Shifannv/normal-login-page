import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const API = import.meta.env.VITE_API_URL;

function IconLock() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconEyeOff() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function IconEye() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconAlert() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotPassword, setForgotPassword] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "password") setPasswordError("");
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setPasswordError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/login`, form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      if (msg.toLowerCase().includes("password")) {
        setPasswordError(msg);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  function toggleForgot() {
    setShowForgot((v) => !v);
    setForgotMsg("");
    setForgotError("");
    setForgotEmail("");
    setForgotPassword("");
  }

  async function handleForgotSubmit(e) {
    e.preventDefault();
    setForgotError("");
    setForgotMsg("");
    setForgotLoading(true);
    try {
      await axios.post(`${API}/api/auth/reset-password`, {
        email: forgotEmail,
        newPassword: forgotPassword,
      });
      setForgotMsg("Password updated! You can now log in.");
      setForgotEmail("");
      setForgotPassword("");
    } catch (err) {
      setForgotError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card" role="main">

        <div className="auth-brand">
          <div className="auth-brand-icon" aria-hidden="true">
            <IconLock />
          </div>
          <span className="auth-brand-name">Welcome to the login page</span>
        </div>

        <div className="auth-heading">
          <h1>Sign in to your account</h1>
        </div>

        <form id="login-form" className="auth-form" onSubmit={handleSubmit} noValidate>

          <div className="field">
            <label className="field-label" htmlFor="login-email">Email address</label>
            <div className="field-input-wrap">
              <input
                id="login-email"
                className={`field-input${form.email && !error ? " is-valid" : ""}`}
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
              {form.email && !error && (
                <span className="field-valid-icon" aria-hidden="true">
                  <IconCheck />
                </span>
              )}
            </div>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="login-password">Password</label>
            <div className="field-input-wrap">
              <input
                id="login-password"
                className={`field-input has-icon-right${passwordError ? " is-error" : ""}`}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="eye-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
            {passwordError && (
              <span className="field-hint" role="alert">{passwordError}</span>
            )}
          </div>

          <div className="form-row">
            <label className="remember-label">
              <input
                id="remember-me"
                className="remember-checkbox"
                type="checkbox"
              />
              Remember me
            </label>
            <button
              type="button"
              id="forgot-password-toggle"
              className="forgot-link"
              onClick={toggleForgot}
              aria-expanded={showForgot}
            >
              Forgot password?
            </button>
          </div>

          {showForgot && (
            <div className="forgot-panel" role="region" aria-label="Reset password">
              <p className="forgot-panel-title">Reset your password</p>
              <form id="forgot-form" onSubmit={handleForgotSubmit} noValidate>
                <div className="field" style={{ marginBottom: 10 }}>
                  <input
                    id="forgot-email"
                    className="field-input"
                    type="email"
                    placeholder="Registered email address"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="field" style={{ marginBottom: 10 }}>
                  <input
                    id="forgot-new-password"
                    className="field-input"
                    type="password"
                    placeholder="New password (min. 6 characters)"
                    value={forgotPassword}
                    onChange={(e) => setForgotPassword(e.target.value)}
                    minLength={6}
                    autoComplete="new-password"
                    required
                  />
                </div>
                {forgotError && (
                  <div className="alert alert-error" role="alert">
                    <IconAlert />
                    <span>{forgotError}</span>
                  </div>
                )}
                {forgotMsg && (
                  <div className="alert alert-success" role="status">
                    <IconCheck />
                    <span>{forgotMsg}</span>
                  </div>
                )}
                <button
                  type="submit"
                  id="forgot-submit-btn"
                  className="forgot-submit-btn"
                  disabled={forgotLoading}
                >
                  {forgotLoading ? "Updating…" : "Update password"}
                </button>
              </form>
            </div>
          )}

          {error && (
            <div className="alert alert-error" role="alert">
              <IconAlert />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            id="login-submit-btn"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner" aria-hidden="true" /> Signing in…</>
            ) : (
              <>Sign in <IconArrow /></>
            )}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?<Link to="/signup" id="go-to-signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
