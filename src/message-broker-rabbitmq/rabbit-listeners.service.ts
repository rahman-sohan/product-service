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
        routingKey: MessagePatterns.TOKEN_VALIDATION_RESPONSE,
        queue: 'token_validation_response',
    })
    async handleTokenValidationResponse(msg: any): Promise<void> {
        try {
            const { data, pattern } = msg;
            console.log('Received token validation response:', msg);

            if (pattern === MessagePatterns.TOKEN_VALIDATION_RESPONSE) {
                if (data?.isValid) {
                    this.logger.log(`Token validated successfully for user ${data?.user?.id}`);
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
    
    async validateToken(token: string): Promise<TokenValidationResponse> {
        try {
            console.log('Sending token validation request to auth_service', token);
            
            const response = await this.amqpConnection.request<TokenValidationResponse>({
                exchange: 'auth_service',
                routingKey: MessagePatterns.TOKEN_VALIDATION_REQUEST,
                payload: {
                    pattern: MessagePatterns.TOKEN_VALIDATION_REQUEST,
                    data: { token }
                },
                timeout: 10000,
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
