import React from "react";
import { Link, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "bootstrap/dist/css/bootstrap.min.css";

const HomePage = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="bg-light min-vh-100">

      {/* HERO */}
      <section className="container py-5">
        <div className="row align-items-center g-5">

          {/* LEFT */}
          <div className="col-md-6">
            <h1 className="display-5 fw-bold">
              Master Your <span className="text-primary">Finances</span> with Ease
            </h1>

            <p className="lead text-muted mt-3">
              Track your income, expenses, and savings all in one place.
              Get detailed insights and take control of your financial future.
            </p>

            <div className="mt-4 d-flex gap-3">
              <Link to="/signup" className="btn btn-primary btn-lg shadow">
                Get Started
              </Link>

              <Link to="/login" className="btn btn-outline-dark btn-lg">
                Login
              </Link>
            </div>
          </div>

          {/* RIGHT (IMAGE) */}
          <div className="col-md-6 text-center">
            <img
              src="finance.jpg"
              alt="Finance Dashboard"
              className="img-fluid rounded-4 shadow-lg"
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="container py-5">
        <h2 className="text-center fw-bold mb-5">
          Features that make finance simple
        </h2>

        <div className="row g-4">

          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100">
              <div style={{ fontSize: "2rem" }}>💰</div>
              <h5 className="mt-3 fw-semibold">Income Tracking</h5>
              <p className="text-muted">
                Easily log your salary, freelance earnings, and other income sources.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100">
              <div style={{ fontSize: "2rem" }}>💸</div>
              <h5 className="mt-3 fw-semibold">Expense Management</h5>
              <p className="text-muted">
                Categorize your spending to see exactly where your money goes.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100">
              <div style={{ fontSize: "2rem" }}>📈</div>
              <h5 className="mt-3 fw-semibold">Visual Insights</h5>
              <p className="text-muted">
                Beautiful charts and summaries help you understand your financial health.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-white text-center py-5">
        <div className="container">
          <h2 className="fw-bold">Start managing your money today</h2>
          <p className="mt-2">
            Join now and take full control of your finances 🚀
          </p>

          <Link
            to="/signup"
            className="btn btn-light btn-lg mt-3 fw-semibold"
          >
            Get Started Free
          </Link>
        </div>
      </section>

    </div>
  );
};

export default HomePage;