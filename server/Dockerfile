# -----------------------------
# 1. Build stage
# -----------------------------
FROM node:22-bullseye-slim AS builder

# Set working directory
WORKDIR /app

# Copy package.json and prisma first (needed for prisma generate)
COPY package*.json ./
COPY prisma ./prisma

# Install all dependencies (postinstall will run prisma generate)
RUN npm install --legacy-peer-deps

# Copy TypeScript config and source code
COPY tsconfig.json ./ 
COPY src ./src

# Compile TypeScript
RUN npm run build

# Rewrite @/... aliases to relative paths in build (tsc-alias)
RUN npx tsc-alias

# Generate Prisma client inside builder
RUN npx prisma generate

# -----------------------------
# 2. Production runtime stage
# -----------------------------
FROM node:22-bullseye-slim

# Install LibreOffice + poppler + fonts
RUN apt-get update && \
    apt-get install -y libreoffice poppler-utils fonts-liberation fonts-noto && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy build output, production dependencies, and prisma folder
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Install only production dependencies (scripts already run in builder)
# Optional: you can skip this if node_modules copied from builder
# RUN npm install --only=production --legacy-peer-deps

# Expose app port
EXPOSE 8080

# Run compiled JS
CMD ["node", "build/server.js"]
