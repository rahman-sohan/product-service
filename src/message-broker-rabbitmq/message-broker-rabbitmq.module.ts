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
                    name: 'token_validation_rpc_request_queue',
                    createQueueIfNotExists: true,
                    exchange: 'auth_service',
                    routingKey: [MessagePatterns.TOKEN_VALIDATION_REQUEST],
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
            connectionInitOptions: { wait: true, timeout: 30000 },
            defaultRpcTimeout: 10000,
            defaultExchangeType: 'direct',
        }),
    ],

    providers: [MessageBrokerRabbitmqService, RabbitMQListenersService],

    exports: [MessageBrokerRabbitmqService, RabbitMQListenersService, RabbitMQModule],
})
export class MessageBrokerRabbitmqModule {}
