# Build step
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production step using Caddy
FROM caddy:alpine
COPY --from=builder /app/build /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile
