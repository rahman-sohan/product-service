FROM node:20-alpine as builder

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@10.11.0

# Copy package.json and related files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:20-alpine as production

# Set working directory
WORKDIR /app

# Set NODE_ENV
ENV NODE_ENV=production

# Install pnpm globally
RUN npm install -g pnpm@10.11.0

# Copy package.json and related files
COPY package.json pnpm-lock.yaml* ./

# Install only production dependencies
RUN pnpm install --prod

# Copy built app from builder stage
COPY --from=builder /app/dist ./dist

# Copy necessary files
COPY --from=builder /app/src/config ./dist/config

# Copy .env file if it exists
COPY .env* ./

# Expose the port the app will run on
EXPOSE 3001

# Command to run the application
CMD ["node", "dist/main.js"]
