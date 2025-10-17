# Development image
FROM node:20-alpine AS development
WORKDIR /app/apps/api-gateway

# Install only app dependencies
COPY ./apps/api-gateway/package.json ./
RUN npm pkg delete scripts.prepare 2>/dev/null || true
RUN npm install --no-audit --no-fund

# Copy source
COPY ./apps/api-gateway ./
EXPOSE 3001
CMD ["npm", "run", "dev"]
