// API Types
export interface Ingredient {
  id: string;
  name: string;
  category: string;
  nutritionalInfo?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface DishIngredient {
  id: string;
  dishId: string;
  ingredientId: string;
  quantity: number;
  unit: string;
  ingredient: Ingredient;
}

export interface Dish {
  id: string;
  name: string;
  description?: string;
  instructions?: string;
  createdAt: string;
  updatedAt: string;
  dishIngredients: DishIngredient[];
}

export interface ConsumptionLog {
  id: string;
  ingredientId?: string;
  dishId?: string;
  quantity: number;
  unit?: string;
  consumedAt: string;
  ingredient?: Ingredient;
  dish?: Dish;
}

export interface Recommendation {
  id: string;
  name: string;
  description?: string;
  instructions?: string;
  dishIngredients: DishIngredient[];
  freshnessScore: number;
  recentIngredients: number;
  totalIngredients: number;
  reason: string;
}

// Form Types
export interface CreateIngredientForm {
  name: string;
  category: string;
  nutritionalInfo?: Record<string, any>;
}

export interface CreateDishForm {
  name: string;
  description?: string;
  instructions?: string;
  ingredients: {
    ingredientId: string;
    quantity: number;
    unit: string;
  }[];
}

export interface CreateConsumptionLogForm {
  ingredientId?: string;
  dishId?: string;
  quantity: number;
  unit?: string;
  consumedAt?: string;
}