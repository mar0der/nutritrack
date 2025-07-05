import { z } from 'zod';

// Ingredient schemas
export const CreateIngredientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  nutritionalInfo: z.record(z.any()).optional(),
});

export const UpdateIngredientSchema = CreateIngredientSchema.partial();

export type CreateIngredientInput = z.infer<typeof CreateIngredientSchema>;
export type UpdateIngredientInput = z.infer<typeof UpdateIngredientSchema>;

// Dish schemas
export const DishIngredientSchema = z.object({
  ingredientId: z.string(),
  quantity: z.number().positive(),
  unit: z.string().min(1),
});

export const CreateDishSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  instructions: z.string().optional(),
  ingredients: z.array(DishIngredientSchema).min(1, 'At least one ingredient is required'),
});

export const UpdateDishSchema = CreateDishSchema.partial();

export type CreateDishInput = z.infer<typeof CreateDishSchema>;
export type UpdateDishInput = z.infer<typeof UpdateDishSchema>;

// Consumption log schemas
export const CreateConsumptionLogSchema = z.object({
  ingredientId: z.string().optional(),
  dishId: z.string().optional(),
  quantity: z.number().positive(),
  unit: z.string().optional(),
  consumedAt: z.string().optional(),
}).refine(
  (data) => data.ingredientId || data.dishId,
  'Either ingredientId or dishId must be provided'
);

export type CreateConsumptionLogInput = z.infer<typeof CreateConsumptionLogSchema>;

// User preference schemas
export const UpdateUserPreferenceSchema = z.object({
  avoidPeriodDays: z.number().int().min(1).max(365),
  dietaryRestrictions: z.array(z.string()),
});

export type UpdateUserPreferenceInput = z.infer<typeof UpdateUserPreferenceSchema>;