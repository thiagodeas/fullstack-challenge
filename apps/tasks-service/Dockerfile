# Development image
FROM node:20-alpine AS development
WORKDIR /app/apps/tasks-service

# Install only app dependencies
COPY ./apps/tasks-service/package.json ./
RUN npm pkg delete scripts.prepare 2>/dev/null || true
RUN npm install --no-audit --no-fund

# Copy source
COPY ./apps/tasks-service ./
EXPOSE 3003
CMD ["npm", "run", "dev"]
