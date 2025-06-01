import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { APP_CONFIG } from '../config/default.config';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './entities/product.entity';

@Module({
    imports: [
        MongooseModule.forRoot(APP_CONFIG.MONGO_URI, {
            connectionName: 'product-service',
        }),
        MongooseModule.forFeature(
            [
                {
                    name: Product.name,
                    schema: ProductSchema,
                },
            ],
            'product-service',
        ),
    ],
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule {}
