#!/bin/bash

# Docker-based Let's Encrypt setup script

set -e

if [ -z "$1" ]; then
    echo "❌ Error: Domain name is required"
    echo "Usage: $0 <domain-name> [email]"
    echo "Example: $0 nutritrackapi.duckdns.org admin@example.com"
    exit 1
fi

DOMAIN=$1
EMAIL=${2:-"admin@$DOMAIN"}

echo "🔐 Setting up Let's Encrypt for Docker deployment..."
echo "🌐 Domain: $DOMAIN"
echo "📧 Email: $EMAIL"

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down || true

# Create directories for Let's Encrypt
echo "📁 Creating Let's Encrypt directories..."
mkdir -p letsencrypt/live
mkdir -p letsencrypt/archive
mkdir -p certbot-webroot

# Create temporary nginx config for certificate generation
echo "🔧 Creating temporary nginx config for ACME challenge..."
cat > nginx-temp.conf << EOF
server {
    listen 80;
    server_name $DOMAIN;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
        try_files \$uri \$uri/ =404;
    }
    
    location / {
        return 200 'Hello from $DOMAIN - Ready for Let\'s Encrypt!';
        add_header Content-Type text/plain;
    }
}
EOF

# Create temporary docker-compose for certificate generation
echo "🐳 Creating temporary Docker setup for certificate generation..."
cat > docker-compose-temp.yml << EOF
version: '3.8'
services:
  nginx-temp:
    image: nginx:alpine
    container_name: nginx-temp
    ports:
      - "80:80"
    volumes:
      - ./nginx-temp.conf:/etc/nginx/conf.d/default.conf:ro
      - ./certbot-webroot:/var/www/certbot:ro
    restart: unless-stopped
    
  certbot:
    image: certbot/certbot:latest
    container_name: certbot-temp
    volumes:
      - ./letsencrypt:/etc/letsencrypt
      - ./certbot-webroot:/var/www/certbot
    depends_on:
      - nginx-temp
    command: >
      certonly --webroot
      --webroot-path=/var/www/certbot
      --email $EMAIL
      --agree-tos
      --no-eff-email
      --force-renewal
      --non-interactive
      -d $DOMAIN
EOF

# Start temporary nginx for ACME challenge
echo "🚀 Starting temporary nginx for ACME challenge..."
docker-compose -f docker-compose-temp.yml up -d nginx-temp

# Wait for nginx to be ready
echo "⏳ Waiting for nginx to be ready..."
sleep 10

# Test if domain is accessible
echo "🔍 Testing domain accessibility..."
if curl -f "http://$DOMAIN/" --max-time 30; then
    echo "✅ Domain is accessible!"
else
    echo "❌ Domain is not accessible. Please check:"
    echo "   - DNS: $DOMAIN points to this server"
    echo "   - Firewall: Port 80 is open"
    echo "   - Network: No other services blocking port 80"
    docker-compose -f docker-compose-temp.yml down
    exit 1
fi

# Generate Let's Encrypt certificate
echo "🔒 Generating Let's Encrypt certificate..."
docker-compose -f docker-compose-temp.yml run --rm certbot

