# Development image
FROM node:20-alpine AS development
WORKDIR /app

# Install only app dependencies in isolated context when using workspaces
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
COPY ./apps/tasks-service/package.json ./apps/tasks-service/
RUN npm pkg delete scripts.prepare 2>/dev/null || true
RUN npm install --prefix ./apps/tasks-service --no-audit --no-fund

# Copy source
COPY ./apps/tasks-service ./apps/tasks-service
WORKDIR /app/apps/tasks-service
EXPOSE 3003
CMD ["npm", "run", "dev"]
