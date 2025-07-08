# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
NutriTrack is a full-stack nutrition tracking application designed to help users maintain dietary variety by tracking ingredients and providing smart dish recommendations to promote a balanced diet. The application features a separated frontend and backend architecture, enabling scalability and compatibility with future mobile applications. The core functionality includes tracking ingredients and providing smart dish recommendations. The application is currently fully functional, with a complete authentication system and production deployment.

## Completed OAuth Setup Tasks
- ✅ Fixed GitHub Actions secrets naming (_PROD suffix)
- ✅ Resolved SSH HEREDOC environment variable issues
- ✅ Configured API subdomain (api.nerdstips.com/v1)
- ✅ Generated SSL certificates for all domains (Buypass CA)
- ✅ Fixed frontend/backend API endpoint routing (/api vs /v1)
- ✅ Resolved CORS duplicate headers (removed Nginx CORS, kept Express CORS)
- ✅ Fixed OAuth race condition (App.tsx vs callback page initializeAuth)
- ✅ Removed debug logging messages
- ✅ OAuth flow working: nerdstips.com → api.nerdstips.com/v1 → Google → callback → home

## Commands

### Backend Development
```bash
# Development server
cd backend && npm run dev

# Build TypeScript
cd backend && npm run build

# Production server
cd backend && npm start

# Database operations
cd backend && npm run db:generate    # Generate Prisma client
cd backend && npm run db:migrate     # Run migrations
cd backend && npm run db:studio      # Open Prisma Studio

# Database seeding
cd backend && npm run seed           # Seed with sample data
cd backend && npm run seed:reset     # Reset and re-seed database
```

### Frontend Development
```bash
# Development server
cd frontend && npm run dev

# Build for production
cd frontend && npm run build

# Lint code
cd frontend && npm run lint

# Preview production build
cd frontend && npm run preview
```

### Docker Development
```bash
# Development environment (from deployment/ folder)
docker-compose -f docker-compose-dev.yml up -d --build

# Production environment (from deployment/ folder)
docker-compose -f docker-compose-prod.yml up -d --build

# Stop and remove containers
docker-compose -f docker-compose-dev.yml down
docker-compose -f docker-compose-prod.yml down
```

### Full Stack Development
```bash
# Build entire application
npm run build

# Start production server
npm start

# Development mode
npm run dev
```

## Architecture

### Database Schema (Prisma)
- **Users**: Authentication with email/password and Google OAuth support
- **Ingredients**: Nutritional components with categories and nutritional info
- **Dishes**: Recipes composed of multiple ingredients with quantities
- **ConsumptionLog**: Tracks when users consume ingredients or dishes
- **Sessions**: JWT-based authentication sessions
- **UserPreferences**: Dietary restrictions and recommendation settings

### Backend (Node.js + Express + TypeScript)
- **Routes**: Modular API endpoints in `/backend/src/routes/`
  - `auth.ts`: Authentication (login, signup, OAuth)
  - `ingredients.ts`: CRUD operations for ingredients
  - `dishes.ts`: CRUD operations for dishes
  - `consumption.ts`: Logging and retrieving consumption data
  - `recommendations.ts`: Smart dish recommendations algorithm
- **Middleware**: Authentication, CORS, security headers
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens + Passport.js for Google OAuth

### Frontend (React + TypeScript + Vite)
- **State Management**: Zustand for auth state, TanStack Query for server state
- **Routing**: React Router with protected routes
- **Styling**: TailwindCSS with Headless UI components
- **API Client**: Axios with centralized API service

### Smart Recommendation Algorithm
The recommendation system calculates a "freshness score" for each dish:
- Tracks recently consumed ingredients (default: 7 days)
- Score = (fresh ingredients) / (total ingredients in dish)
- Prioritizes dishes with higher freshness scores
- Provides explanations for recommendations

## Key Files
- `backend/prisma/schema.prisma`: Database schema definition
- `backend/src/app.ts`: Express application setup
- `frontend/src/services/api.ts`: API client configuration
- `frontend/src/stores/authStore.ts`: Authentication state management
- `API_DOCUMENTATION.md`: Complete API reference

## Environment Setup
- Node.js 18+
- PostgreSQL database
- Environment variables in `backend/.env`
- Frontend connects to backend at `http://localhost:3001` (dev) or production domain

## Authentication Flow
1. Email/password registration with bcrypt hashing
2. Google OAuth integration via Passport.js
3. JWT tokens for session management
4. Protected routes on both frontend and backend

## Production Deployment
- **Domain**: nerdstips.com (production), localhost (development)
- **API Subdomain**: api.nerdstips.com/v1 (production API endpoint)
- **Server IP**: 78.47.123.191
- **Server Path**: /var/www/nutritrack
- **SSL**: Buypass certificates for nerdstips.com, www.nerdstips.com, api.nerdstips.com
- **CI/CD**: GitHub Actions with automated deployment
- **Repository**: https://github.com/mar0der/nutritrack.git
- **Access**: Root server access available for deployment verification
- **Deployment Config**: Uses deployment/ folder with Docker Compose, Nginx, and SSL setup
- **OAuth URLs**: Google Console redirect URI: https://api.nerdstips.com/v1/auth/google/callback | Authorized origins: https://nerdstips.com, https://www.nerdstips.com
- **Environment Variables**: VITE_API_URL=https://api.nerdstips.com/v1 | GitHub secrets: GOOGLE_CLIENT_ID_PROD, GOOGLE_CLIENT_SECRET_PROD | FRONTEND_URL=https://nerdstips.com

### Docker Compose Configuration
- **Development**: `deployment/docker-compose-dev.yml` - includes all services with development settings
- **Production**: `deployment/docker-compose-prod.yml` - optimized for production with Let's Encrypt SSL
- **Note**: No generic `docker-compose.yml` file exists to avoid confusion
- **Deployment**: GitHub Actions copies `docker-compose-prod.yml` to `docker-compose.yml` during deployment

### Port Configuration
- Backend API: Port 3001
- Frontend: Port 5173 (development), Port 80/443 (production)
- Database: PostgreSQL default port 5432

### GitHub Actions Workflow
- Automated deployment on push to main branch
- Uses GitHub secrets for secure deployment
- Workflow token stored in .env file (GITHUB_TOKEN)

## Planned Development Phases

### Phase 2: Authentication & Security (Completed)
- ✅ JWT authentication system implemented
- ✅ User registration and login functionality
- ✅ Secured API endpoints with middleware
- ✅ Google OAuth integration with API subdomain
- ✅ CORS configuration fixed (Express handles CORS, not Nginx)
- ✅ OAuth race condition resolved (App.tsx doesn't call initializeAuth on callback page)
- 🔄 Password reset functionality (pending)
- 🔄 Role-based access control (pending)

### Phase 3: Mobile App Development (Planned)
- Complete Flutter app development for iOS and Android
- Implement offline-first architecture for mobile app
- Add photo integration for recipes
- Integrate with device health apps
- Submit app to App Store and Google Play

### Phase 4: Advanced Features (Planned)
- Develop AI-powered meal planning
- Implement barcode scanning for ingredients
- Add social features and recipe sharing
- Provide advanced analytics and insights
- Enable export functionality for PDF reports and CSV files