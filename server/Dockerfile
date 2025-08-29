# -----------------------------
# 1. Build stage
# -----------------------------
FROM node:22-bullseye-slim AS builder

# Set working directory
WORKDIR /app

# Copy package.json and prisma first (needed for prisma generate)
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies (postinstall will run prisma generate)
RUN npm install --legacy-peer-deps

# Copy rest of source files
COPY tsconfig.json ./
COPY src ./src

# Compile TypeScript
RUN npm run build

# -----------------------------
# 2. Production runtime stage
# -----------------------------
FROM node:22-bullseye-slim

# Install LibreOffice + poppler + fonts (for Excel -> PDF -> PNG conversion)
RUN apt-get update && \
    apt-get install -y libreoffice poppler-utils fonts-liberation fonts-noto && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy compiled JS + production deps
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./
COPY prisma ./prisma

# Install only production dependencies
RUN npm install --only=production --legacy-peer-deps --ignore-scripts

# Expose app port
EXPOSE 8080

# Run compiled JS
CMD ["npm", "start"]
