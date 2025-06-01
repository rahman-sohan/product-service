import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { MessagePatterns } from '../common/constants/message-patterns';
import { TokenValidationResponse } from '../common/interfaces/auth.interface';

/**
 * This service handles incoming messages from RabbitMQ
 */
@Injectable()
export class RabbitMQListenersService {
    private readonly logger = new Logger(RabbitMQListenersService.name);

    @RabbitSubscribe({
        exchange: 'auth_service',
        routingKey: MessagePatterns.USER_VALIDATED,
        queue: 'auth_user_validation',
    })
    async handleUserValidation(msg: any): Promise<void> {
        try {
            const { data, pattern } = msg;
            // this.logger.log(`Received message with pattern ${pattern}`);
            console.log("🚀 ~ RabbitMQListenersService ~ handleUserValidation ~ msg:", msg)

            if (data?.isValid) {
                this.logger.log(`User ${data.user?.userId} validated successfully`);
                // You can update local cache or perform other actions here
            } else {
                this.logger.warn(`User validation failed: ${data?.message || 'Unknown reason'}`);
            }
        } catch (error) {
            this.logger.error(`Error processing user validation message: ${error.message}`);
        }
    }

    @RabbitSubscribe({
        exchange: 'auth_service',
        routingKey: MessagePatterns.VALIDATE_USER_TOKEN,
        queue: 'auth_token_validation_response',
    })

    async handleTokenValidationResponse(msg: TokenValidationResponse): Promise<void> {
        this.logger.debug(`Received token validation response: ${JSON.stringify(msg)}`);
        // This can be used to update a local cache if needed
    }
}
