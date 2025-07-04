import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { recommendationsApi } from '../services/api';
import { SparklesIcon, ClockIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export default function RecommendationsPage() {
  const [days, setDays] = useState(7);
  const [limit, setLimit] = useState(10);

  const { data: recommendations, isLoading, error } = useQuery({
    queryKey: ['recommendations', { days, limit }],
    queryFn: () => recommendationsApi.get({ days, limit }).then(res => res.data),
  });

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-red-600">Error loading recommendations. Please try again.</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800';
    if (score >= 0.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getScoreText = (score: number) => {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.5) return 'Good';
    return 'Poor';
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Smart Recommendations</h1>
          <p className="mt-2 text-sm text-gray-700">
            Get intelligent dish suggestions based on ingredient variety and freshness.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <div className="flex items-center space-x-2">
          <ClockIcon className="h-5 w-5 text-gray-400" />
          <label htmlFor="days" className="text-sm font-medium text-gray-700">
            Avoid period:
          </label>
          <select
            id="days"
            className="block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          >
            <option value={3}>3 days</option>
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <SparklesIcon className="h-5 w-5 text-gray-400" />
          <label htmlFor="limit" className="text-sm font-medium text-gray-700">
            Show:
          </label>
          <select
            id="limit"
            className="block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value={5}>5 dishes</option>
            <option value={10}>10 dishes</option>
            <option value={20}>20 dishes</option>
          </select>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {recommendations?.map((recommendation) => (
          <div key={recommendation.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-6 py-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {recommendation.name}
                  </h3>
                  {recommendation.description && (
                    <p className="mt-1 text-sm text-gray-600">
                      {recommendation.description}
                    </p>
                  )}
                </div>
                <div className="ml-4 flex-shrink-0">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(recommendation.freshnessScore)}`}>
                    {getScoreText(recommendation.freshnessScore)}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Freshness Score</span>
                  <span className="font-medium">{Math.round(recommendation.freshnessScore * 100)}%</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      recommendation.freshnessScore >= 0.8 ? 'bg-green-500' :
                      recommendation.freshnessScore >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${recommendation.freshnessScore * 100}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <span className="font-medium text-green-600">
                    {recommendation.totalIngredients - recommendation.recentIngredients}
                  </span>
                  <span className="ml-1">fresh ingredients</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-orange-600">
                    {recommendation.recentIngredients}
                  </span>
                  <span className="ml-1">recent ingredients</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <div className="flex">
                  <InformationCircleIcon className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div className="ml-2">
                    <p className="text-sm text-blue-800">
                      {recommendation.reason}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Ingredients:</h4>
                <div className="flex flex-wrap gap-2">
                  {recommendation.dishIngredients.map((dishIngredient) => (
                    <span
                      key={dishIngredient.id}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {dishIngredient.ingredient.name}
                      <span className="ml-1 text-gray-500">
                        ({dishIngredient.quantity} {dishIngredient.unit})
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-gray-50 flex justify-between items-center">
              <button className="text-sm font-medium text-blue-600 hover:text-blue-900">
                View Recipe
              </button>
              <button className="text-sm font-medium text-green-600 hover:text-green-900">
                Mark as Consumed
              </button>
            </div>
          </div>
        ))}
      </div>

      {recommendations?.length === 0 && (
        <div className="text-center py-12">
          <SparklesIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No recommendations available</h3>
          <p className="mt-1 text-sm text-gray-500">
            Create some dishes and log your consumption to get personalized recommendations.
          </p>
        </div>
      )}
    </div>
  );
}