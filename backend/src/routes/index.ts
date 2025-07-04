import { Router } from 'express';
import ingredientsRouter from './ingredients';
import dishesRouter from './dishes';
import consumptionRouter from './consumption';
import recommendationsRouter from './recommendations';

const router = Router();

// Mount route handlers
router.use('/ingredients', ingredientsRouter);
router.use('/dishes', dishesRouter);
router.use('/consumption', consumptionRouter);
router.use('/recommendations', recommendationsRouter);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Nutrition API',
    version: '1.0.0',
    endpoints: {
      ingredients: '/api/ingredients',
      dishes: '/api/dishes',
      consumption: '/api/consumption',
      recommendations: '/api/recommendations',
    },
  });
});

export default router;