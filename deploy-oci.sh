#!/usr/bin/env bash
# ==============================================================================
# StyleX Signature Salon - Single-Step OCI Production Deployment Script
# Targets: stylexsalon.in (Customer Site) & dashboard.stylexsalon.in (Dashboard)
# ==============================================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================================${NC}"
echo -e "${GREEN}   StyleX Signature Salon - OCI Cloud Production Deployment    ${NC}"
echo -e "${BLUE}================================================================${NC}"

# 1. Stop any legacy webserver or background repo running on host (e.g. Launching Soon page)
echo -e "\n${YELLOW}[1/7] Clearing legacy web servers & freeing ports 80 & 443...${NC}"
# Stop system web servers
sudo systemctl stop nginx 2>/dev/null || true
sudo systemctl disable nginx 2>/dev/null || true
sudo systemctl stop apache2 2>/dev/null || true
sudo systemctl disable apache2 2>/dev/null || true
sudo systemctl stop httpd 2>/dev/null || true
sudo systemctl disable httpd 2>/dev/null || true

# Stop PM2 processes if old repo used PM2
if command -v pm2 &> /dev/null; then
  echo "Clearing PM2 processes..."
  pm2 stop all 2>/dev/null || true
  pm2 delete all 2>/dev/null || true
  pm2 save --force 2>/dev/null || true
fi

# Stop any non-StyleX containers occupying port 80/443
if command -v docker &> /dev/null; then
  OLD_CONTAINERS=$(docker ps -q --filter "publish=80" 2>/dev/null || true)
  if [ -n "$OLD_CONTAINERS" ]; then
    echo "Stopping existing containers on port 80: $OLD_CONTAINERS"
    docker stop $OLD_CONTAINERS 2>/dev/null || true
  fi
  OLD_CONTAINERS_SSL=$(docker ps -q --filter "publish=443" 2>/dev/null || true)
  if [ -n "$OLD_CONTAINERS_SSL" ]; then
    echo "Stopping existing containers on port 443: $OLD_CONTAINERS_SSL"
    docker stop $OLD_CONTAINERS_SSL 2>/dev/null || true
  fi
fi

# Force kill any remaining rogue processes on ports 80 or 443
sudo fuser -k 80/tcp 2>/dev/null || true
sudo fuser -k 443/tcp 2>/dev/null || true

# 2. Configure Host Firewall (OCI iptables / ufw)
echo -e "${YELLOW}[2/7] Configuring host firewall rules for HTTP (80) & HTTPS (443)...${NC}"
sudo iptables -I INPUT 1 -p tcp --dport 80 -j ACCEPT 2>/dev/null || true
sudo iptables -I INPUT 1 -p tcp --dport 443 -j ACCEPT 2>/dev/null || true
if command -v netfilter-persistent &> /dev/null; then
  sudo netfilter-persistent save 2>/dev/null || true
fi
if command -v ufw &> /dev/null; then
  sudo ufw allow 80/tcp 2>/dev/null || true
  sudo ufw allow 443/tcp 2>/dev/null || true
fi

# 3. Verify Docker & Compose
echo -e "${YELLOW}[3/7] Verifying Docker environment...${NC}"
if ! command -v docker &> /dev/null; then
  echo -e "${RED}Docker is not installed. Installing Docker...${NC}"
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  sudo usermod -aG docker $USER
  rm get-docker.sh
fi

# Test if docker requires sudo permission
SUDO_DOCKER=""
if ! docker info &> /dev/null; then
  SUDO_DOCKER="sudo"
fi

DOCKER_COMPOSE="$SUDO_DOCKER docker compose"
if ! $DOCKER_COMPOSE version &> /dev/null; then
  if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="$SUDO_DOCKER docker-compose"
  else
    echo -e "${RED}Docker Compose plugin missing. Installing...${NC}"
    sudo apt-get update && sudo apt-get install -y docker-compose-plugin
    DOCKER_COMPOSE="$SUDO_DOCKER docker compose"
  fi
fi

# 4. Build Frontend Assets
echo -e "${YELLOW}[4/7] Compiling Client Web App & Dashboard production bundles...${NC}"
echo "Building Client Application (stylexsalon.in)..."
npm install --silent
npm run build

echo "Building Management Dashboard (dashboard.stylexsalon.in)..."
cd Stylex_Dashboard
npm install --silent
npm run build
cd ..

# 5. Prepare Environment Configuration
echo -e "${YELLOW}[5/7] Checking environment configuration...${NC}"
if [ ! -f backend/.env ]; then
  echo "Generating backend/.env from .env.example..."
  cp backend/.env.example backend/.env
  # Generate strong JWT secrets
  JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || echo "stylex_master_jwt_secret_key_2026")
  JWT_REFRESH_SECRET=$(openssl rand -hex 32 2>/dev/null || echo "stylex_master_jwt_refresh_key_2026")
  sed -i "s/your-super-secret-jwt-access-key-here/$JWT_SECRET/" backend/.env 2>/dev/null || true
  sed -i "s/your-super-secret-jwt-refresh-key-here/$JWT_REFRESH_SECRET/" backend/.env 2>/dev/null || true
fi

mkdir -p certbot/conf certbot/www

# 6. Launch Docker Containers (Postgres, API, Nginx)
echo -e "${YELLOW}[6/7] Launching StyleX container stack...${NC}"
$DOCKER_COMPOSE down --remove-orphans 2>/dev/null || true
$DOCKER_COMPOSE up -d --build

# 7. Verification
echo -e "${YELLOW}[7/7] Verifying container health...${NC}"
sleep 5
$DOCKER_COMPOSE ps

echo -e "\n${GREEN}================================================================${NC}"
echo -e "${GREEN}   StyleX Application Stack is now LIVE on Port 80!             ${NC}"
echo -e "${GREEN}   - Customer Site:    http://stylexsalon.in                    ${NC}"
echo -e "${GREEN}   - Admin Dashboard:  http://dashboard.stylexsalon.in          ${NC}"
echo -e "${GREEN}   - Backend REST API: http://stylexsalon.in/api/health         ${NC}"
echo -e "${GREEN}================================================================${NC}"
echo -e "\n${BLUE}To activate Free Let's Encrypt SSL (HTTPS):${NC}"
echo -e "Run the following command once DNS points to your OCI public IP:"
echo -e "${YELLOW}sudo ./setup-ssl.sh your-email@stylexsalon.in${NC}\n"
