#!/bin/bash

# Generate SSL certificates for HTTPS

echo "🔒 Generating SSL certificates for HTTPS..."

# Create SSL directory if it doesn't exist
mkdir -p ssl

# Generate private key
openssl genrsa -out ssl/server.key 2048

# Generate certificate signing request
openssl req -new -key ssl/server.key -out ssl/server.csr -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

# Generate self-signed certificate
openssl x509 -req -days 365 -in ssl/server.csr -signkey ssl/server.key -out ssl/server.crt

# Set proper permissions
chmod 600 ssl/server.key
chmod 644 ssl/server.crt

# Clean up CSR file
rm ssl/server.csr

echo "✅ SSL certificates generated successfully!"
echo "📁 Certificate files created in ssl/ directory:"
echo "   - ssl/server.crt (certificate)"
echo "   - ssl/server.key (private key)"
echo ""
echo "🔧 Note: These are self-signed certificates for development/testing."
echo "   For production, consider using Let's Encrypt or proper CA certificates."