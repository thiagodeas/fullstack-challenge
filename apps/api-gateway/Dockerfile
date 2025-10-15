# Development image
FROM node:20-alpine AS development
WORKDIR /app

# Install only app dependencies in isolated context when using workspaces
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
COPY ./apps/api-gateway/package.json ./apps/api-gateway/
RUN npm pkg delete scripts.prepare 2>/dev/null || true
RUN npm install --prefix ./apps/api-gateway --no-audit --no-fund

# Copy source
COPY ./apps/api-gateway ./apps/api-gateway
WORKDIR /app/apps/api-gateway
EXPOSE 3001
CMD ["npm", "run", "dev"]
