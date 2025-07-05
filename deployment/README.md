# NutriTrack Production Deployment

This directory contains the production deployment configuration for NutriTrack application.

## Server Setup

### Prerequisites

Make sure your Ubuntu server has:
- Docker installed
- docker-compose installed
- git installed
- Internet connection

### Directory Structure

```
/root/nutritrack/
├── deployment/              # This directory (deployment configs)
│   ├── docker-compose.yml   # Docker services configuration
│   ├── Dockerfile.backend   # Backend container definition
│   ├── Dockerfile.frontend  # Frontend container definition
│   ├── nginx.conf          # Nginx configuration
│   ├── deploy.sh           # Full deployment script
│   ├── update.sh           # Quick update script
│   └── README.md           # This file
└── nutritrack/             # Cloned repository (created automatically)
    ├── backend/
    ├── frontend/
    └── ...
```

## Deployment Instructions

### 1. Initial Setup

Transfer the deployment directory to your server:

```bash
# From your local machine
scp -r deployment/ root@85.25.198.116:/root/nutritrack/
```

### 2. SSH into your server

```bash
ssh root@85.25.198.116
```

### 3. Navigate to deployment directory

```bash
cd /root/nutritrack
```

### 4. Make scripts executable

```bash
chmod +x deploy.sh update.sh
```

### 5. Run initial deployment

```bash
./deploy.sh
```

This will:
- Clone the repository from GitHub
- Build Docker images
- Start all services (database, backend, frontend)
- Run health checks

## Development Workflow

### Making Updates

1. **Push changes to GitHub** (from your development machine)
2. **Update production** (on your server):
   ```bash
   cd /root/nutritrack
   ./update.sh
   ```

The update script will:
- Pull latest changes from GitHub
- Rebuild containers with new code
- Restart services

### Manual Commands

```bash
# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop all services
docker-compose down

# Start services
docker-compose up -d

# Restart specific service
docker-compose restart backend

# Check service status
docker-compose ps

# Access database
docker exec -it nutritrack-db psql -U nutritrack -d nutrition_db
```

## Access Points

- **Frontend**: `http://85.25.198.116:8888`
- **Backend API**: `http://85.25.198.116:3001`
- **Health Check**: `http://85.25.198.116:3001/health`

## Troubleshooting

### Services won't start
```bash
# Check logs
docker-compose logs

# Check system resources
df -h  # disk space
free -h  # memory
```

### Database issues
```bash
# Reset database (WARNING: loses all data)
docker-compose down
docker volume rm nutritrack-deploy_postgres_data
docker-compose up -d
```

### Frontend not loading
```bash
# Check if backend is running
curl http://localhost:3001/health

# Rebuild frontend
docker-compose up -d --build frontend
```

## Security Notes

- Database is only accessible from within Docker network
- Frontend serves on port 80 (HTTP)
- Backend API serves on port 3001
- For production, consider:
  - Setting up SSL/HTTPS
  - Using environment variables for secrets
  - Setting up firewall rules
  - Regular backups of database

## Environment Variables

The deployment uses these default values:
- Database: `postgresql://nutritrack:nutritrack123@postgres:5432/nutrition_db`
- Node Environment: `production`
- Backend Port: `3001`

To customize, modify the `docker-compose.yml` file.

## Backup

```bash
# Backup database
docker exec nutritrack-db pg_dump -U nutritrack nutrition_db > backup.sql

# Restore database
docker exec -i nutritrack-db psql -U nutritrack -d nutrition_db < backup.sql
```