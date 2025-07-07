const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'admin@nutritrack.local' }
    });
    
    if (user) {
      console.log('User found:', {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: user.provider,
        hasPasswordHash: !!user.passwordHash,
        passwordHashLength: user.passwordHash ? user.passwordHash.length : 0
      });
      
      // Test password
      if (user.passwordHash) {
        const isValid = await bcrypt.compare('password123', user.passwordHash);
        console.log('Password "password123" is valid:', isValid);
      }
      
      // Create a new proper hash
      const newHash = await bcrypt.hash('password123', 12);
      console.log('New hash for password123:', newHash);
      
      // Update the user with the correct hash
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: newHash }
      });
      
      console.log('✅ Password hash updated successfully');
      
    } else {
      console.log('❌ User not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();