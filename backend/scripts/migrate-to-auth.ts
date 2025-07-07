import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function migrateToAuth() {
  console.log('🔄 Starting migration to authentication system...');

  try {
    // Step 1: Create a default user for existing data
    console.log('📝 Creating default user for existing data...');
    
    const defaultUser = await prisma.user.create({
      data: {
        email: 'admin@nutritrack.local',
        name: 'Default User',
        provider: 'email',
        passwordHash: await bcrypt.hash('password123', 12),
        emailVerified: true,
      }
    });

    console.log(`✅ Created default user with ID: ${defaultUser.id}`);

    // Step 2: Update existing consumption logs to belong to default user
    console.log('📊 Updating existing consumption logs...');
    
    const consumptionUpdateResult = await prisma.$executeRaw`
      UPDATE consumption_logs 
      SET "userId" = ${defaultUser.id} 
      WHERE "userId" IS NULL
    `;
    
    console.log(`✅ Updated consumption logs`);

    // Step 3: Update existing user preferences to belong to default user
    console.log('⚙️ Updating existing user preferences...');
    
    const preferencesUpdateResult = await prisma.$executeRaw`
      UPDATE user_preferences 
      SET "userId" = ${defaultUser.id} 
      WHERE "userId" IS NULL
    `;
    
    console.log(`✅ Updated user preferences`);

    console.log('🎉 Migration completed successfully!');
    console.log(`
📋 Default user credentials for testing:
   Email: admin@nutritrack.local
   Password: password123
   
🚨 IMPORTANT: Change these credentials in production!
    `);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrateToAuth().catch((error) => {
  console.error('Migration script failed:', error);
  process.exit(1);
});