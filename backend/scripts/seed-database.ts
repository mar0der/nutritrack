import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with mock data...');

  // Check if database already has data
  const existingIngredientsCount = await prisma.ingredient.count();
  const existingDishesCount = await prisma.dish.count();
  
  if (existingIngredientsCount > 0 || existingDishesCount > 0) {
    console.log(`📊 Database already contains ${existingIngredientsCount} ingredients and ${existingDishesCount} dishes`);
    console.log('🔄 Skipping seeding to preserve existing data');
    console.log('💡 To force reset, run: npm run seed:reset');
    return;
  }

  console.log('📦 Database is empty, proceeding with seeding...');

  // Create ingredients
  const ingredients = await Promise.all([
    // Vegetables
    prisma.ingredient.create({
      data: {
        name: 'Tomato',
        category: 'Vegetables',
        nutritionalInfo: {
          calories: 18,
          protein: 0.9,
          carbs: 3.9,
          fat: 0.2,
          fiber: 1.2,
          vitamins: ['C', 'K', 'Folate']
        }
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Spinach',
        category: 'Vegetables',
        nutritionalInfo: {
          calories: 23,
          protein: 2.9,
          carbs: 3.6,
          fat: 0.4,
          fiber: 2.2,
          vitamins: ['K', 'A', 'C', 'Folate', 'Iron']
        }
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Bell Pepper',
        category: 'Vegetables',
        nutritionalInfo: {
          calories: 31,
          protein: 1,
          carbs: 7,
          fat: 0.3,
          fiber: 2.5,
          vitamins: ['C', 'A', 'B6']
        }
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Broccoli',
        category: 'Vegetables',
        nutritionalInfo: {
          calories: 34,
          protein: 2.8,
          carbs: 7,
          fat: 0.4,
          fiber: 2.6,
          vitamins: ['C', 'K', 'Folate']
        }
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Carrots',
        category: 'Vegetables',
        nutritionalInfo: {
          calories: 41,
          protein: 0.9,
          carbs: 10,
          fat: 0.2,
          fiber: 2.8,
          vitamins: ['A', 'K', 'B6']
        }
      }
    }),

    // Proteins
    prisma.ingredient.create({
      data: {
        name: 'Chicken Breast',
        category: 'Protein',
        nutritionalInfo: {
          calories: 165,
          protein: 31,
          carbs: 0,
          fat: 3.6,
          fiber: 0,
          vitamins: ['B6', 'Niacin', 'Phosphorus']
        }
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Salmon',
        category: 'Protein',
        nutritionalInfo: {
          calories: 208,
          protein: 22,
          carbs: 0,
          fat: 13,
          fiber: 0,
          vitamins: ['B12', 'D', 'Omega-3']
        }
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Eggs',
        category: 'Protein',
        nutritionalInfo: {
          calories: 155,
          protein: 13,
          carbs: 1.1,
          fat: 11,
          fiber: 0,
          vitamins: ['B12', 'D', 'Choline']
        }
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Black Beans',
        category: 'Protein',
        nutritionalInfo: {
          calories: 227,
          protein: 15,
          carbs: 41,
          fat: 0.9,
          fiber: 15,
          vitamins: ['Folate', 'Magnesium', 'Iron']
        }
      }
    }),

    // Grains
    prisma.ingredient.create({
      data: {
        name: 'Brown Rice',
        category: 'Grains',
        nutritionalInfo: {
          calories: 111,
          protein: 2.6,
          carbs: 23,
          fat: 0.9,
          fiber: 1.8,
          vitamins: ['Manganese', 'Selenium']
        }
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Quinoa',
        category: 'Grains',
        nutritionalInfo: {
          calories: 222,
          protein: 8,
          carbs: 39,
          fat: 3.6,
          fiber: 5,
          vitamins: ['Manganese', 'Phosphorus', 'Folate']
        }
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Oats',
        category: 'Grains',
        nutritionalInfo: {
          calories: 389,
          protein: 17,
          carbs: 66,
          fat: 7,
          fiber: 11,
          vitamins: ['Manganese', 'Phosphorus', 'Magnesium']
        }
      }
    }),

    // Fruits
    prisma.ingredient.create({
      data: {
        name: 'Blueberries',
        category: 'Fruits',
        nutritionalInfo: {
          calories: 57,
          protein: 0.7,
          carbs: 14,
          fat: 0.3,
          fiber: 2.4,
          vitamins: ['C', 'K', 'Manganese']
        }
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Avocado',
        category: 'Fruits',
        nutritionalInfo: {
          calories: 160,
          protein: 2,
          carbs: 9,
          fat: 15,
          fiber: 7,
          vitamins: ['K', 'C', 'E']
        }
      }
    }),
    prisma.ingredient.create({
      data: {
        name: 'Banana',
        category: 'Fruits',
        nutritionalInfo: {
          calories: 89,
          protein: 1.1,
          carbs: 23,
          fat: 0.3,
          fiber: 2.6,
          vitamins: ['B6', 'C', 'Potassium']
        }
      }
    })
  ]);

  console.log(`✅ Created ${ingredients.length} ingredients`);

  // Create dishes
  const dishes = await Promise.all([
    prisma.dish.create({
      data: {
        name: 'Mediterranean Chicken Bowl',
        description: 'Grilled chicken with quinoa, tomatoes, and bell peppers',
        instructions: 'Grill chicken breast, cook quinoa, chop vegetables, combine in bowl',
        dishIngredients: {
          create: [
            { ingredientId: ingredients.find(i => i.name === 'Chicken Breast')!.id, quantity: 200, unit: 'g' },
            { ingredientId: ingredients.find(i => i.name === 'Quinoa')!.id, quantity: 100, unit: 'g' },
            { ingredientId: ingredients.find(i => i.name === 'Tomato')!.id, quantity: 150, unit: 'g' },
            { ingredientId: ingredients.find(i => i.name === 'Bell Pepper')!.id, quantity: 100, unit: 'g' }
          ]
        }
      }
    }),
    prisma.dish.create({
      data: {
        name: 'Salmon & Spinach Salad',
        description: 'Fresh spinach salad with grilled salmon and avocado',
        instructions: 'Grill salmon, wash spinach, slice avocado, combine with dressing',
        dishIngredients: {
          create: [
            { ingredientId: ingredients.find(i => i.name === 'Salmon')!.id, quantity: 150, unit: 'g' },
            { ingredientId: ingredients.find(i => i.name === 'Spinach')!.id, quantity: 100, unit: 'g' },
            { ingredientId: ingredients.find(i => i.name === 'Avocado')!.id, quantity: 80, unit: 'g' },
            { ingredientId: ingredients.find(i => i.name === 'Tomato')!.id, quantity: 100, unit: 'g' }
          ]
        }
      }
    }),
    prisma.dish.create({
      data: {
        name: 'Veggie Stir Fry',
        description: 'Colorful vegetable stir fry with brown rice',
        instructions: 'Cook rice, stir fry vegetables in wok, serve over rice',
        dishIngredients: {
          create: [
            { ingredientId: ingredients.find(i => i.name === 'Brown Rice')!.id, quantity: 120, unit: 'g' },
            { ingredientId: ingredients.find(i => i.name === 'Broccoli')!.id, quantity: 150, unit: 'g' },
            { ingredientId: ingredients.find(i => i.name === 'Carrots')!.id, quantity: 100, unit: 'g' },
            { ingredientId: ingredients.find(i => i.name === 'Bell Pepper')!.id, quantity: 120, unit: 'g' }
          ]
        }
      }
    }),
    prisma.dish.create({
      data: {
        name: 'Protein Breakfast Bowl',
        description: 'Scrambled eggs with spinach and avocado',
        instructions: 'Scramble eggs, sauté spinach, slice avocado, plate together',
        dishIngredients: {
          create: [
            { ingredientId: ingredients.find(i => i.name === 'Eggs')!.id, quantity: 2, unit: 'pieces' },
            { ingredientId: ingredients.find(i => i.name === 'Spinach')!.id, quantity: 50, unit: 'g' },
            { ingredientId: ingredients.find(i => i.name === 'Avocado')!.id, quantity: 60, unit: 'g' },
            { ingredientId: ingredients.find(i => i.name === 'Tomato')!.id, quantity: 80, unit: 'g' }
          ]
        }
      }
    }),
    prisma.dish.create({
      data: {
        name: 'Black Bean Power Bowl',
        description: 'Nutritious black bean bowl with quinoa and vegetables',
        instructions: 'Cook quinoa and black beans, prepare vegetables, assemble bowl',
        dishIngredients: {
          create: [
            { ingredientId: ingredients.find(i => i.name === 'Black Beans')!.id, quantity: 200, unit: 'g' },
            { ingredientId: ingredients.find(i => i.name === 'Quinoa')!.id, quantity: 100, unit: 'g' },
            { ingredientId: ingredients.find(i => i.name === 'Bell Pepper')!.id, quantity: 100, unit: 'g' },
            { ingredientId: ingredients.find(i => i.name === 'Avocado')!.id, quantity: 100, unit: 'g' }
          ]
        }
      }
    })
  ]);

  console.log(`✅ Created ${dishes.length} dishes`);

  // Create some consumption logs (recent activity)
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

  const consumptionLogs = await Promise.all([
    prisma.consumptionLog.create({
      data: {
        dishId: dishes[0].id, // Mediterranean Chicken Bowl
        ingredientId: ingredients.find(i => i.name === 'Chicken Breast')!.id,
        quantity: 200,
        unit: 'g',
        consumedAt: yesterday
      }
    }),
    prisma.consumptionLog.create({
      data: {
        dishId: dishes[0].id,
        ingredientId: ingredients.find(i => i.name === 'Quinoa')!.id,
        quantity: 100,
        unit: 'g',
        consumedAt: yesterday
      }
    }),
    prisma.consumptionLog.create({
      data: {
        dishId: dishes[1].id, // Salmon & Spinach Salad
        ingredientId: ingredients.find(i => i.name === 'Salmon')!.id,
        quantity: 150,
        unit: 'g',
        consumedAt: twoDaysAgo
      }
    })
  ]);

  console.log(`✅ Created ${consumptionLogs.length} consumption logs`);

  // Create user preferences
  await prisma.userPreference.create({
    data: {
      avoidPeriodDays: 3,
      dietaryRestrictions: []
    }
  });

  console.log('✅ Created user preferences');
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });