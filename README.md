# NutriTrack - Smart Nutrition Tracking App

A full-stack nutrition tracking application that helps users maintain dietary variety by tracking ingredients and providing smart dish recommendations.

## Features

- 🥕 **Ingredient Management**: Track ingredients with detailed nutritional information
- 🍽️ **Dish Creation**: Build recipes with ingredient relationships
- 📊 **Consumption Logging**: Log meals with timestamps
- ✨ **Smart Recommendations**: Get AI-powered suggestions based on ingredient freshness
- 🎨 **Modern UI**: Beautiful interface with TailwindCSS styling

## Tech Stack

### Backend
- Node.js + Express + TypeScript
- PostgreSQL with Prisma ORM
- RESTful API design
- Smart recommendation algorithm

### Frontend
- React 18 + TypeScript + Vite
- TailwindCSS for styling
- TanStack Query for state management
- React Router for navigation

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/mar0der/nutritrack.git
cd nutritrack
```

2. Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Set up the database
```bash
# Create PostgreSQL database
createdb nutrition_db

# Set up environment variables
cd backend
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npm run db:migrate

# Seed with mock data
npx ts-node scripts/seed-database.ts
```

4. Start the development servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

5. Open your browser
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## API Endpoints

- `GET /api/ingredients` - List ingredients with search/filter
- `POST /api/ingredients` - Create new ingredient
- `GET /api/dishes` - List dishes with ingredients
- `POST /api/dishes` - Create new dish
- `GET /api/consumption` - Get consumption logs
- `POST /api/consumption` - Log consumption
- `GET /api/recommendations` - Get smart dish recommendations

## Smart Recommendation Algorithm

The app uses a freshness-based scoring system:
- Tracks recently consumed ingredients (configurable period)
- Calculates freshness score: (fresh ingredients) / (total ingredients)
- Prioritizes dishes with higher freshness scores
- Provides explanations for recommendations

## Project Structure

```
/
├── backend/          # Node.js/Express API server
│   ├── src/
│   │   ├── routes/   # API endpoints
│   │   ├── lib/      # Database client (Prisma)
│   │   ├── types/    # Type definitions
│   │   └── app.ts    # Express app setup
│   ├── prisma/       # Database schema and migrations
│   └── scripts/      # Database seeding scripts
├── frontend/         # React TypeScript app
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API client
│   │   └── types/      # Type definitions
│   └── public/
└── screenshots/      # App screenshots
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with modern web technologies
- Designed for nutritional variety and health
- Powered by smart recommendation algorithms