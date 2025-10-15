# Development image
FROM node:20-alpine AS development
WORKDIR /app

# Install only app dependencies in isolated context when using workspaces
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
COPY ./apps/notifications-service/package.json ./apps/notifications-service/
RUN npm pkg delete scripts.prepare 2>/dev/null || true
RUN npm install --prefix ./apps/notifications-service --no-audit --no-fund

# Copy source
COPY ./apps/notifications-service ./apps/notifications-service
WORKDIR /app/apps/notifications-service
EXPOSE 3004
CMD ["npm", "run", "dev"]
