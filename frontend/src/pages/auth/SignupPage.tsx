import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SignupForm } from '../../components/auth/SignupForm';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSignupSuccess = () => {
    navigate('/', { replace: true });
  };

  return <SignupForm onSuccess={handleSignupSuccess} />;
};