import express from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../lib/jwt';
import { authenticateToken } from '../middleware/auth';
import passport from '../lib/passport';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Sign up with email/password
router.post('/signup', async (req: any, res: any) => {
  try {
    const { email, password, name } = signupSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        provider: 'email',
        emailVerified: false
      }
    });

    // Create default user preferences
    await prisma.userPreference.create({
      data: {
        userId: user.id,
        avoidPeriodDays: 7,
        dietaryRestrictions: []
      }
    });

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name
    });

    // Create session record
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt
      }
    });

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        provider: user.provider,
        emailVerified: user.emailVerified
      },
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input data', details: error.errors });
    }
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login with email/password
router.post('/login', async (req: any, res: any) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name
    });

    // Create session record
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt
      }
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        provider: user.provider,
        emailVerified: user.emailVerified
      },
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input data', details: error.errors });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Google OAuth routes
router.get('/google', (req: any, res: any, next: any) => {
  // Check if Google strategy is available
  if (!(passport as any)._strategy('google')) {
    return res.status(500).json({ 
      error: 'Google OAuth not configured', 
      details: 'Google OAuth strategy not initialized' 
    });
  }
  
  // Preserve mobile parameter using OAuth state
  const isMobile = req.query.mobile === 'true' || req.headers['user-agent']?.includes('nutritrack-mobile');
  const state = isMobile ? 'mobile=true' : 'web=true';
  
  console.log(`🔄 OAuth initiated - Mobile: ${isMobile}, State: ${state}, User-Agent: ${req.headers['user-agent']}`);
  
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    state: state
  })(req, res, next);
});

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  async (req: any, res: any) => {
    try {
      const user = req.user as any;
      
      // Extract mobile flag from OAuth state parameter
      const state = req.query.state as string;
      const isMobile = state?.includes('mobile=true') || req.headers['user-agent']?.includes('nutritrack-mobile');
      
      console.log(`📱 OAuth callback - Mobile: ${isMobile}, State: ${state}, User-Agent: ${req.headers['user-agent']}`);
      
      if (!user) {
        console.log('❌ OAuth failed - no user returned');
        if (isMobile) {
          return res.redirect('nutritrack://auth/callback?error=oauth_failed');
        } else {
          return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`);
        }
      }

      // Generate JWT token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        name: user.name
      });

      // Create session record
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

      await prisma.session.create({
        data: {
          userId: user.id,
          token,
          expiresAt
        }
      });

      if (isMobile) {
        // Redirect to mobile app with custom URL scheme
        console.log(`✅ Redirecting mobile user to: nutritrack://auth/callback?token=${token.substring(0, 20)}...`);
        res.redirect(`nutritrack://auth/callback?token=${token}`);
      } else {
        // Redirect to web frontend
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        console.log(`✅ Redirecting web user to: ${frontendUrl}/auth/callback`);
        res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
      }
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      
      // Extract mobile flag from OAuth state parameter for error handling
      const state = req.query.state as string;
      const isMobile = state?.includes('mobile=true') || req.headers['user-agent']?.includes('nutritrack-mobile');
      
      if (isMobile) {
        res.redirect('nutritrack://auth/callback?error=oauth_failed');
      } else {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/login?error=oauth_failed`);
      }
    }
  }
);

// Get current user
router.get('/me', authenticateToken, async (req: any, res: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: {
        userPreferences: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      provider: user.provider,
      emailVerified: user.emailVerified,
      preferences: user.userPreferences[0] || null
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout
router.post('/logout', authenticateToken, async (req: any, res: any) => {
  try {
    const token = req.headers.authorization?.substring(7);
    
    if (token) {
      // Delete session from database
      await prisma.session.deleteMany({
        where: { 
          userId: req.user!.userId,
          token: token 
        }
      });
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Development-only quick login (when NODE_ENV !== 'production')
if (process.env.NODE_ENV !== 'production') {
  router.post('/dev-login', async (req: any, res: any) => {
    try {
      // Create or find a test user
      let user = await prisma.user.findUnique({
        where: { email: 'test@nutritrack.dev' }
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: 'test@nutritrack.dev',
            name: 'Test User',
            provider: 'email',
            emailVerified: true,
            passwordHash: await bcrypt.hash('password123', 12)
          }
        });

        // Create default preferences
        await prisma.userPreference.create({
          data: {
            userId: user.id,
            avoidPeriodDays: 7,
            dietaryRestrictions: []
          }
        });
      }

      // Generate token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        name: user.name
      });

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          provider: user.provider,
          emailVerified: user.emailVerified
        },
        token
      });
    } catch (error) {
      console.error('Dev login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}


export default router;