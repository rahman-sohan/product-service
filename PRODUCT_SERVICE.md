# Product Service

This service manages product catalog (CRUD) with user authentication and authorization.

## Features

- **Product catalog management** - Create, read, update, and delete products
- **User association** - Each product is associated with a user (via user ID from Auth Service)
- **Token validation** - Validates user tokens by communicating with the Auth Service via RabbitMQ
- **Authorization** - Only product owners can update/delete their products

## Architecture

The service follows a modular architecture:

- `/src/common` - Shared code, DTOs, interfaces, and constants
- `/src/modules` - Feature modules (product module)
- `/src/database` - Database-related code
- `/src/message-broker-rabbitmq` - RabbitMQ integration

## Token Validation Flow

The service implements a token validation flow using RabbitMQ to communicate with the Auth Service:

1. **Product Service** sends token for validation via RabbitMQ
2. **Auth Service** validates the token and returns the result
3. **Product Service** processes the validation result

See [TOKEN_VALIDATION_FLOW.md](TOKEN_VALIDATION_FLOW.md) for a detailed visual representation of the flow.

## API Endpoints

### Products

- `GET /api/v1/product/products` - Get all products
- `GET /api/v1/product/products/:id` - Get product by ID
- `GET /api/v1/product/products/my-products` - Get products owned by authenticated user
- `POST /api/v1/product/products` - Create a new product (requires auth)
- `PATCH /api/v1/product/products/:id` - Update a product (requires auth and ownership)
- `DELETE /api/v1/product/products/:id` - Delete a product (requires auth and ownership)

### Health Check

- `GET /api/v1/product/health` - Check service health

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Configure environment variables:
   ```
   MONGO_URI=mongodb://localhost:27017/product-service
   RABBITMQ_URL=amqp://localhost:5672
   PORT=3001
   ```

3. Run the service:
   ```
   npm run start:dev
   ```

## Requirements

- Node.js 18+
- MongoDB
- RabbitMQ

## Testing with Postman

A Postman collection is available to test the API endpoints. Import the collection from the `postman-collection.json` file.
