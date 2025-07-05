import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Resetting database (clearing all data)...');
  
  // Clear existing data
  console.log('🔄 Clearing consumption logs...');
  await prisma.consumptionLog.deleteMany();
  
  console.log('🔄 Clearing dish ingredients...');
  await prisma.dishIngredient.deleteMany();
  
  console.log('🔄 Clearing user preferences...');
  await prisma.userPreference.deleteMany();
  
  console.log('🔄 Clearing dishes...');
  await prisma.dish.deleteMany();
  
  console.log('🔄 Clearing ingredients...');
  await prisma.ingredient.deleteMany();
  
  console.log('✅ Database reset complete!');
  console.log('💡 Run "npm run seed" to populate with mock data');
}

main()
  .catch((e) => {
    console.error('❌ Error resetting database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });