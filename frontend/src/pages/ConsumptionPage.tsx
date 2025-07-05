import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { consumptionApi, ingredientsApi, dishesApi } from '../services/api';
import { PlusIcon, CalendarDaysIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function ConsumptionPage() {
  const [days, setDays] = useState(30);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logType, setLogType] = useState<'ingredient' | 'dish'>('ingredient');
  const [formData, setFormData] = useState({
    ingredientId: '',
    dishId: '',
    quantity: 1,
    unit: 'g',
    consumedAt: new Date().toISOString().slice(0, 16)
  });
  
  const queryClient = useQueryClient();

  const { data: consumptionLogs, isLoading, error } = useQuery({
    queryKey: ['consumption', { days }],
    queryFn: () => consumptionApi.getAll({ days }).then(res => res.data),
  });

  const { data: ingredients } = useQuery({
    queryKey: ['ingredients'],
    queryFn: () => ingredientsApi.getAll().then(res => res.data),
  });

  const { data: dishes } = useQuery({
    queryKey: ['dishes'],
    queryFn: () => dishesApi.getAll().then(res => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => consumptionApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consumption'] });
      setIsModalOpen(false);
      setFormData({
        ingredientId: '',
        dishId: '',
        quantity: 1,
        unit: 'g',
        consumedAt: new Date().toISOString().slice(0, 16)
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (logType === 'ingredient' && !formData.ingredientId) {
      alert('Please select an ingredient');
      return;
    }
    
    if (logType === 'dish' && !formData.dishId) {
      alert('Please select a dish');
      return;
    }
    
    if (formData.quantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }
    
    const logData: any = {
      quantity: formData.quantity,
      unit: formData.unit,
      consumedAt: formData.consumedAt
    };
    
    if (logType === 'ingredient') {
      logData.ingredientId = formData.ingredientId;
    } else {
      logData.dishId = formData.dishId;
    }
    
    console.log('Submitting consumption log:', logData);
    createMutation.mutate(logData);
  };

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
            onClick={() => setIsModalOpen(true)}
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

      {/* Log Consumption Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          Log Consumption
                        </h3>
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            What did you consume?
                          </label>
                          <div className="flex space-x-4">
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                className="form-radio text-blue-600"
                                name="logType"
                                value="ingredient"
                                checked={logType === 'ingredient'}
                                onChange={(e) => setLogType(e.target.value as 'ingredient' | 'dish')}
                              />
                              <span className="ml-2">Ingredient</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                className="form-radio text-blue-600"
                                name="logType"
                                value="dish"
                                checked={logType === 'dish'}
                                onChange={(e) => setLogType(e.target.value as 'ingredient' | 'dish')}
                              />
                              <span className="ml-2">Dish</span>
                            </label>
                          </div>
                        </div>
                        
                        {logType === 'ingredient' ? (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Ingredient
                            </label>
                            <select
                              required
                              value={formData.ingredientId}
                              onChange={(e) => setFormData({ ...formData, ingredientId: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Select an ingredient</option>
                              {ingredients?.map((ingredient) => (
                                <option key={ingredient.id} value={ingredient.id}>
                                  {ingredient.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Dish
                            </label>
                            <select
                              required
                              value={formData.dishId}
                              onChange={(e) => setFormData({ ...formData, dishId: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Select a dish</option>
                              {dishes?.map((dish) => (
                                <option key={dish.id} value={dish.id}>
                                  {dish.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                        
                        <div className="flex space-x-3">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Quantity
                            </label>
                            <input
                              type="number"
                              required
                              min="0"
                              step="0.1"
                              value={formData.quantity}
                              onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter quantity"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Unit
                            </label>
                            <select
                              value={formData.unit}
                              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="g">g</option>
                              <option value="kg">kg</option>
                              <option value="ml">ml</option>
                              <option value="l">l</option>
                              <option value="pieces">pieces</option>
                              <option value="cups">cups</option>
                              <option value="tbsp">tbsp</option>
                              <option value="tsp">tsp</option>
                              <option value="serving">serving</option>
                              <option value="portion">portion</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            When did you consume this?
                          </label>
                          <input
                            type="datetime-local"
                            value={formData.consumedAt}
                            onChange={(e) => setFormData({ ...formData, consumedAt: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {createMutation.isPending ? 'Logging...' : 'Log Consumption'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}