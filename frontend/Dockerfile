# Frontend Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:18-alpine AS runner
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV NODE_OPTIONS="--max-old-space-size=512"
ENV NEXT_PUBLIC_API_URL=http://localhost:5000
ENV NEXTAUTH_URL=http://localhost:3000
ENV NEXTAUTH_SECRET=group21

# Copy necessary files from builder
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose port
EXPOSE ${PORT}

# Health check
HEALTHCHECK --interval=60s --timeout=60s --start-period=5s --retries=5 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT} || exit 1

# Start the application
CMD ["npm", "start"] 