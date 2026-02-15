FROM node:20-alpine

WORKDIR /app

# Backend
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --production

# Frontend
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

# Copy source
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Build frontend
RUN cd frontend && npx vite build

# Create data directory
RUN mkdir -p backend/data

# Environment
ENV NODE_ENV=production
ENV PORT=8000
ENV JWT_SECRET=change_this_in_production
ENV JWT_EXPIRE=7d

EXPOSE 8000

WORKDIR /app/backend
CMD ["node", "server.js"]
