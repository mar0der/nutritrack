import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { CreateDishSchema, UpdateDishSchema } from '../types';

const router = Router();

// GET /api/dishes - Get all dishes
router.get('/', async (req: any, res: any) => {
  try {
    const { search } = req.query;
    
    const dishes = await prisma.dish.findMany({
      where: {
        ...(search && {
          name: {
            contains: search as string,
            mode: 'insensitive',
          },
        }),
      },
      include: {
        dishIngredients: {
          include: {
            ingredient: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json(dishes);
  } catch (error) {
    console.error('Error fetching dishes:', error);
    res.status(500).json({ error: 'Failed to fetch dishes' });
  }
});

// GET /api/dishes/:id - Get dish by ID
router.get('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    const dish = await prisma.dish.findUnique({
      where: { id },
      include: {
        dishIngredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }

    res.json(dish);
  } catch (error) {
    console.error('Error fetching dish:', error);
    res.status(500).json({ error: 'Failed to fetch dish' });
  }
});

// POST /api/dishes - Create new dish
router.post('/', async (req: any, res: any) => {
  try {
    const validatedData = CreateDishSchema.parse(req.body);
    
    const dish = await prisma.dish.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        instructions: validatedData.instructions,
        dishIngredients: {
          create: validatedData.ingredients.map(ingredient => ({
            ingredientId: ingredient.ingredientId,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
          })),
        },
      },
      include: {
        dishIngredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    res.status(201).json(dish);
  } catch (error) {
    console.error('Error creating dish:', error);
    res.status(500).json({ error: 'Failed to create dish' });
  }
});

// PUT /api/dishes/:id - Update dish
router.put('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const validatedData = UpdateDishSchema.parse(req.body);
    
    // Use transaction to update dish and its ingredients
    const dish = await prisma.$transaction(async (tx) => {
      // Update dish basic info
      const updatedDish = await tx.dish.update({
        where: { id },
        data: {
          name: validatedData.name,
          description: validatedData.description,
          instructions: validatedData.instructions,
        },
      });

      // If ingredients are provided, update them
      if (validatedData.ingredients) {
        // Delete existing dish ingredients
        await tx.dishIngredient.deleteMany({
          where: { dishId: id },
        });

        // Create new dish ingredients
        await tx.dishIngredient.createMany({
          data: validatedData.ingredients.map(ingredient => ({
            dishId: id,
            ingredientId: ingredient.ingredientId,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
          })),
        });
      }

      // Return updated dish with ingredients
      return tx.dish.findUnique({
        where: { id },
        include: {
          dishIngredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });
    });

    res.json(dish);
  } catch (error) {
    console.error('Error updating dish:', error);
    
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return res.status(404).json({ error: 'Dish not found' });
    }
    
    res.status(500).json({ error: 'Failed to update dish' });
  }
});

// DELETE /api/dishes/:id - Delete dish
router.delete('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    await prisma.dish.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting dish:', error);
    
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return res.status(404).json({ error: 'Dish not found' });
    }
    
    res.status(500).json({ error: 'Failed to delete dish' });
  }
});

export default router;