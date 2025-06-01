import {Controller,Get,Post,Body,Patch,Param,Delete,UseFilters,Logger,UseGuards} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from '../common/dto/create-product.dto';
import { UpdateProductDto } from '../common/dto/update-product.dto';
import { AllExceptionsFilter } from '../common/errors/allException.filter';
import { Product } from '../database/entities/product.entity';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TokenPayload } from '../common/interfaces/auth.interface';

@Controller('products')
@UseFilters(AllExceptionsFilter)
export class ProductController {
    private readonly logger = new Logger(ProductController.name);

    constructor(private readonly productService: ProductService) {}

    @Post()
    @UseGuards(AuthGuard)
    async create(@Body() createProductPayload: CreateProductDto, @CurrentUser() user: TokenPayload): Promise<Product> {
        return this.productService.createProduct(user.userId, createProductPayload);
    }

    @Get()
    async findAll(): Promise<Product[]> {
        return this.productService.getAllProducts();
    }

    @Get('my-products')
    @UseGuards(AuthGuard)
    async findMyProducts(@CurrentUser() user: TokenPayload): Promise<Product[]> {
        return this.productService.getProductsByUserId(user.userId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Product> {
        return this.productService.getProductById(id);
    }

    @Patch(':id')
    @UseGuards(AuthGuard)
    async update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
        @CurrentUser() user: TokenPayload,
    ): Promise<Product> {
        this.logger.log(`Update product with ID ${id} request received`);
        return this.productService.updateProduct(id, user.userId, updateProductDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async remove(
        @Param('id') id: string,
        @CurrentUser() user: TokenPayload,
    ): Promise<{ message: string }> {
        this.logger.log(`Delete product with ID ${id} request received`);
        await this.productService.deleteProduct(id, user.userId);
        return { message: 'Product deleted successfully' };
    }
}
