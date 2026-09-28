#!/usr/bin/env bash
# ==============================================================================
# StyleX Signature Salon - Automated Let's Encrypt SSL Generator
# Secures: stylexsalon.in, www.stylexsalon.in, dashboard.stylexsalon.in
# ==============================================================================

set -e

EMAIL=${1:-"admin@stylexsalon.in"}
DOMAINS="-d stylexsalon.in -d www.stylexsalon.in -d dashboard.stylexsalon.in"

echo "Requesting Let's Encrypt SSL certificate for: stylexsalon.in, www.stylexsalon.in, dashboard.stylexsalon.in"
echo "Registration Email: $EMAIL"

mkdir -p certbot/conf certbot/www

SUDO_DOCKER=""
if ! docker info &> /dev/null; then
  SUDO_DOCKER="sudo"
fi

$SUDO_DOCKER run -it --rm --name temp_certbot \
  -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
  -v "$(pwd)/certbot/www:/var/www/certbot" \
  certbot/certbot certonly --webroot \
  -w /var/www/certbot \
  $DOMAINS \
  --email "$EMAIL" \
  --rsa-key-size 4096 \
  --agree-tos \
  --force-renewal

if [ -f "certbot/conf/live/stylexsalon.in/fullchain.pem" ]; then
  echo "SSL certificate successfully obtained! Activating HTTPS configuration..."
  cp nginx/conf.d/ssl.conf.template nginx/conf.d/default.conf
  
  if $SUDO_DOCKER docker compose version &> /dev/null 2>&1; then
    $SUDO_DOCKER docker compose exec nginx nginx -s reload
  elif $SUDO_DOCKER docker-compose version &> /dev/null 2>&1; then
    $SUDO_DOCKER docker-compose exec nginx nginx -s reload
  else
    $SUDO_DOCKER docker exec stylex_nginx nginx -s reload
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
