```
+-------------------+         +-------------------+         +-------------------+
|                   |  STEP 1  |                   |  STEP 3  |                   |
|  Product Service  | -------> |     RabbitMQ      | -------> |   Auth Service    |
|                   | TOKEN    |     Exchange      | TOKEN    |                   |
+-------------------+ VALIDATION|                   | VALIDATION+-------------------+
          ^          REQUEST    |                   | REQUEST            |
          |                     |                   |                    |
          |          token.validation.request       |                    |
          |                     |                   |                    |
          |          STEP 6     |                   |         STEP 4     |
          |                     |                   |                    |
          |                     |                   |                    v
+-------------------+         +-------------------+         +-------------------+
|                   |  STEP 5  |                   |         |                   |
|  Product Service  | <------- |     RabbitMQ      | <------- |   Auth Service    |
|                   | TOKEN    |     Exchange      | TOKEN    |                   |
+-------------------+ VALIDATION|                   | VALIDATION+-------------------+
       Success      |  RESULT   |                   |  RESULT   | Validate Token
                                                               | Against JWT Secret
                     token.validation.response
```

## Token Validation Flow

### Step 1: Product Service Sends Token for Validation
- **Source**: Product Service (via AuthGuard)
- **Action**: Publishes a message with the JWT token to validation request queue
- **Exchange**: `auth_service`
- **Routing Key**: `token.validation.request`
- **Queue**: `token_validation_request`
- **Message Format**:
  ```json
  {
    "pattern": "token.validation.request",
    "data": {
      "token": "eyJhbGciOiJ..."
    }
  }
  ```

### Step 2: Message Waits in Queue
- The validation request message is stored in RabbitMQ until consumed

### Step 3: Auth Service Consumes the Token Validation Request
- **Consumer**: Auth Service
- **Action**: Takes token validation request from queue
- **Queue**: `token_validation_request`
- **Processing**: Extracts token from message

### Step 4: Auth Service Validates Token
- **Action**: Validates JWT token against secret key
- **Processing**: 
  - Verifies token signature
  - Checks if token is expired
  - Extracts user data from payload (id, email, etc.)

### Step 5: Auth Service Sends Validation Result
- **Source**: Auth Service
- **Action**: Publishes validation result with user data (if valid)
- **Exchange**: `auth_service`
- **Routing Key**: `token.validation.response`
- **Queue**: `token_validation_response`
- **Message Format**:
  ```json
  {
    "pattern": "token.validation.response",
    "data": {
      "isValid": true,
      "user": {
        "id": "123456",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "user",
        "iat": 1622505600,
        "exp": 1622509200
      },
      "message": "Token is valid"
    }
  }
  ```

### Step 6: Product Service Processes Validation Result
- **Consumer**: Product Service
- **Action**: Processes validation result from queue
- **Queue**: `token_validation_response`
- **Processing**:
  - If valid, attaches user to request context
  - If invalid, throws unauthorized exception
