#!/bin/bash

# Test HTTPS setup locally

echo "🔒 Testing HTTPS configuration..."

# Generate SSL certificates if they don't exist
if [ ! -f "ssl/server.crt" ] || [ ! -f "ssl/server.key" ]; then
    echo "📄 SSL certificates not found. Generating..."
    ./generate-ssl.sh
fi

# Start the services
echo "🚀 Starting services with HTTPS..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 15

# Test HTTP redirect
echo "🔄 Testing HTTP to HTTPS redirect..."
curl -I -s -o /dev/null -w "%{http_code}" http://localhost/ || echo "❌ HTTP redirect test failed"

# Test HTTPS frontend
echo "🌐 Testing HTTPS frontend..."
curl -k -s -o /dev/null -w "%{http_code}" https://localhost/ || echo "❌ HTTPS frontend test failed"

# Test HTTPS API
echo "🔌 Testing HTTPS API..."
curl -k -s -o /dev/null -w "%{http_code}" https://localhost/api/dishes || echo "❌ HTTPS API test failed"

# Test health check
echo "❤️ Testing health check..."
curl -k -s https://localhost/health || echo "❌ Health check failed"

echo "✅ HTTPS testing complete!"
echo "🌍 Access your application at: https://localhost/"
echo "🔧 API available at: https://localhost/api/"