import {Controller,Get,Post,Body,Patch,Param,Delete,UseFilters,Logger,UseGuards, Query} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from '../common/dto/create-product.dto';
import { UpdateProductDto } from '../common/dto/update-product.dto';
import { AllExceptionsFilter } from '../common/errors/allException.filter';
import { Product } from '../database/entities/product.entity';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserTokenData } from '../common/interfaces/auth.interface';

@Controller('products')
@UseFilters(AllExceptionsFilter)
export class ProductController {
    private readonly logger = new Logger(ProductController.name);

    constructor(private readonly productService: ProductService) {}

    @Post()
    @UseGuards(AuthGuard)
    async create(@Body() createProductPayload: CreateProductDto, @CurrentUser() user: UserTokenData): Promise<Product> {
        return this.productService.createProduct(user, createProductPayload);
    }

    @Get()
    async findAllProducts(@Query('page') page: number, @Query('limit') limit: number): Promise<Product[]> {
        page = page || 1;
        limit = limit || 10;
        return this.productService.getAllProducts({ page, limit });
    }

    @Get('my-products')
    @UseGuards(AuthGuard)
    async findMyProducts(@CurrentUser() user: UserTokenData, @Query('page') page: number, @Query('limit') limit: number): Promise<Product[]> {
        page = page || 1;
        limit = limit || 10;

        return this.productService.getProductsByUserId(user, page, limit );
    }

    @Get(':productId')
    async findOne(@Param('productId') productId: string): Promise<Product> {
        return this.productService.getProductById(productId);
    }

    @Patch(':productId')
    @UseGuards(AuthGuard)
    async updateProduct(
        @Param('productId') productId: string,
        @Body() updateProductPayload: UpdateProductDto,
        @CurrentUser() user: UserTokenData,
    ): Promise<Product> {
        return this.productService.updateProduct(productId, user.id, updateProductPayload);
    }

    @Delete(':productId')
    @UseGuards(AuthGuard)
    async remove(
        @Param('productId') productId: string,
        @CurrentUser() user: UserTokenData,
    ): Promise<{ message: string }> {
        this.logger.log(`Delete product with ID ${productId} request received`);
        await this.productService.deleteProduct(productId, user.id);
        return { message: 'Product deleted successfully' };
    }
}
