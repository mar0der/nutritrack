#!/bin/bash

# NutriTrack Update Script
# Usage: ./update.sh

set -e

echo "🔄 Updating NutriTrack application..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Pull latest changes from git
echo -e "${YELLOW}Pulling latest changes from git...${NC}"
git pull origin main

# Stop services
echo -e "${YELLOW}Stopping services...${NC}"
docker-compose down

# Rebuild images
echo -e "${YELLOW}Rebuilding images...${NC}"
docker-compose build --no-cache

# Start services
echo -e "${YELLOW}Starting services...${NC}"
docker-compose up -d

# Wait for services to be ready
echo -e "${YELLOW}Waiting for services to be ready...${NC}"
sleep 10

# Run database migrations
echo -e "${YELLOW}Running database migrations...${NC}"
docker-compose exec api npx prisma migrate deploy

echo -e "${GREEN}Update completed successfully!${NC}"
echo -e "${GREEN}Services are running at:${NC}"
echo -e "  - Web: http://78.47.123.191"
echo -e "  - API: http://78.47.123.191:3001"