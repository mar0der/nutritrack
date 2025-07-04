import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { CreateIngredientSchema, UpdateIngredientSchema } from '../types';

const router = Router();

// GET /api/ingredients - Get all ingredients
router.get('/', async (req: any, res: any) => {
  try {
    const { search, category } = req.query;
    
    const ingredients = await prisma.ingredient.findMany({
      where: {
        ...(search && {
          name: {
            contains: search as string,
            mode: 'insensitive',
          },
        }),
        ...(category && {
          category: category as string,
        }),
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json(ingredients);
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    res.status(500).json({ error: 'Failed to fetch ingredients' });
  }
});

// GET /api/ingredients/:id - Get ingredient by ID
router.get('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    const ingredient = await prisma.ingredient.findUnique({
      where: { id },
      include: {
        dishIngredients: {
          include: {
            dish: true,
          },
        },
      },
    });

    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    res.json(ingredient);
  } catch (error) {
    console.error('Error fetching ingredient:', error);
    res.status(500).json({ error: 'Failed to fetch ingredient' });
  }
});

// POST /api/ingredients - Create new ingredient
router.post('/', async (req: any, res: any) => {
  try {
    const validatedData = CreateIngredientSchema.parse(req.body);
    
    const ingredient = await prisma.ingredient.create({
      data: {
        name: validatedData.name,
        category: validatedData.category,
        nutritionalInfo: validatedData.nutritionalInfo || undefined,
      },
    });

    res.status(201).json(ingredient);
  } catch (error) {
    console.error('Error creating ingredient:', error);
    
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return res.status(400).json({ error: 'Ingredient name already exists' });
    }
    
    res.status(500).json({ error: 'Failed to create ingredient' });
  }
});

// PUT /api/ingredients/:id - Update ingredient
router.put('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const validatedData = UpdateIngredientSchema.parse(req.body);
    
    const updateData: any = {};
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.category !== undefined) updateData.category = validatedData.category;
    if (validatedData.nutritionalInfo !== undefined) updateData.nutritionalInfo = validatedData.nutritionalInfo;
    
    const ingredient = await prisma.ingredient.update({
      where: { id },
      data: updateData,
    });

    res.json(ingredient);
  } catch (error) {
    console.error('Error updating ingredient:', error);
    
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }
    
    res.status(500).json({ error: 'Failed to update ingredient' });
  }
});

// DELETE /api/ingredients/:id - Delete ingredient
router.delete('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    await prisma.ingredient.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }
    
    res.status(500).json({ error: 'Failed to delete ingredient' });
  }
});

export default router;