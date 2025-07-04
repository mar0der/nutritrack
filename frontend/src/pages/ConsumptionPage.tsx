import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { consumptionApi } from '../services/api';
import { PlusIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

export default function ConsumptionPage() {
  const [days, setDays] = useState(30);

  const { data: consumptionLogs, isLoading, error } = useQuery({
    queryKey: ['consumption', { days }],
    queryFn: () => consumptionApi.getAll({ days }).then(res => res.data),
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
          <p className="text-red-600">Error loading consumption logs. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Consumption Tracking</h1>
          <p className="mt-2 text-sm text-gray-700">
            Log what you eat to track ingredient consumption over time.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Log Consumption
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="mt-6 flex items-center space-x-4">
        <div className="flex items-center">
          <CalendarDaysIcon className="h-5 w-5 text-gray-400 mr-2" />
          <label htmlFor="days" className="text-sm font-medium text-gray-700">
            Show last:
          </label>
        </div>
        <select
          id="days"
          className="block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
        >
          <option value={7}>7 days</option>
          <option value={14}>14 days</option>
          <option value={30}>30 days</option>
          <option value={90}>90 days</option>
        </select>
      </div>

      {/* Consumption Timeline */}
      <div className="mt-8">
        <div className="flow-root">
          <ul className="-mb-8">
            {consumptionLogs?.map((log, logIdx) => (
              <li key={log.id}>
                <div className="relative pb-8">
                  {logIdx !== consumptionLogs.length - 1 ? (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="bg-blue-500 h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white">
                        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <div className="text-sm text-gray-900">
                          {log.dish ? (
                            <div>
                              <span className="font-medium">Dish:</span> {log.dish.name}
                              <div className="mt-1 text-xs text-gray-500">
                                Ingredients: {log.dish.dishIngredients.map(di => di.ingredient.name).join(', ')}
                              </div>
                            </div>
                          ) : log.ingredient ? (
                            <div>
                              <span className="font-medium">Ingredient:</span> {log.ingredient.name}
                            </div>
                          ) : null}
                          <div className="mt-1 text-xs text-gray-500">
                            Quantity: {log.quantity} {log.unit}
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <time dateTime={log.consumedAt}>
                          {new Date(log.consumedAt).toLocaleDateString()} at{' '}
                          {new Date(log.consumedAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {consumptionLogs?.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No consumption logs found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start tracking your nutrition by logging what you eat.
          </p>
        </div>
      )}
    </div>
  );
}