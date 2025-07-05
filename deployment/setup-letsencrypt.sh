#!/bin/bash

# Setup Let's Encrypt SSL certificates with Certbot

echo "🔐 Setting up Let's Encrypt SSL certificates..."

# Check if domain is provided
if [ -z "$1" ]; then
    echo "❌ Error: Domain name is required"
    echo "Usage: $0 <domain-name>"
    echo "Example: $0 nutritrack.example.com"
    exit 1
fi

DOMAIN=$1
EMAIL=${2:-"admin@$DOMAIN"}

echo "🌐 Domain: $DOMAIN"
echo "📧 Email: $EMAIL"

# Install Certbot and nginx plugin
echo "📦 Installing Certbot..."
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# Create nginx configuration for HTTP challenge
echo "🔧 Creating temporary nginx config for certificate generation..."
sudo tee /etc/nginx/sites-available/nutritrack-temp > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/nutritrack-temp /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Create webroot directory
sudo mkdir -p /var/www/certbot

# Generate certificates
echo "🔒 Generating Let's Encrypt certificates..."
sudo certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    -d $DOMAIN

# Check if certificates were generated
if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo "✅ Certificates generated successfully!"
    
    # Create SSL directory and copy certificates
    mkdir -p ssl
    sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ssl/server.crt
    sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ssl/server.key
    sudo chown $USER:$USER ssl/server.crt ssl/server.key
    sudo chmod 644 ssl/server.crt
    sudo chmod 600 ssl/server.key
    
    echo "📁 Certificates copied to ssl/ directory"
    
    # Setup automatic renewal
    echo "🔄 Setting up automatic renewal..."
    sudo tee /etc/systemd/system/certbot-renewal.service > /dev/null <<EOF
[Unit]
Description=Certbot Renewal
After=network.target

[Service]
Type=oneshot
ExecStart=/usr/bin/certbot renew --quiet --deploy-hook "systemctl reload nginx && docker-compose -f /var/www/nutritrack/deployment/docker-compose.yml restart web"
EOF

    sudo tee /etc/systemd/system/certbot-renewal.timer > /dev/null <<EOF
[Unit]
Description=Timer for Certbot Renewal
Requires=certbot-renewal.service

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
EOF

    sudo systemctl daemon-reload
    sudo systemctl enable certbot-renewal.timer
    sudo systemctl start certbot-renewal.timer
    
    echo "⏰ Automatic renewal configured (daily check)"
    
    # Remove temporary nginx config
    sudo rm -f /etc/nginx/sites-enabled/nutritrack-temp
    sudo rm -f /etc/nginx/sites-available/nutritrack-temp
    
    echo "🎉 Let's Encrypt setup complete!"
    echo "📋 Next steps:"
    echo "   1. Update your DNS to point $DOMAIN to this server"
    echo "   2. Set DOMAIN_NAME environment variable in GitHub secrets"
    echo "   3. Deploy with: git push origin main"
    
else
    echo "❌ Certificate generation failed!"
    echo "Make sure:"
    echo "   - Domain $DOMAIN points to this server"
    echo "   - Port 80 is open and accessible"
    echo "   - No other services are blocking port 80"
    exit 1
fi