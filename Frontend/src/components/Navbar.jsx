import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
      
      {/* LOGO */}
      <Link className="navbar-brand fw-bold text-primary" to="/">
        FinTrack
      </Link>

      {/* TOGGLE BUTTON (mobile) */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* NAV LINKS */}
      <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
        <ul className="navbar-nav align-items-center gap-2">

          {user ? (
            <>
              <li className="nav-item">
                <Link className="nav-link fw-semibold" to="/dashboard">
                  Dashboard
                </Link>
              </li>

              <li className="nav-item">
                <span className="nav-link text-dark fw-semibold">
                  👋 {user.name}
                </span>
              </li>

              <li className="nav-item">
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger btn-sm ms-2"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link fw-semibold" to="/">
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link fw-semibold" to="/login">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link className="btn btn-primary btn-sm ms-2" to="/signup">
                  Signup
                </Link>
              </li>
            </>
          )}

        </ul>
      </div>
    </nav>
  );
};

export default Navbar;