import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'products' })
export class Product extends Document {
    @IsString()
    @Prop({ required: true })
    product_owner_id: string;

    @IsString()
    @Prop({ required: true })
    name: string;

    @IsString()
    @IsOptional()
    @Prop()
    description?: string;

    @IsNumber()
    @IsNumber()
    @Prop({ required: true })
    price: number;

    createdAt?: Date;

    updatedAt?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ product_owner_id: 1 });
