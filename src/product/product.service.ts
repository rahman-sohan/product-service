import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { DatabaseService } from '../database/database.service';
import { CreateProductDto } from '../common/dto/create-product.dto';
import { UpdateProductDto } from '../common/dto/update-product.dto';
import { MessageBrokerRabbitmqService } from '../message-broker-rabbitmq/message-broker-rabbitmq.service';
import { RabbitMQListenersService } from '../message-broker-rabbitmq/rabbit-listeners.service';
import { MessagePatterns } from '../common/constants/message-patterns';
import { TokenPayload } from '../common/interfaces/auth.interface';
import { Product } from '../database/entities/product.entity';

@Injectable()
export class ProductService {
    private readonly logger = new Logger(ProductService.name);

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly messageBroker: MessageBrokerRabbitmqService,
        private readonly rabbitMQListenersService: RabbitMQListenersService,
    ) {}

    async validateUserToken(token: string): Promise<TokenPayload> {
        try {
            const response = await this.rabbitMQListenersService.validateToken(token);

            if (!response.isValid || !response.user) {
                throw new UnauthorizedException('Invalid token');
            }

            return response.user;
        } catch (error) {
            this.logger.error(`Error validating token: ${error.message}`);
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    async getUserFromRequest(req: Request): Promise<TokenPayload> {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Authorization token is missing');
        }

        const token = authHeader.split(' ')[1];
        return this.validateUserToken(token);
    }

    async createProduct(userId: string, createProductPayload: CreateProductDto): Promise<Product> {
        
        const productData = {
            ...createProductPayload,
            product_owner_id: userId,
        };

        const product = await this.databaseService.createNewProduct(productData);

        try {
            await this.messageBroker.publishToAuthExchange({
                pattern: MessagePatterns.PRODUCT_CREATED,
                data: {
                    productId: product._id,
                    userId,
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

        return product;
    }

    async getAllProducts(): Promise<Product[]> {
        this.logger.log('Fetching all products');
        return this.databaseService.findAllProducts();
    }

    async getProductsByUserId(userId: string): Promise<Product[]> {
        this.logger.log(`Fetching products for user ${userId}`);
        const products = await this.databaseService.findAllProducts();
        return products.filter((product) => product.product_owner_id === userId);
    }

    async getProductById(productId: string, userId?: string): Promise<Product> {
        this.logger.log(`Fetching product with ID ${productId}`);
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
        this.logger.log(`Updating product with ID ${productId} for user ${userId}`);
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
        this.logger.log(`Deleting product with ID ${productId} for user ${userId}`);

        // First check if user owns the product
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
