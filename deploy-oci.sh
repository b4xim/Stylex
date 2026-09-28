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

# 1. Stop any legacy webserver running on host (e.g. Launching Soon page)
echo -e "\n${YELLOW}[1/7] Clearing legacy web servers (freeing ports 80 & 443)...${NC}"
sudo systemctl stop nginx 2>/dev/null || true
sudo systemctl disable nginx 2>/dev/null || true
sudo systemctl stop apache2 2>/dev/null || true
sudo systemctl disable apache2 2>/dev/null || true
sudo systemctl stop httpd 2>/dev/null || true
sudo systemctl disable httpd 2>/dev/null || true

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

DOCKER_COMPOSE="docker compose"
if ! docker compose version &> /dev/null; then
  if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
  else
    echo -e "${RED}Docker Compose plugin missing. Installing...${NC}"
    sudo apt-get update && sudo apt-get install -y docker-compose-plugin
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
