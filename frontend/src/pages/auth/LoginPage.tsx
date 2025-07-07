import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginForm } from '../../components/auth/LoginForm';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginSuccess = () => {
    // Redirect to the page they were trying to visit or home
    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });
  };

  return <LoginForm onSuccess={handleLoginSuccess} />;
};