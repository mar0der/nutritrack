import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Google OAuth Strategy
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL = process.env.NODE_ENV === 'production' 
  ? `https://nerdstips.com/api/auth/google/callback`
  : 'http://localhost:3001/api/auth/google/callback';

if (googleClientId && googleClientSecret) {
  passport.use(new GoogleStrategy({
    clientID: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL: callbackURL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: profile.emails?.[0]?.value || '' },
            { providerId: profile.id, provider: 'google' }
          ]
        }
      });

      if (user) {
        // Update existing user with Google info if not already linked
        if (user.provider !== 'google') {
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              provider: 'google',
              providerId: profile.id,
              avatar: profile.photos?.[0]?.value,
              emailVerified: true
            }
          });
        }
      } else {
        // Create new user
        user = await prisma.user.create({
          data: {
            email: profile.emails?.[0]?.value || '',
            name: profile.displayName || '',
            avatar: profile.photos?.[0]?.value,
            provider: 'google',
            providerId: profile.id,
            emailVerified: true
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
      }

      return done(null, user);
    } catch (error) {
      return done(error, undefined);
    }
  }));
}

// JWT Strategy
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
}, async (payload, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    });
    
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
}));

// Serialize/deserialize user for session management
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;