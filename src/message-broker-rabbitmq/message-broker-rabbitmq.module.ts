import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { MessageBrokerRabbitmqService } from './message-broker-rabbitmq.service';
import { RabbitMQListenersService } from './rabbit-listeners.service';
import { APP_CONFIG } from '../config/default.config';
import { MessagePatterns } from '../common/constants/message-patterns';

@Module({
    imports: [
        RabbitMQModule.forRoot({
            exchanges: [
                {
                    name: 'auth_service',
                    type: 'direct',
                    options: { durable: true },
                },
                {
                    name: 'product_service',
                    type: 'direct',
                    options: { durable: true },
                },
            ],
            queues: [
                {
                    name: 'auth_user_events',
                    createQueueIfNotExists: true,
                    exchange: 'auth_service',
                    routingKey: ['user.created', 'user.updated'],
                },
                {
                    name: 'auth_user_validation',
                    createQueueIfNotExists: true,
                    exchange: 'auth_service',
                    routingKey: [
                        MessagePatterns.USER_VALIDATED,
                        MessagePatterns.VALIDATE_USER_TOKEN,
                    ],
                },
                {
                    name: 'product_events',
                    createQueueIfNotExists: true,
                    exchange: 'product_service',
                    routingKey: [
                        MessagePatterns.PRODUCT_CREATED,
                        MessagePatterns.PRODUCT_UPDATED,
                        MessagePatterns.PRODUCT_DELETED,
                    ],
                },
            ],
            uri: APP_CONFIG.RABBITMQ_URL,
            enableControllerDiscovery: true,
            connectionInitOptions: { wait: true },
        }),
    ],

    providers: [MessageBrokerRabbitmqService, RabbitMQListenersService],

    exports: [MessageBrokerRabbitmqService, RabbitMQModule],
})
export class MessageBrokerRabbitmqModule {}
