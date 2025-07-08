import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import IngredientsPage from './pages/IngredientsPage';
import DishesPage from './pages/DishesPage';
import ConsumptionPage from './pages/ConsumptionPage';
import RecommendationsPage from './pages/RecommendationsPage';
import HomePage from './pages/HomePage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { OAuthCallbackPage } from './pages/auth/OAuthCallbackPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAuthStore } from './stores/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    // Don't initialize auth on OAuth callback page - let the callback handle it
    if (!window.location.pathname.includes('/auth/callback')) {
      initializeAuth();
    }
  }, [initializeAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/auth/callback" element={<OAuthCallbackPage />} />
          
          {/* Protected app routes */}
          <Route path="/" element={
            <Layout>
              <HomePage />
            </Layout>
          } />
          <Route path="/ingredients" element={
            <Layout>
              <IngredientsPage />
            </Layout>
          } />
          <Route path="/dishes" element={
            <Layout>
              <DishesPage />
            </Layout>
          } />
          <Route path="/consumption" element={
            <ProtectedRoute>
              <Layout>
                <ConsumptionPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/recommendations" element={
            <ProtectedRoute>
              <Layout>
                <RecommendationsPage />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;