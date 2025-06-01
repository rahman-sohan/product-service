# Product Service

A microservice built using NestJS for managing products in the Lyxa system. This service handles product creation, updates, deletion and provides product information to other services.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [RabbitMQ Setup](#rabbitmq-setup)
- [Environment Configuration](#environment-configuration)
- [Running the Service](#running-the-service)
- [Docker Setup](#docker-setup)
- [Inter-service Communication Flow](#inter-service-communication-flow)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)

## Prerequisites

Before running this service, ensure you have the following installed:

- Node.js (v20 or later)
- pnpm (v10.11.0 or later)
- MongoDB
- RabbitMQ
- Docker and Docker Compose (for containerized deployment)

## Installation

```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd product-service

# Install dependencies
pnpm install
```

## Database Setup

This service uses MongoDB as its database. You can run MongoDB locally or use a containerized version.

### Local MongoDB Setup:

1. Install MongoDB on your system following the [official instructions](https://docs.mongodb.com/manual/installation/)
2. Start the MongoDB service:
   ```bash
   sudo systemctl start mongod
   ```
3. Verify MongoDB is running:
   ```bash
   sudo systemctl status mongod
   ```

### Docker MongoDB Setup:

```bash
# Run MongoDB container
docker run -d --name mongodb -p 27017:27017 mongo:latest
```

## RabbitMQ Setup

RabbitMQ is used for inter-service communication.

### Local RabbitMQ Setup:

1. Install RabbitMQ on your system following the [official instructions](https://www.rabbitmq.com/download.html)
2. Start the RabbitMQ server:
   ```bash
   sudo systemctl start rabbitmq-server
   ```
3. Enable the RabbitMQ management plugin (optional):
   ```bash
   sudo rabbitmq-plugins enable rabbitmq_management
   ```
   This will allow you to access the RabbitMQ management interface at http://localhost:15672

### Docker RabbitMQ Setup:

```bash
# Run RabbitMQ container
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

## Environment Configuration

Create a `.env` file in the root directory with the following configuration:

```
# Database
MONGO_URI=mongodb://localhost:27017/product-service

# JWT Configuration
JWT_ACCESS_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_ACCESS_EXPIRY=25m
JWT_REFRESH_EXPIRY=7d

# RabbitMQ
RABBITMQ_URL=amqp://localhost:5672

# Service
PORT=3001
```

## Running the Service

```bash
# Development mode
pnpm run start:dev

# Production mode
pnpm run build
pnpm run start:prod
```

## Docker Setup

### Building and Running with Docker

```bash
# Build the Docker image
docker build -t product-service:latest .

# Run the Docker container
docker run -d -p 3001:3001 --env-file .env --name product-service product-service:latest
```

### Docker Compose Setup

Create a `docker-compose.yml` file in the root directory:

```yaml
version: '3.8'

services:
  product-service:
    build: .
    ports:
      - "3001:3001"
    environment:
      - MONGO_URI=mongodb://mongodb:27017/product-service
      - RABBITMQ_URL=amqp://rabbitmq:5672
      - JWT_ACCESS_SECRET=your_access_secret_key
      - JWT_REFRESH_SECRET=your_refresh_secret_key
      - JWT_ACCESS_EXPIRY=25m
      - JWT_REFRESH_EXPIRY=7d
    depends_on:
      - mongodb
      - rabbitmq
    networks:
      - lyxa-network

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - lyxa-network

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"
    networks:
      - lyxa-network

networks:
  lyxa-network:
    driver: bridge

volumes:
  mongodb_data:
```

Then, run:

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down
```

## Inter-service Communication Flow

This product service communicates with other services in the Lyxa system through RabbitMQ message broker using the following message patterns:

### Authentication Flow

1. When a request comes to a protected endpoint, the AuthGuard intercepts the request.
2. The guard extracts the JWT token from the Authorization header.
3. The token is sent to the Auth Service for validation through the `TOKEN_VALIDATION_REQUEST` message pattern.
4. The Auth Service validates the token and responds with user data through the `TOKEN_VALIDATION_RESPONSE` pattern.
5. If the token is valid, the request proceeds; otherwise, it gets rejected.

### Product Event Broadcasting

When product-related actions occur, this service broadcasts events to other interested services:

1. **Product Created**: When a new product is created, a `PRODUCT_CREATED` event is published.
2. **Product Updated**: When a product is updated, a `PRODUCT_UPDATED` event is published.
3. **Product Deleted**: When a product is deleted, a `PRODUCT_DELETED` event is published.

These events allow other services (like notification service, inventory service, etc.) to react to product changes asynchronously.

## API Endpoints

The service exposes the following REST endpoints:

- `POST /products` - Create a new product (requires authentication)
- `GET /products` - List all products with pagination
- `GET /products/my-products` - List products created by the authenticated user
- `GET /products/:productId` - Get details of a specific product
- `PATCH /products/:productId` - Update a product (requires authentication)
- `DELETE /products/:productId` - Delete a product (requires authentication)

## Testing

```bash
# Run unit tests
pnpm run test

# Run end-to-end tests
pnpm run test:e2e

# Generate test coverage reports
pnpm run test:cov
```
