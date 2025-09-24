FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the TypeScript application
RUN npm run build

# Use a lightweight Node.js runtime for the final image
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Copy built files and dependencies from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Expose application port
EXPOSE 3000

# Define startup command
CMD ["node", "dist/server.js"]
