import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import IngredientsPage from './pages/IngredientsPage';
import DishesPage from './pages/DishesPage';
import ConsumptionPage from './pages/ConsumptionPage';
import RecommendationsPage from './pages/RecommendationsPage';
import HomePage from './pages/HomePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ingredients" element={<IngredientsPage />} />
            <Route path="/dishes" element={<DishesPage />} />
            <Route path="/consumption" element={<ConsumptionPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;