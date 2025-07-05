# Step 1: Build React app
FROM node:18 as builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Step 2: Serve with 'serve'
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/build ./build
EXPOSE 80
CMD ["serve", "-s", "build", "-l", "80"]
