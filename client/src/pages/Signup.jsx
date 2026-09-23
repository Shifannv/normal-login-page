import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import "./Signup.css";

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

function getStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) || /[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 3);
}

const STRENGTH_LABEL = ["", "Weak", "Fair", "Strong"];
const STRENGTH_CLASS = ["", "weak", "fair", "strong"];

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const strength = getStrength(form.password);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "email") setEmailError("");
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setEmailError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/signup`, form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed. Please try again.";
      if (msg.toLowerCase().includes("already exists")) {
        setEmailError("This email is already registered. Try a different one.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card" role="main">

        <div className="auth-brand">
          <div className="auth-brand-icon" aria-hidden="true">
            <IconLock />
          </div>
          <span className="auth-brand-name">Create an account</span>
        </div>

        <form id="signup-form" className="auth-form" onSubmit={handleSubmit} noValidate>

          <div className="field">
            <label className="field-label" htmlFor="signup-name">Full name</label>
            <div className="field-input-wrap">
              <input
                id="signup-name"
                className="field-input"
                type="text"
                name="name"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="signup-email">Email address</label>
            <div className="field-input-wrap">
              <input
                id="signup-email"
                className={`field-input${emailError ? " is-error" : form.email ? " is-valid" : ""}`}
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
              {form.email && !emailError && (
                <span className="field-valid-icon" aria-hidden="true">
                  <IconCheck />
                </span>
              )}
            </div>
            {emailError && (
              <span className="field-hint" role="alert">{emailError}</span>
            )}
          </div>

          <div className="field">
            <label className="field-label" htmlFor="signup-password">Password</label>
            <div className="field-input-wrap">
              <input
                id="signup-password"
                className="field-input has-icon-right"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                minLength={6}
                autoComplete="new-password"
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

            {form.password.length > 0 && (
              <>
                <div className="password-strength" aria-hidden="true">
                  {[1, 2, 3].map((seg) => (
                    <div
                      key={seg}
                      className={`strength-segment${
                        strength >= seg
                          ? ` active-${STRENGTH_CLASS[strength]}`
                          : ""
                      }`}
                    />
                  ))}
                </div>
                <span className={`strength-label ${STRENGTH_CLASS[strength]}`}>
                  {STRENGTH_LABEL[strength]} password
                </span>
              </>
            )}
          </div>

          {error && (
            <div className="alert alert-error" role="alert">
              <IconAlert />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            id="signup-submit-btn"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner" aria-hidden="true" /> Creating account…</>
            ) : (
              <>Create account <IconArrow /></>
            )}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?<Link to="/login" id="go-to-login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
