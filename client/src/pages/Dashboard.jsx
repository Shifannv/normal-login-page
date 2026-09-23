import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

const API = import.meta.env.VITE_API_URL;

function IconLogout() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  const [user, setUser] = useState(storedUser);
  const [loading, setLoading] = useState(!storedUser);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    async function fetchUser() {
      try {
        const res = await axios.get(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch {
        if (!storedUser) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [navigate, storedUser]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-card">
          <div className="dashboard-loading">
            <div className="loading-spinner" aria-hidden="true" />
            <p className="loading-text">Loading your profile…</p>
          </div>
        </div>
      </div>
    );
  }

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  return (
    <div className="dashboard-page">
      <div className="dashboard-card" role="main">

        <div className="dashboard-avatar" aria-label={`User avatar for ${user?.name}`}>
          {initial}
        </div>

        <p className="dashboard-greeting">Logged in as</p>
        <h1 className="dashboard-name">{user?.name}</h1>
        <p className="dashboard-email">{user?.email}</p>


        <button
          id="logout-button"
          className="logout-btn"
          onClick={handleLogout}
          aria-label="Log out of your account"
        >
          <IconLogout />
          Sign out
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
