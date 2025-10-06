# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Set environment variables (use .env file for secrets)
ENV NODE_ENV=production
ENV NODE_OPTIONS="--experimental-vm-modules"
ENV PORT=5000

# Expose port
EXPOSE ${PORT}

# Health check
HEALTHCHECK --interval=60s --timeout=60s --start-period=5s --retries=5 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/api-docs || exit 1

# Start the server
CMD ["npm", "start"] 