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
  console.log('🔍 Google OAuth initiation requested');
  console.log('🔍 Environment check:', {
    NODE_ENV: process.env.NODE_ENV,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'MISSING',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING'
  });
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback',
  (req: any, res: any, next: any) => {
    console.log('🔍 Google OAuth callback received');
    passport.authenticate('google', { session: false }, (err: any, user: any, info: any) => {
      console.log('🔍 Passport authenticate result:', { err: err?.message, user: user?.email, info });
      if (err) {
        console.error('🚨 Google OAuth error:', err);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        return res.redirect(`${frontendUrl}/login?error=oauth_error`);
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  async (req: any, res: any) => {
    try {
      const user = req.user as any;
      console.log('🔍 Processing OAuth callback for user:', user?.email);
      
      if (!user) {
        console.log('🚨 No user found in OAuth callback');
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`);
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

      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/login?error=oauth_failed`);
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

// Debug endpoint to check OAuth configuration
router.get('/debug/oauth', (req: any, res: any) => {
  const hasGoogleClientId = !!process.env.GOOGLE_CLIENT_ID;
  const hasGoogleClientSecret = !!process.env.GOOGLE_CLIENT_SECRET;
  const strategies = passport._strategies || {};
  
  res.json({
    environment: process.env.NODE_ENV,
    oauth: {
      googleClientId: hasGoogleClientId,
      googleClientSecret: hasGoogleClientSecret,
      strategies: Object.keys(strategies)
    }
  });
});

export default router;