import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { TokenValidationResponse } from '../common/interfaces/auth.interface';

@Injectable()
export class MessageBrokerRabbitmqService {
    private readonly logger = new Logger(MessageBrokerRabbitmqService.name);

    constructor(private readonly amqpConnection: AmqpConnection) {}

    async publishToAuthExchange(params: any): Promise<any> {
        const { data, pattern } = params;
        this.logger.log(`Publishing message to auth_service exchange with pattern: ${pattern}`);

        try {
            if (pattern.includes('validate-token')) {
                return await this.amqpConnection.request<TokenValidationResponse>({
                    exchange: 'auth_service',
                    routingKey: pattern,
                    payload: {
                        pattern,
                        data,
                    },
                    timeout: 10000,
                });
            }

            await this.amqpConnection.publish('auth_service', pattern, {
                pattern,
                data,
            });

            return true;
        } catch (error) {
            this.logger.error(`Error publishing message to auth_service: ${error.message}`);
            throw error;
        }
    }
}
