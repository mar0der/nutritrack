#!/bin/bash

# NutriTrack Deployment Script for Ubuntu 24
# Usage: ./deploy.sh

set -e

echo "🚀 Starting NutriTrack deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root or with sudo
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}Don't run this script as root!${NC}"
   exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Check if required environment variables are set
if [ -z "$DB_PASSWORD" ]; then
    echo -e "${YELLOW}Warning: DB_PASSWORD environment variable not set. Using default password.${NC}"
    export DB_PASSWORD="nutritrack123"
fi

if [ -z "$VITE_API_URL" ]; then
    echo -e "${YELLOW}Warning: VITE_API_URL not set. Using localhost.${NC}"
    export VITE_API_URL="http://localhost:3001"
fi

# Create SSL directory if it doesn't exist
mkdir -p ssl

# Create logs directory
mkdir -p logs

# Stop existing containers
echo -e "${YELLOW}Stopping existing containers...${NC}"
docker-compose down --remove-orphans

# Pull latest images
echo -e "${YELLOW}Pulling latest base images...${NC}"
docker-compose pull

# Build and start services
echo -e "${YELLOW}Building and starting services...${NC}"
docker-compose up -d --build

# Wait for services to be ready
echo -e "${YELLOW}Waiting for services to be ready...${NC}"
sleep 10

# Check if services are running
echo -e "${YELLOW}Checking service status...${NC}"
docker-compose ps

# Run database migrations
echo -e "${YELLOW}Running database migrations...${NC}"
docker-compose exec api npx prisma migrate deploy

# Seed database if needed
echo -e "${YELLOW}Seeding database...${NC}"
docker-compose exec api npm run seed 2>/dev/null || echo "Seeding skipped (already exists)"

# Show logs
echo -e "${GREEN}Deployment completed!${NC}"
echo -e "${GREEN}Services are running:${NC}"
echo -e "  - Web: http://78.47.123.191"
echo -e "  - API: http://78.47.123.191:3001"
echo -e "  - Database: 78.47.123.191:5432"
echo ""
echo -e "${YELLOW}To view logs:${NC}"
echo -e "  docker-compose logs -f"
echo ""
echo -e "${YELLOW}To stop services:${NC}"
echo -e "  docker-compose down"
echo ""
echo -e "${YELLOW}To restart services:${NC}"
echo -e "  docker-compose restart"