# Development image
FROM node:20-alpine AS development
WORKDIR /app/apps/notifications-service

# Install only app dependencies (no hoisting)
COPY ./apps/notifications-service/package.json ./
RUN npm pkg delete scripts.prepare 2>/dev/null || true
RUN npm install --no-audit --no-fund

# Copy source
COPY ./apps/notifications-service ./
EXPOSE 3004
CMD ["npm", "run", "dev"]
