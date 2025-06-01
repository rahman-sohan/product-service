import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProductModule } from './product/product.module';
import { DatabaseModule } from './database/database.module';
import { MessageBrokerRabbitmqModule } from './message-broker-rabbitmq/message-broker-rabbitmq.module';
@Module({
    imports: [
        DatabaseModule,
        MessageBrokerRabbitmqModule,
        ProductModule
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
