#!/bin/bash

# Verify domain configuration for Let's Encrypt

if [ -z "$1" ]; then
    echo "❌ Error: Domain name is required"
    echo "Usage: $0 <domain-name>"
    exit 1
fi

DOMAIN=$1
SERVER_IP="78.47.123.191"

echo "🔍 Verifying domain configuration for: $DOMAIN"
echo "🖥️  Expected server IP: $SERVER_IP"
echo

# Check DNS resolution
echo "📡 Checking DNS resolution..."
RESOLVED_IP=$(dig +short $DOMAIN | tail -n1)

if [ -z "$RESOLVED_IP" ]; then
    echo "❌ Domain does not resolve to any IP address"
    echo "   Make sure DNS A record is configured"
    exit 1
elif [ "$RESOLVED_IP" = "$SERVER_IP" ]; then
    echo "✅ Domain resolves correctly to: $RESOLVED_IP"
else
    echo "⚠️  Domain resolves to: $RESOLVED_IP"
    echo "   Expected: $SERVER_IP"
    echo "   DNS may still be propagating..."
fi

# Check HTTP accessibility
echo
echo "🌐 Checking HTTP accessibility..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://$DOMAIN/" --max-time 10)

if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "301" ] || [ "$HTTP_STATUS" = "302" ]; then
    echo "✅ HTTP accessible (status: $HTTP_STATUS)"
else
    echo "❌ HTTP not accessible (status: $HTTP_STATUS)"
    echo "   Make sure port 80 is open and server is running"
fi

# Check HTTPS if available
echo
echo "🔒 Checking HTTPS accessibility..."
HTTPS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN/" --max-time 10 -k)

if [ "$HTTPS_STATUS" = "200" ]; then
    echo "✅ HTTPS accessible (status: $HTTPS_STATUS)"
    
    # Check certificate
    echo
    echo "📜 Checking SSL certificate..."
    CERT_INFO=$(echo | openssl s_client -connect "$DOMAIN:443" -servername "$DOMAIN" 2>/dev/null | openssl x509 -noout -issuer -subject -dates 2>/dev/null)
    
    if echo "$CERT_INFO" | grep -q "Let's Encrypt"; then
        echo "✅ Let's Encrypt certificate detected"
    elif echo "$CERT_INFO" | grep -q "self-signed"; then
        echo "⚠️  Self-signed certificate detected"
    else
        echo "❓ Unknown certificate type"
    fi
    
    echo "$CERT_INFO"
else
    echo "❌ HTTPS not accessible or certificate invalid (status: $HTTPS_STATUS)"
fi

echo
echo "📋 Summary:"
echo "   Domain: $DOMAIN"
echo "   DNS: $([ "$RESOLVED_IP" = "$SERVER_IP" ] && echo "✅ Correct" || echo "❌ Incorrect")"
echo "   HTTP: $([ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "301" ] || [ "$HTTP_STATUS" = "302" ] && echo "✅ Working" || echo "❌ Failed")"
echo "   HTTPS: $([ "$HTTPS_STATUS" = "200" ] && echo "✅ Working" || echo "❌ Failed")"
echo

if [ "$RESOLVED_IP" = "$SERVER_IP" ] && ([ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "301" ] || [ "$HTTP_STATUS" = "302" ]); then
    echo "🎉 Domain is ready for Let's Encrypt!"
    echo "   Run: ./setup-letsencrypt.sh $DOMAIN"
else
    echo "⏳ Domain is not ready yet. Please fix the issues above."
fi