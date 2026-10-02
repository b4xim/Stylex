#!/usr/bin/env bash
# ==============================================================================
# StyleX Signature Salon - Automated Let's Encrypt SSL Generator
# Secures: stylexsalon.in, www.stylexsalon.in, dashboard.stylexsalon.in
# ==============================================================================

set -e

EMAIL=${1:-"admin@stylexsalon.in"}
DOMAINS="-d stylexsalon.in -d www.stylexsalon.in -d dashboard.stylexsalon.in -d stylexsignaturesalon.in -d www.stylexsignaturesalon.in"

echo "Requesting Let's Encrypt SSL certificate for: stylexsalon.in, www.stylexsalon.in, dashboard.stylexsalon.in, stylexsignaturesalon.in, www.stylexsignaturesalon.in"
echo "Registration Email: $EMAIL"

mkdir -p certbot/conf certbot/www

DOCKER_CMD="docker"
if ! docker info &> /dev/null 2>&1; then
  DOCKER_CMD="sudo docker"
fi

$DOCKER_CMD run -i --rm --name temp_certbot \
  -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
  -v "$(pwd)/certbot/www:/var/www/certbot" \
  certbot/certbot certonly --webroot \
  -w /var/www/certbot \
  $DOMAINS \
  --email "$EMAIL" \
  --rsa-key-size 4096 \
  --agree-tos \
  --force-renewal

# Ensure permissions allow checking and reading the certificate
sudo chmod -R 755 certbot/conf/live certbot/conf/archive 2>/dev/null || true

if sudo test -f "certbot/conf/live/stylexsalon.in/fullchain.pem" 2>/dev/null || [ -f "certbot/conf/live/stylexsalon.in/fullchain.pem" ]; then
  echo "SSL certificate successfully obtained! Activating HTTPS configuration..."
  cp nginx/conf.d/ssl.conf.template nginx/conf.d/default.conf
  
  if $DOCKER_CMD compose version &> /dev/null 2>&1; then
    $DOCKER_CMD compose exec nginx nginx -s reload
  elif command -v docker-compose &> /dev/null; then
    sudo docker-compose exec nginx nginx -s reload
  else
    $DOCKER_CMD exec stylex_nginx nginx -s reload
  fi

  echo "================================================================="
  echo "  SUCCESS: HTTPS is now active across all StyleX domains!        "
  echo "  - https://stylexsalon.in                                       "
  echo "  - https://www.stylexsalon.in                                   "
  echo "  - https://dashboard.stylexsalon.in                             "
  echo "================================================================="
else
  echo "Failed to find generated certificate in certbot/conf/live/stylexsalon.in/"
  exit 1
fi
