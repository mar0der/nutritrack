import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dishesApi, ingredientsApi } from '../services/api';
import { PlusIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function DishesPage() {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<any>(null);
  const [editingDish, setEditingDish] = useState<any>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    instructions: '', 
    dishIngredients: [] as any[] 
  });
  
  const queryClient = useQueryClient();

  const { data: dishes, isLoading, error } = useQuery({
    queryKey: ['dishes', { search }],
    queryFn: () => dishesApi.getAll({ 
      search: search || undefined
    }).then(res => res.data),
  });

  const { data: ingredients } = useQuery({
    queryKey: ['ingredients'],
    queryFn: () => ingredientsApi.getAll().then(res => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => dishesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
      setIsModalOpen(false);
      setFormData({ name: '', description: '', instructions: '', dishIngredients: [] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => dishesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
      setIsModalOpen(false);
      setEditingDish(null);
      setFormData({ name: '', description: '', instructions: '', dishIngredients: [] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => dishesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dishData = {
      name: formData.name,
      description: formData.description,
      instructions: formData.instructions,
      ingredients: formData.dishIngredients.map(di => ({
        ingredientId: di.ingredientId,
        quantity: di.quantity,
        unit: di.unit
      }))
    };
    
    if (editingDish) {
      updateMutation.mutate({ id: editingDish.id, data: dishData });
    } else {
      createMutation.mutate(dishData);
    }
  };

  const handleEdit = (dish: any) => {
    setEditingDish(dish);
    setFormData({
      name: dish.name,
      description: dish.description || '',
      instructions: dish.instructions || '',
      dishIngredients: dish.dishIngredients.map((di: any) => ({
        ingredientId: di.ingredient.id,
        quantity: di.quantity,
        unit: di.unit
      }))
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this dish?')) {
      deleteMutation.mutate(id);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDish(null);
    setFormData({ name: '', description: '', instructions: '', dishIngredients: [] });
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      dishIngredients: [...formData.dishIngredients, { ingredientId: '', quantity: 1, unit: 'g' }]
    });
  };

  const removeIngredient = (index: number) => {
    const newIngredients = formData.dishIngredients.filter((_, i) => i !== index);
    setFormData({ ...formData, dishIngredients: newIngredients });
  };

  const updateIngredient = (index: number, field: string, value: any) => {
    const newIngredients = [...formData.dishIngredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setFormData({ ...formData, dishIngredients: newIngredients });
  };

  const handleViewDetails = (dish: any) => {
    setSelectedDish(dish);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedDish(null);
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
            onClick={() => setIsModalOpen(true)}
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
                  <button 
                    onClick={() => handleEdit(dish)}
                    className="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(dish.id)}
                    className="text-red-600 hover:text-red-900 text-sm"
                  >
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
              <button 
                onClick={() => handleViewDetails(dish)}
                className="text-sm font-medium text-blue-600 hover:text-blue-900"
              >
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeModal}></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {editingDish ? 'Edit Dish' : 'Add New Dish'}
                        </h3>
                        <button
                          type="button"
                          onClick={closeModal}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter dish name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter dish description"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Instructions
                          </label>
                          <textarea
                            value={formData.instructions}
                            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter cooking instructions"
                            rows={3}
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Ingredients
                            </label>
                            <button
                              type="button"
                              onClick={addIngredient}
                              className="text-blue-600 hover:text-blue-900 text-sm"
                            >
                              + Add Ingredient
                            </button>
                          </div>
                          {formData.dishIngredients.map((dishIngredient, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                              <select
                                value={dishIngredient.ingredientId}
                                onChange={(e) => updateIngredient(index, 'ingredientId', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                              >
                                <option value="">Select ingredient</option>
                                {ingredients?.map((ingredient) => (
                                  <option key={ingredient.id} value={ingredient.id}>
                                    {ingredient.name}
                                  </option>
                                ))}
                              </select>
                              <input
                                type="number"
                                value={dishIngredient.quantity}
                                onChange={(e) => updateIngredient(index, 'quantity', parseFloat(e.target.value) || 0)}
                                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Qty"
                                min="0"
                                step="0.1"
                                required
                              />
                              <select
                                value={dishIngredient.unit}
                                onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                              >
                                <option value="g">g</option>
                                <option value="kg">kg</option>
                                <option value="ml">ml</option>
                                <option value="l">l</option>
                                <option value="pieces">pcs</option>
                                <option value="cups">cups</option>
                                <option value="tbsp">tbsp</option>
                                <option value="tsp">tsp</option>
                              </select>
                              <button
                                type="button"
                                onClick={() => removeIngredient(index)}
                                className="text-red-600 hover:text-red-900 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          {formData.dishIngredients.length === 0 && (
                            <p className="text-gray-500 text-sm">No ingredients added yet.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {(createMutation.isPending || updateMutation.isPending) ? 'Saving...' : (editingDish ? 'Update' : 'Create')}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
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

      {/* Details Modal */}
      {isDetailsModalOpen && selectedDish && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeDetailsModal}></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        {selectedDish.name}
                      </h3>
                      <button
                        type="button"
                        onClick={closeDetailsModal}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>
                    
                    {selectedDish.description && (
                      <div className="mb-6">
                        <h4 className="text-lg font-medium text-gray-900 mb-2">Description</h4>
                        <p className="text-gray-700">{selectedDish.description}</p>
                      </div>
                    )}

                    <div className="mb-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-3">Ingredients</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="space-y-2">
                          {selectedDish.dishIngredients.map((dishIngredient: any, index: number) => (
                            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                              <span className="font-medium text-gray-900">
                                {dishIngredient.ingredient.name}
                              </span>
                              <span className="text-gray-600">
                                {dishIngredient.quantity} {dishIngredient.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {selectedDish.instructions && (
                      <div className="mb-4">
                        <h4 className="text-lg font-medium text-gray-900 mb-2">Instructions</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700 whitespace-pre-wrap">{selectedDish.instructions}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
                      <span>Created: {new Date(selectedDish.createdAt).toLocaleDateString()}</span>
                      <span>{selectedDish.dishIngredients.length} ingredients</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => {
                    closeDetailsModal();
                    handleEdit(selectedDish);
                  }}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Edit Dish
                </button>
                <button
                  type="button"
                  onClick={closeDetailsModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}