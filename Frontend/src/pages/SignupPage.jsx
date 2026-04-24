import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import SignupForm from '../components/SignupForm';

const SignupPage = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-info">
          <h1>Join Us Today!</h1>
          <p>Create an account to start your journey towards financial freedom.</p>
          <ul className="auth-benefits">
            <li>✓ Detailed Category Breakdown</li>
            <li>✓ Monthly Summaries</li>
            <li>✓ Easy Transaction Management</li>
          </ul>
        </div>
        <div className="auth-form-wrapper">
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
