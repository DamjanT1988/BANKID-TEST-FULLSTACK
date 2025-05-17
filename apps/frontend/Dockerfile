# 1. Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json next.config.js tailwind.config.js ./
COPY pages ./pages
COPY components ./components
COPY stores ./stores
COPY lib ./lib
COPY i18n ./i18n
COPY locales ./locales
RUN npm install \
 && npm run build

# 2. Production image
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
RUN npm install --only=production
EXPOSE 3000
CMD ["npx", "serve", "-s", ".next", "-l", "3000"]
