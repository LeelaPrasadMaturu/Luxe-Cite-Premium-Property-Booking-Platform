# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV NODE_OPTIONS="--experimental-vm-modules"
ENV PORT=5000
ENV MONGODB_URI=mongodb+srv://captain-marvel:L8K6IMUzDlQZw4pC@mern-project-1.qyj0fdm.mongodb.net/luxestay
ENV JWT_SECRET=group21
ENV FRONTEND_URL=http://localhost:3000
ENV ADMIN_SECRET_KEY=WBD21
ENV REDIS_URL=redis-16092.crce179.ap-south-1-1.ec2.redns.redis-cloud.com:16092

# Expose port
EXPOSE ${PORT}

# Health check
HEALTHCHECK --interval=60s --timeout=60s --start-period=5s --retries=5 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/api-docs || exit 1

# Start the server
CMD ["npm", "start"] 