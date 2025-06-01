import { Injectable, NotFoundException } from '@nestjs/common';
import { Product, ProductSchema } from './entities/product.entity';
import { Types, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DatabaseService {
    constructor(
        @InjectModel(Product.name, 'product-service') private readonly productModel: Model<Product>,
    ) {}

    async createNewProduct(productData: Partial<Product>): Promise<Product> {
        const newProduct = new this.productModel(productData);

        const savedProduct = await newProduct.save();
        return savedProduct;
    }

    async findProductById(id: string): Promise<Product> {
        const product = await this.productModel.findById(new Types.ObjectId(id));

        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return product;
    }

    async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
        const updatedProduct = await this.productModel.findByIdAndUpdate(
            new Types.ObjectId(id),
            { $set: productData },
            { new: true },
        );
        if (!updatedProduct) {
            throw new NotFoundException('Product not found');
        }
        return updatedProduct;
    }

    async deleteProduct(id: string): Promise<void> {
        const result = await this.productModel.findByIdAndDelete(new Types.ObjectId(id));
        if (!result) {
            throw new NotFoundException('Product not found');
        }
    }

    async findProductByEmail(email: string): Promise<Product | null> {
        return this.productModel.findOne({ email });
    }

    async findAllProducts({ page, limit }: { page: number; limit: number }): Promise<Product[]> {
        const skip = (page - 1) * limit;

        return this.productModel.find().skip(skip).limit(limit).lean().exec();
    }

    async findProductByUserId({
        userId,
        page,
        limit,
    }: {
        userId: string;
        page: number;
        limit: number;
    }): Promise<Product[]> {
        const skip = (page - 1) * limit;

        return this.productModel.find({ product_owner_id: userId }).skip(skip).limit(limit).lean().exec();
    }
}
