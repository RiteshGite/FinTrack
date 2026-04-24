import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-info">
          <h1>Welcome Back!</h1>
          <p>Login to continue tracking your expenses and managing your budget.</p>
          <ul className="auth-benefits">
            <li>✓ Secure JWT Authentication</li>
            <li>✓ Google OAuth Support</li>
            <li>✓ Real-time Statistics</li>
          </ul>
        </div>
        <div className="auth-form-wrapper">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
