import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication to all recommendation routes
router.use(authenticateToken);

// GET /api/recommendations - Get dish recommendations
router.get('/', async (req: any, res: any) => {
  try {
    const { days = '7', limit = '10' } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days as string));
    
    // Get recently consumed ingredient IDs for current user
    const recentLogs = await prisma.consumptionLog.findMany({
      where: {
        userId: req.user.userId,
        consumedAt: {
          gte: daysAgo,
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

    // Extract all recently consumed ingredient IDs
    const recentIngredientIds = new Set<string>();
    
    recentLogs.forEach(log => {
      if (log.ingredientId) {
        recentIngredientIds.add(log.ingredientId);
      }
      if (log.dish) {
        log.dish.dishIngredients.forEach(di => {
          recentIngredientIds.add(di.ingredientId);
        });
      }
    });

    // Get all dishes with their ingredients
    const allDishes = await prisma.dish.findMany({
      include: {
        dishIngredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    // Score dishes based on ingredient freshness
    const scoredDishes = allDishes.map(dish => {
      const totalIngredients = dish.dishIngredients.length;
      const recentIngredients = dish.dishIngredients.filter(di => 
        recentIngredientIds.has(di.ingredientId)
      ).length;
      
      const freshnessScore = totalIngredients > 0 ? 
        (totalIngredients - recentIngredients) / totalIngredients : 0;
      
      return {
        ...dish,
        freshnessScore,
        recentIngredients,
        totalIngredients,
      };
    });

    // Sort by freshness score (higher is better) and take top results
    const recommendations = scoredDishes
      .sort((a, b) => b.freshnessScore - a.freshnessScore)
      .slice(0, parseInt(limit as string))
      .map(dish => ({
        id: dish.id,
        name: dish.name,
        description: dish.description,
        instructions: dish.instructions,
        dishIngredients: dish.dishIngredients,
        freshnessScore: dish.freshnessScore,
        recentIngredients: dish.recentIngredients,
        totalIngredients: dish.totalIngredients,
        reason: dish.freshnessScore === 1 ? 
          'All ingredients are fresh (not recently consumed)' :
          dish.freshnessScore === 0 ?
          'All ingredients were recently consumed' :
          `${dish.totalIngredients - dish.recentIngredients} out of ${dish.totalIngredients} ingredients are fresh`,
      }));

    res.json(recommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

export default router;