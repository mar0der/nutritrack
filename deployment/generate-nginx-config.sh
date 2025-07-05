#!/bin/bash

# Generate production nginx configuration with domain substitution

if [ -z "$DOMAIN_NAME" ]; then
    echo "❌ Error: DOMAIN_NAME environment variable is required"
    exit 1
fi

echo "🔧 Generating nginx configuration for domain: $DOMAIN_NAME"

# Substitute domain name in nginx config
envsubst '${DOMAIN_NAME}' < nginx-letsencrypt.conf > nginx-production.conf

echo "✅ Generated nginx-production.conf with domain: $DOMAIN_NAME"