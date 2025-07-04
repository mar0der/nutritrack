# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack nutrition tracking application that helps users maintain dietary variety by tracking ingredients and providing smart dish recommendations. The app consists of a separated frontend and backend architecture.

## Project Structure

```
/
├── backend/          # Node.js/Express API server
│   ├── src/
│   │   ├── routes/   # API endpoints
│   │   ├── lib/      # Database client (Prisma)
│   │   ├── types/    # Type definitions and validation
│   │   └── app.ts    # Express app setup
│   └── prisma/       # Database schema and migrations
└── frontend/         # React TypeScript app
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── pages/      # Page components
    │   ├── services/   # API client
    │   └── types/      # Type definitions
    └── public/
```

## Complete Setup Summary (Session Results)

### ✅ What Was Successfully Implemented

#### Backend Setup
1. **PostgreSQL Installation**: Installed PostgreSQL 15 via Homebrew on macOS
2. **Database Configuration**: Created `nutrition_db` database and configured connection
3. **Node.js/Express API**: Complete REST API with TypeScript
4. **Prisma ORM**: Database schema with migrations for ingredients, dishes, consumption logs
5. **Route Handlers**: Full CRUD operations for all entities
6. **Smart Recommendation Engine**: Algorithm for suggesting dishes based on ingredient freshness
7. **Running Status**: Backend successfully running on http://localhost:3001

#### Frontend Setup
1. **React + TypeScript + Vite**: Modern frontend framework setup
2. **TailwindCSS**: Styling framework (v3.4.14 for compatibility)
3. **Component Architecture**: Layout, pages, and navigation components
4. **Modern UI Design**: Professional interface with gradients, animations, and glass-morphism
5. **Navigation**: Responsive navigation with emoji icons and mobile menu
6. **State Management**: TanStack Query for API integration

#### Database Schema
- **Ingredients**: Name, category, nutritional info with unique constraints
- **Dishes**: Recipe management with ingredient relationships
- **DishIngredients**: Many-to-many relationship with quantities
- **ConsumptionLog**: Track what was eaten and when
- **UserPreferences**: Settings for recommendation periods

### 🔧 Technical Issues Resolved

#### Backend Issues Fixed
1. **TypeScript Compilation**: Fixed strict typing errors by using `any` types for Express handlers
2. **Prisma Integration**: Resolved JSON field handling and optional properties
3. **Database Migration**: Successfully created and applied initial schema
4. **API Testing**: Confirmed all endpoints working via curl

#### Frontend Issues Encountered (Still In Progress)
1. **TailwindCSS Compatibility**: Resolved v4 → v3 downgrade
2. **PostCSS Configuration**: Fixed plugin configuration multiple times
3. **CSS Class Compatibility**: Converted modern syntax to v3 compatible classes
4. **Build Errors**: Resolved TypeScript import issues

### 🚀 Current Status

#### ✅ Working Components
- **Backend API**: Fully operational on port 3001
- **Database**: PostgreSQL running with complete schema
- **API Endpoints**: All CRUD operations functional
- **Health Check**: http://localhost:3001/health returns OK

#### ⚠️ Known Issues
- **Frontend Styling**: TailwindCSS not loading properly despite multiple fixes
- **Visual Design**: Interface shows HTML structure but no CSS styling
- **CSS Compilation**: May need further debugging of Tailwind processing

## Development Commands

### Backend
```bash
cd backend
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start           # Start production server
npm run db:generate # Generate Prisma client
npm run db:migrate  # Run database migrations
npm run db:studio   # Open Prisma Studio database GUI
```

### Frontend
```bash
cd frontend
npm run dev         # Start development server (port 5173)
npm run build       # Build for production
npm run preview     # Preview production build
```

### Database Setup (Completed)
1. ✅ PostgreSQL 15 installed via Homebrew
2. ✅ Database `nutrition_db` created
3. ✅ Environment variables configured in `backend/.env`
4. ✅ Prisma migrations applied successfully

## Architecture

### Backend (Port 3001) ✅ WORKING
- **Framework**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **API**: RESTful endpoints for ingredients, dishes, consumption tracking, and recommendations
- **Validation**: Zod schemas for request/response validation
- **Core Models**: Ingredient, Dish, DishIngredient, ConsumptionLog, UserPreference

### Frontend (Port 5173) ⚠️ STYLING ISSUES
- **Framework**: React 18 + TypeScript + Vite
- **State Management**: TanStack Query for server state
- **Styling**: Tailwind CSS v3.4.14 (needs debugging)
- **Routing**: React Router
- **HTTP Client**: Axios with interceptors

### Key Features Implemented
1. **Ingredient Management**: Complete CRUD API
2. **Dish Builder**: Create dishes with ingredient relationships
3. **Consumption Tracking**: Log meals with timestamps
4. **Smart Recommendations**: Freshness-based suggestion algorithm
5. **Modern UI Components**: Professional design (styling pending)

### API Endpoints (All Working)
- `GET /api/ingredients` - List ingredients with search/filter
- `POST /api/ingredients` - Create new ingredient
- `GET /api/dishes` - List dishes with ingredients
- `POST /api/dishes` - Create new dish
- `GET /api/consumption` - Get consumption logs
- `POST /api/consumption` - Log consumption
- `GET /api/recommendations` - Get dish recommendations based on freshness

### Recommendation Algorithm (Implemented)
The smart recommendation system scores dishes based on ingredient freshness:
- Tracks recently consumed ingredients (configurable period)
- Calculates freshness score: (fresh ingredients) / (total ingredients)
- Prioritizes dishes with higher freshness scores
- Provides explanations for recommendations

## Next Steps for Frontend Styling Issue

The frontend needs TailwindCSS debugging to resolve styling not loading:
1. Check browser console for CSS compilation errors
2. Verify PostCSS configuration
3. Ensure Tailwind directives are being processed
4. Test with simpler CSS setup if needed
5. Consider alternative CSS framework if TailwindCSS continues to have issues

## Quick Start Commands

### Start Both Servers
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

Then access:
- **Backend API**: http://localhost:3001
- **Frontend App**: http://localhost:5173 (styling issues to be resolved)