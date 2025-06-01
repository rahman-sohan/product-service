import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { MessagePatterns } from '../common/constants/message-patterns';
import { TokenValidationResponse } from '../common/interfaces/auth.interface';

@Injectable()
export class RabbitMQListenersService {
    private readonly logger = new Logger(RabbitMQListenersService.name);
    constructor(private readonly amqpConnection: AmqpConnection) {}

    async validateToken(token: string): Promise<TokenValidationResponse> {
        try {    
            const response = await this.amqpConnection.request<any>({
                exchange: 'auth_service',
                routingKey: MessagePatterns.TOKEN_VALIDATION_REQUEST,
                payload: {
                    pattern: MessagePatterns.TOKEN_VALIDATION_REQUEST,
                    data: { token },
                    correlationId: token,
                },
                timeout: 20000,
            });
            
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
