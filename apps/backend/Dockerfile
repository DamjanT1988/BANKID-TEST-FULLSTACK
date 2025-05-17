# 1. Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json tsconfig.json nest-cli.json ./
COPY src ./src
RUN npm install \
 && npm run build

# 2. Production image
FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
# Copy config/ certificates if you need BankID certs:
COPY certs/ ./certs/
EXPOSE 4000
CMD ["node", "dist/main.js"]
