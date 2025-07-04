import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dishesApi } from '../services/api';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function DishesPage() {
  const [search, setSearch] = useState('');

  const { data: dishes, isLoading, error } = useQuery({
    queryKey: ['dishes', { search }],
    queryFn: () => dishesApi.getAll({ 
      search: search || undefined
    }).then(res => res.data),
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
          <p className="text-red-600">Error loading dishes. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Dishes</h1>
          <p className="mt-2 text-sm text-gray-700">
            Create and manage dishes with their ingredient lists. Build your recipe collection.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Dish
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Dishes Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dishes?.map((dish) => (
          <div key={dish.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {dish.name}
                </h3>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-900 text-sm">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900 text-sm">
                    Delete
                  </button>
                </div>
              </div>
              {dish.description && (
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                  {dish.description}
                </p>
              )}
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium">
                    {dish.dishIngredients.length} ingredients
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {dish.dishIngredients.slice(0, 3).map((dishIngredient) => (
                    <span
                      key={dishIngredient.id}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {dishIngredient.ingredient.name}
                    </span>
                  ))}
                  {dish.dishIngredients.length > 3 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      +{dish.dishIngredients.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="px-6 py-3 bg-gray-50 text-right">
              <button className="text-sm font-medium text-blue-600 hover:text-blue-900">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {dishes?.length === 0 && (
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
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No dishes found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first dish.
          </p>
        </div>
      )}
    </div>
  );
}