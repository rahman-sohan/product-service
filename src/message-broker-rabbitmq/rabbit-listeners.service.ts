import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe, AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { MessagePatterns } from '../common/constants/message-patterns';
import { TokenValidationResponse } from '../common/interfaces/auth.interface';

@Injectable()
export class RabbitMQListenersService {
    
    private readonly logger = new Logger(RabbitMQListenersService.name);
    
    constructor(private readonly amqpConnection: AmqpConnection) {}

    @RabbitSubscribe({
        exchange: 'auth_service',
        routingKey: MessagePatterns.AUTH_USER,
        queue: 'auth_user_validation',
    })
    async handleUserValidation(msg: any): Promise<void> {
        try {
            const { data, pattern } = msg;
            this.logger.log(`Received user validation with pattern ${pattern}`);

            if (pattern === MessagePatterns.AUTH_USER) {
                this.logger.log(`User ${data?.id} validated successfully`);
            } else {
                this.logger.warn(`Unknown validation pattern: ${pattern}`);
            }
        } catch (error) {
            this.logger.error(`Error processing user validation message: ${error.message}`);
        }
    }
    
    @RabbitSubscribe({
        exchange: 'auth_service',
        routingKey: MessagePatterns.TOKEN_VALIDATION_RESPONSE,
        queue: 'token_validation_response',
    })
    async handleTokenValidationResponse(msg: any): Promise<void> {
        try {
            const { data, pattern } = msg;
            this.logger.log(`Received token validation response with pattern ${pattern}`);

            if (pattern === MessagePatterns.TOKEN_VALIDATION_RESPONSE) {
                if (data?.isValid) {
                    this.logger.log(`Token validated successfully for user ${data?.user?.userId}`);
                    // Here you can implement additional logic like caching the token validation result
                } else {
                    this.logger.warn(`Token validation failed: ${data?.message || 'Unknown reason'}`);
                }
            } else {
                this.logger.warn(`Unknown token validation pattern: ${pattern}`);
            }
        } catch (error) {
            this.logger.error(`Error processing token validation response: ${error.message}`);
        }
    }
    
    /**
     * Validates a JWT token by communicating with the Auth Service
     * @param token The JWT token to validate
     * @returns Promise with token validation result
     */
    async validateToken(token: string): Promise<TokenValidationResponse> {
        try {
            this.logger.log('Sending token validation request');
            
            // Send token validation request
            const response = await this.amqpConnection.request<TokenValidationResponse>({
                exchange: 'auth_service',
                routingKey: MessagePatterns.TOKEN_VALIDATION_REQUEST,
                payload: {
                    pattern: MessagePatterns.TOKEN_VALIDATION_REQUEST,
                    data: { token }
                },
                timeout: 10000, // 10 seconds timeout
            });
            
            this.logger.log(`Token validation response received: ${response?.isValid ? 'Valid' : 'Invalid'}`);
            return response;
        } catch (error) {
            this.logger.error(`Token validation error: ${error.message}`);
            return {
                isValid: false,
                message: error.message || 'Token validation failed'
            };
        }
    }
}