# Check if certificate was generated
if [ -f "letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo "✅ Certificate generated successfully!"
    
    # Copy certificates to ssl directory for backward compatibility
    mkdir -p ssl
    cp "letsencrypt/live/$DOMAIN/fullchain.pem" ssl/server.crt
    cp "letsencrypt/live/$DOMAIN/privkey.pem" ssl/server.key
    chmod 644 ssl/server.crt
    chmod 600 ssl/server.key
    
    echo "📁 Certificates copied to ssl/ directory"
    
    # Create production nginx config
    echo "🔧 Creating production nginx config..."
    cat > nginx-production.conf << EOF
# HTTP server - redirect to HTTPS and handle Let's Encrypt challenges
server {
    listen 80;
    server_name $DOMAIN;
    
    # Let's Encrypt challenge location
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
        try_files \$uri \$uri/ =404;
    }
    
    # Redirect all other HTTP requests to HTTPS
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

# HTTPS server with Let's Encrypt certificates
server {
    listen 443 ssl http2;
    server_name $DOMAIN;
    
    # Let's Encrypt SSL configuration
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # SSL security settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:50m;
    ssl_session_timeout 1d;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    root /usr/share/nginx/html;
    index index.html;
    
    # Handle client-side routing
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # API proxy to backend
    location /api/ {
        proxy_pass http://api:3001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$host;
        proxy_set_header X-Forwarded-Port \$server_port;
    }
    
    # Health check proxy
    location /health {
        proxy_pass http://api:3001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

    # Create production docker-compose with Let's Encrypt
    echo "🐳 Creating production Docker Compose with Let's Encrypt..."
    cat > docker-compose-production.yml << EOF
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    container_name: nutritrack-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: nutrition_db
      POSTGRES_USER: nutritrack
      POSTGRES_PASSWORD: \${DB_PASSWORD:-nutritrack123}
    volumes:
      - db_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - nutritrack
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U nutritrack -d nutrition_db"]
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    build: 
      context: ../backend
      dockerfile: ../deployment/Dockerfile.backend
    container_name: nutritrack-api
    restart: unless-stopped
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://nutritrack:\${DB_PASSWORD:-nutritrack123}@db:5432/nutrition_db
      PORT: 3001
    ports:
      - "3001:3001"
    depends_on:
      db:
        condition: service_healthy
    networks:
      - nutritrack
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  web:
    build:
      context: ../frontend
      dockerfile: ../deployment/Dockerfile.frontend
    container_name: nutritrack-web
    restart: unless-stopped
    environment:
      VITE_API_URL: \${VITE_API_URL:-/api}
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - api
    networks:
      - nutritrack
    volumes:
      - ./nginx-production.conf:/etc/nginx/conf.d/default.conf:ro
      - ./letsencrypt:/etc/letsencrypt:ro
      - ./certbot-webroot:/var/www/certbot:ro
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Certbot for automatic certificate renewal
  certbot:
    image: certbot/certbot:latest
    container_name: nutritrack-certbot
    volumes:
      - ./letsencrypt:/etc/letsencrypt
      - ./certbot-webroot:/var/www/certbot
    depends_on:
      - web
    command: >
      sh -c "
        trap exit TERM;
        while :; do
          sleep 12h & wait \$!;
          echo 'Checking for certificate renewal...';
          certbot renew --webroot --webroot-path=/var/www/certbot --quiet;
          if [ \$? -eq 0 ]; then
            echo 'Certificate renewed, restarting nginx...';
            docker-compose restart web;
          fi;
        done
      "

networks:
  nutritrack:
    driver: bridge
    name: nutritrack

volumes:
  db_data:
    driver: local
EOF

    # Stop temporary containers
    echo "🛑 Stopping temporary containers..."
    docker-compose -f docker-compose-temp.yml down
    
    # Clean up temporary files
    rm -f docker-compose-temp.yml nginx-temp.conf
    
    echo "🎉 Let's Encrypt setup complete!"
    echo "📋 Next steps:"
    echo "   1. Set environment variables:"
    echo "      export DOMAIN_NAME=$DOMAIN"
    echo "      export DB_PASSWORD=your-secure-password"
    echo "   2. Start production services:"
    echo "      docker-compose -f docker-compose-production.yml up -d --build"
    echo "   3. Test HTTPS access:"
    echo "      curl -I https://$DOMAIN/"
    echo
    echo "🔄 Certificate will automatically renew every 12 hours"
    echo "📁 Files created:"
    echo "   - nginx-production.conf (production nginx config)"
    echo "   - docker-compose-production.yml (production docker-compose)"
    echo "   - letsencrypt/ (certificate directory)"
    echo "   - ssl/ (backward compatibility certificates)"
    
else
    echo "❌ Certificate generation failed!"
    echo "📋 Check the logs above for specific error messages"
    docker-compose -f docker-compose-temp.yml down
    exit 1
fi