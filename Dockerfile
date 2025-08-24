FROM node:20-bullseye-slim

# Install OpenSSL for Prisma binary detection
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package manifests first
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Copy Prisma schema BEFORE install so any lifecycle scripts can find it if needed
COPY prisma ./prisma

# Install deps
RUN npm install

# Copy rest of the app
COPY . .

# Build
RUN npm run build

ENV PORT=3000
EXPOSE 3000

CMD ["npm","start"]
