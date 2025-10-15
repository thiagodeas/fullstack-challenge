# Development image
FROM node:20-alpine AS development
WORKDIR /app

# Install only web dependencies in isolated context when using workspaces
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
COPY ./apps/web/package.json ./apps/web/
RUN npm pkg delete scripts.prepare 2>/dev/null || true
RUN npm install --prefix ./apps/web --no-audit --no-fund

# Copy source
COPY ./apps/web ./apps/web
WORKDIR /app/apps/web
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
