# Production Dockerfile for StyleX API (Optimized for OCI Ampere/x86 VM)
FROM node:22-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and prisma schema
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

# Generate Prisma Client and build TypeScript
RUN npx prisma generate
RUN npm run build

# Runtime Stage
FROM node:22-alpine AS runner

WORKDIR /app

# Install Chromium and system libraries required for Puppeteer on Alpine, plus GoAccess for analytics
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    openssl \
    libc6-compat \
    udev \
    libstdc++ \
    dumb-init \
    goaccess

ENV NODE_ENV=production
ENV PORT=5000
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy generated Prisma client from builder
COPY --from=builder /app/node_modules/@prisma /app/node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma

# Copy built artifacts and prisma schema
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Create upload and whatsapp auth directories
RUN mkdir -p uploads/banners uploads/reels uploads/photos uploads/general whatsapp-auth

EXPOSE 5000

CMD ["sh", "-c", "(npx prisma db push --accept-data-loss || true) && (node dist/prisma/seed.js || true) && node dist/src/server.js"]
