# Let's Encrypt SSL Certificate Setup Guide

This guide will help you set up trusted SSL certificates using Let's Encrypt for your NutriTrack application.

## Prerequisites

1. **Domain Name**: You need a domain name pointed to your server
2. **Server Access**: SSH access to your Ubuntu server
3. **DNS Configuration**: Domain must resolve to your server's IP address
4. **Open Ports**: Ports 80 and 443 must be open and accessible

## Step 1: Get a Domain Name

You can get a free domain from:
- **Freenom** (free .tk, .ml, .ga domains)
- **DuckDNS** (free subdomains)
- **No-IP** (free dynamic DNS)

Or purchase from:
- **Namecheap**, **GoDaddy**, **Google Domains**, etc.

## Step 2: Configure DNS

Point your domain to your server's IP address:

```
A Record: yourdomain.com → 78.47.123.191
A Record: www.yourdomain.com → 78.47.123.191
```

**Wait for DNS propagation** (can take up to 24 hours, usually 5-10 minutes)

Test DNS resolution:
```bash
nslookup yourdomain.com
dig yourdomain.com
```

## Step 3: Setup Let's Encrypt on Server

SSH into your server and run:

```bash
cd /var/www/nutritrack/deployment
./setup-letsencrypt.sh yourdomain.com your-email@example.com
```

This script will:
- Install Certbot
- Generate Let's Encrypt certificates
- Setup automatic renewal
- Configure nginx

## Step 4: Configure GitHub Secrets

Add these secrets to your GitHub repository:

1. Go to your repository on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. Add these secrets:

```
DOMAIN_NAME=yourdomain.com
DB_PASSWORD=your-secure-password
SERVER_HOST=78.47.123.191
SERVER_USER=root
SERVER_SSH_KEY=your-private-ssh-key
```

## Step 5: Deploy with Let's Encrypt

Once your domain is configured and secrets are set:

```bash
git add .
git commit -m "Configure Let's Encrypt domain"
git push origin main
```

The deployment will automatically:
- Detect your domain configuration
- Use Let's Encrypt certificates if available
- Generate production nginx configuration
- Deploy with trusted SSL certificates

## Step 6: Verify SSL Configuration

After deployment, test your SSL setup:

```bash
# Check SSL certificate
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# Test with curl
curl -I https://yourdomain.com/

# Check SSL rating
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=yourdomain.com
```

## Free Domain Options

### Option 1: DuckDNS (Recommended)
1. Go to https://www.duckdns.org/
2. Sign in with Google/GitHub
3. Create a subdomain: `yourapp.duckdns.org`
4. Set IP to your server: `78.47.123.191`
5. Use domain: `yourapp.duckdns.org`

### Option 2: No-IP
1. Go to https://www.noip.com/
2. Create free account
3. Add hostname: `yourapp.hopto.org`
4. Set IP to your server: `78.47.123.191`
5. Use domain: `yourapp.hopto.org`

### Option 3: Freenom
1. Go to https://www.freenom.com/
2. Search for available .tk, .ml, .ga domains
3. Register free domain
4. Configure DNS A records
5. Use your registered domain

## Troubleshooting

### Certificate Generation Failed
```bash
# Check if domain resolves to your server
nslookup yourdomain.com

# Check if port 80 is accessible
curl -I http://yourdomain.com/

# Check nginx logs
sudo journalctl -u nginx -f

# Test Let's Encrypt manually
sudo certbot certonly --manual --preferred-challenges dns -d yourdomain.com
```

### Domain Not Resolving
- Wait longer for DNS propagation
- Check DNS configuration with your provider
- Verify A records point to correct IP

### Port Issues
```bash
# Check if ports are open
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443

# Open ports if needed
sudo ufw allow 80
sudo ufw allow 443
```

## Certificate Renewal

Certificates are automatically renewed every 12 hours. You can also manually renew:

```bash
# Manual renewal
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run

# Check renewal timer
sudo systemctl status certbot-renewal.timer
```

## Production URLs

After successful setup, your app will be available at:
- **Frontend**: `https://yourdomain.com/`
- **API**: `https://yourdomain.com/api/`
- **Health Check**: `https://yourdomain.com/health`

## Security Features

The Let's Encrypt setup includes:
- ✅ **Trusted SSL Certificates** (accepted by all browsers and mobile apps)
- ✅ **HSTS Headers** (HTTP Strict Transport Security)
- ✅ **Security Headers** (X-Frame-Options, CSP, etc.)
- ✅ **OCSP Stapling** (faster SSL handshake)
- ✅ **Perfect Forward Secrecy** (PFS)
- ✅ **Automatic Renewal** (certificates never expire)
- ✅ **A+ SSL Rating** (SSLLabs test)

Your application will now work perfectly with iOS apps, Android apps, and all web browsers! 🎉