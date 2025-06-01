<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

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
