# Development image
FROM node:20-alpine AS development
WORKDIR /app/apps/auth-service

# Install only app dependencies
COPY ./apps/auth-service/package.json ./
RUN npm pkg delete scripts.prepare 2>/dev/null || true
RUN npm install --no-audit --no-fund

# Copy source
COPY ./apps/auth-service ./
EXPOSE 3002
CMD ["npm", "run", "dev"]
