import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { CreateConsumptionLogSchema } from '../types';

const router = Router();

// GET /api/consumption - Get consumption logs
router.get('/', async (req: any, res: any) => {
  try {
    const { days = '30' } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days as string));
    
    const logs = await prisma.consumptionLog.findMany({
      where: {
        consumedAt: {
          gte: daysAgo,
        },
      },
      include: {
        ingredient: true,
        dish: {
          include: {
            dishIngredients: {
              include: {
                ingredient: true,
              },
            },
          },
        },
      },
      orderBy: {
        consumedAt: 'desc',
      },
    });

    res.json(logs);
  } catch (error) {
    console.error('Error fetching consumption logs:', error);
    res.status(500).json({ error: 'Failed to fetch consumption logs' });
  }
});

// POST /api/consumption - Log consumption
router.post('/', async (req: any, res: any) => {
  try {
    const validatedData = CreateConsumptionLogSchema.parse(req.body);
    
    const log = await prisma.consumptionLog.create({
      data: {
        ingredientId: validatedData.ingredientId,
        dishId: validatedData.dishId,
        quantity: validatedData.quantity,
        unit: validatedData.unit,
        consumedAt: validatedData.consumedAt ? new Date(validatedData.consumedAt) : new Date(),
      },
      include: {
        ingredient: true,
        dish: {
          include: {
            dishIngredients: {
              include: {
                ingredient: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json(log);
  } catch (error) {
    console.error('Error creating consumption log:', error);
    res.status(500).json({ error: 'Failed to create consumption log' });
  }
});

// GET /api/consumption/recent-ingredients - Get recently consumed ingredients
router.get('/recent-ingredients', async (req: any, res: any) => {
  try {
    const { days = '7' } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days as string));
    
    // Get ingredient IDs from direct consumption
    const directIngredients = await prisma.consumptionLog.findMany({
      where: {
        consumedAt: {
          gte: daysAgo,
        },
        ingredientId: {
          not: null,
        },
      },
      select: {
        ingredientId: true,
        consumedAt: true,
      },
    });

    // Get ingredient IDs from dishes consumed
    const dishLogs = await prisma.consumptionLog.findMany({
      where: {
        consumedAt: {
          gte: daysAgo,
        },
        dishId: {
          not: null,
        },
      },
      include: {
        dish: {
          include: {
            dishIngredients: {
              select: {
                ingredientId: true,
              },
            },
          },
        },
      },
    });

    const dishIngredients = dishLogs.flatMap(log => 
      log.dish?.dishIngredients.map(di => ({
        ingredientId: di.ingredientId,
        consumedAt: log.consumedAt,
      })) || []
    );

    // Combine and get unique recent ingredient IDs
    const allRecentIngredients = [...directIngredients, ...dishIngredients];
    const uniqueIngredientIds = [...new Set(allRecentIngredients.map(ri => ri.ingredientId))];

    res.json(uniqueIngredientIds);
  } catch (error) {
    console.error('Error fetching recent ingredients:', error);
    res.status(500).json({ error: 'Failed to fetch recent ingredients' });
  }
});

export default router;