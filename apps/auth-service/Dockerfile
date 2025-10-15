# Development image
FROM node:20-alpine AS development
WORKDIR /app

# Install only app dependencies in isolated context when using workspaces
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
COPY ./apps/auth-service/package.json ./apps/auth-service/
RUN npm pkg delete scripts.prepare 2>/dev/null || true
RUN npm install --prefix ./apps/auth-service --no-audit --no-fund

# Copy source
COPY ./apps/auth-service ./apps/auth-service
WORKDIR /app/apps/auth-service
EXPOSE 3002
CMD ["npm", "run", "dev"]
