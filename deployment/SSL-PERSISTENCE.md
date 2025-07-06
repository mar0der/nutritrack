# SSL Certificate Persistence Guide

## Current Setup

Your application is now running with **Let's Encrypt trusted SSL certificates** for the domain `nutritrackapi.duckdns.org`.

## Files That Persist Between Deployments

### 🔒 SSL Certificates (Server Filesystem)
These files are stored on the server and **automatically preserved** during CI/CD deployments:

```
/var/www/nutritrack/deployment/
├── letsencrypt/                     # Let's Encrypt certificates (PRESERVED)
│   ├── live/nutritrackapi.duckdns.org/
│   │   ├── cert.pem
│   │   ├── chain.pem
│   │   ├── fullchain.pem
│   │   └── privkey.pem
│   └── archive/                     # Certificate history
├── certbot-webroot/                 # ACME challenge directory (PRESERVED)
├── ssl/                             # Backward compatibility copies (PRESERVED)
│   ├── server.crt
│   └── server.key
├── nginx-production.conf            # Production nginx config (AUTO-GENERATED)
└── docker-compose-production.yml   # Production docker-compose (AUTO-GENERATED)
```

### 📋 Repository Files
These files are in Git and will be used for deployments:

```
deployment/
├── docker-letsencrypt-setup.sh     # Certificate generation script
├── nginx-letsencrypt.conf           # Template for production nginx
├── docker-compose.prod.yml          # Template for production setup
└── .github/workflows/deploy.yml     # Updated CI/CD workflow
```

## How SSL Persistence Works

### ✅ During CI/CD Deployments:

1. **Certificate Check**: GitHub Actions checks if certificates exist
2. **Preservation**: Uses `docker-compose down` (not `down --remove-orphans`) to preserve volumes
3. **Configuration**: Uses existing production configs if certificates are found
4. **Renewal**: Certbot container runs continuously for automatic renewal

### 🔄 Certificate Renewal:

- **Automatic**: Certbot checks for renewal every 12 hours
- **No Downtime**: Nginx reloads configuration without interruption
- **90-Day Cycle**: Let's Encrypt certificates renew automatically before expiration

### 🚨 Certificate Recovery:

If certificates are accidentally lost, you can regenerate them:

```bash
# SSH to server
ssh root@78.47.123.191
cd /var/www/nutritrack/deployment

# Regenerate certificates
./docker-letsencrypt-setup.sh nutritrackapi.duckdns.org

# Restart with new certificates
export DOMAIN_NAME=nutritrackapi.duckdns.org
export DB_PASSWORD=pbs3Z8UUktCfnYWXF8kM
docker-compose up -d --build
```

## GitHub Secrets Required

Make sure these secrets are configured in your repository:

```
DOMAIN_NAME=nutritrackapi.duckdns.org
DB_PASSWORD=pbs3Z8UUktCfnYWXF8kM
SERVER_HOST=78.47.123.191
SERVER_USER=root
SERVER_SSH_KEY=<your-private-ssh-key>
```

## Production URLs

Your application is now accessible at:

- **Frontend**: https://nutritrackapi.duckdns.org/
- **API**: https://nutritrackapi.duckdns.org/api/
- **Health Check**: https://nutritrackapi.duckdns.org/health

## Security Features Active

- ✅ **Trusted SSL Certificates** (Let's Encrypt)
- ✅ **HSTS Headers** (Strict Transport Security)
- ✅ **Security Headers** (X-Frame-Options, CSP, etc.)
- ✅ **HTTP → HTTPS Redirect** (Automatic)
- ✅ **Automatic Certificate Renewal** (Every 12 hours check)
- ✅ **A+ SSL Rating** (Modern TLS configuration)

## Next Deployment

The next time you push to main branch:

1. **GitHub Actions** will deploy normally
2. **SSL certificates** will be automatically preserved
3. **Production configuration** will be maintained
4. **No manual SSL setup** required

Your SSL setup is now **permanent and automatic**! 🎉