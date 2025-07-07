const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testAuth() {
  try {
    console.log('Testing authentication...');
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: 'admin@nutritrack.local' }
    });
    
    if (!user) {
      console.log('❌ User not found!');
      
      // Create user with proper password hash
      console.log('Creating user with proper password hash...');
      const passwordHash = await bcrypt.hash('password123', 12);
      
      const newUser = await prisma.user.create({
        data: {
          id: 'default-user-id-123',
          email: 'admin@nutritrack.local',
          name: 'Default User',
          provider: 'email',
          passwordHash: passwordHash,
          emailVerified: true
        }
      });
      
      console.log('✅ User created:', newUser.email);
    } else {
      console.log('✅ User found:', user.email);
      
      // Test password
      if (user.passwordHash) {
        const isValid = await bcrypt.compare('password123', user.passwordHash);
        console.log('Password valid:', isValid);
        
        if (!isValid) {
          console.log('❌ Password invalid, updating...');
          const newPasswordHash = await bcrypt.hash('password123', 12);
          
          await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: newPasswordHash }
          });
          
          console.log('✅ Password updated');
        }
      } else {
        console.log('❌ No password hash found, setting...');
        const passwordHash = await bcrypt.hash('password123', 12);
        
        await prisma.user.update({
          where: { id: user.id },
          data: { passwordHash: passwordHash }
        });
        
        console.log('✅ Password hash set');
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth();