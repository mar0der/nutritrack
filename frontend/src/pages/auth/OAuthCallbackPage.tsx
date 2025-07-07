import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export const OAuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser, initializeAuth } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        console.error('OAuth error:', error);
        navigate('/login?error=oauth_failed');
        return;
      }

      if (token) {
        // Set token and fetch user data
        setUser(null, token);
        await initializeAuth();
        navigate('/');
      } else {
        navigate('/login?error=no_token');
      }
    };

    handleCallback();
  }, [searchParams, setUser, initializeAuth, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};