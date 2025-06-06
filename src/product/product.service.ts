import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateProductDto } from '../common/dto/create-product.dto';
import { UpdateProductDto } from '../common/dto/update-product.dto';
import { MessageBrokerRabbitmqService } from '../message-broker-rabbitmq/message-broker-rabbitmq.service';
import { MessagePatterns } from '../common/constants/message-patterns';
import { UserTokenData } from '../common/interfaces/auth.interface';
import { Product } from '../database/entities/product.entity';

@Injectable()
export class ProductService {
    private readonly logger = new Logger(ProductService.name);

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly messageBroker: MessageBrokerRabbitmqService
    ) {}

    async createProduct(user: UserTokenData, createProductPayload: CreateProductDto): Promise<any> {
        
        const productData = {
            ...createProductPayload,
            product_owner_id: user.id,
        };

        const product = await this.databaseService.createNewProduct(productData);

        try {
            const returnValue = await this.messageBroker.publishToAuthExchange({
                pattern: MessagePatterns.PRODUCT_CREATED,
                data: {
                    productId: product._id,
                    userId: user.id,
                    product: {
                        name: product.name,
                        price: product.price,
                        description: product.description,
                    },
                    timestamp: new Date().toISOString(),
                },
            });
            
        } catch (error) {
            this.logger.error(`Failed to publish product created event: ${error.message}`);
        }

        return {
            message: 'Product created successfully',
            product: {
                id: product._id,
                name: product.name,
                price: product.price,
                description: product.description,
                product_owner_id: product.product_owner_id,
            },
        };
    }

    async getAllProducts(params:{ page: number, limit: number }): Promise<Product[]> {
        const { page, limit } = params;

        return this.databaseService.findAllProducts({ page, limit });
    }

    async getProductsByUserId(user: UserTokenData, page: number, limit: number): Promise<Product[]> {

        const products = await this.databaseService.findProductByUserId({
            userId: user.id,
            page,
            limit
        });

        return products;
    }

    async getProductById(productId: string, userId?: string): Promise<Product> {
        const product = await this.databaseService.findProductById(productId);

        if (userId && product.product_owner_id !== userId) {
            this.logger.warn(
                `User ${userId} attempted to access product ${productId} they don't own`,
            );

            throw new UnauthorizedException('You do not have access to this product');
        }

        return product;
    }

    async updateProduct(
        productId: string,
        userId: string,
        updateProductDto: UpdateProductDto,
    ): Promise<Product> {
        const product = await this.databaseService.findProductById(productId);

        if (product.product_owner_id !== userId) {
            this.logger.warn(
                `User ${userId} attempted to update product ${productId} they don't own`,
            );
            throw new UnauthorizedException('You do not have permission to update this product');
        }

        const updatedProduct = await this.databaseService.updateProduct(
            productId,
            updateProductDto,
        );

        try {
            await this.messageBroker.publishToAuthExchange({
                pattern: MessagePatterns.PRODUCT_UPDATED,
                data: {
                    productId,
                    userId,
                    updates: updateProductDto,
                    timestamp: new Date().toISOString(),
                },
            });
        } catch (error) {
            this.logger.error(`Failed to publish product updated event: ${error.message}`);
        }

        return updatedProduct;
    }

    async deleteProduct(productId: string, userId: string): Promise<void> {
        const product = await this.databaseService.findProductById(productId);

        if (product.product_owner_id !== userId) {
            this.logger.warn(
                `User ${userId} attempted to delete product ${productId} they don't own`,
            );
            throw new UnauthorizedException('You do not have permission to delete this product');
        }

        await this.databaseService.deleteProduct(productId);

        try {
            await this.messageBroker.publishToAuthExchange({
                pattern: MessagePatterns.PRODUCT_DELETED,
                data: {
                    productId,
                    userId,
                    timestamp: new Date().toISOString(),
                },
            });
        } catch (error) {
            this.logger.error(`Failed to publish product deleted event: ${error.message}`);
        }
    }

}
