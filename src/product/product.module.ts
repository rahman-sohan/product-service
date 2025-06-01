import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { DatabaseModule } from '../database/database.module';
import { MessageBrokerRabbitmqModule } from '../message-broker-rabbitmq/message-broker-rabbitmq.module';

@Module({
    imports: [DatabaseModule, MessageBrokerRabbitmqModule],
    controllers: [ProductController],
    providers: [ProductService],
    exports: [ProductService],
})
export class ProductModule {}
