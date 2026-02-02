import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './products.entity';
import { AdminGuard } from '../admin/admin.guards';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AdminGuard)
  @Post()
  async create(@Body() productData: Partial<Product>): Promise<Product> {
    try {
      console.log('Création produit, données reçues:', {
        name: productData.name,
        hasImage: !!productData.imageUrl,
        imageSize: productData.imageUrl ? `${(productData.imageUrl.length / 1024).toFixed(1)} KB` : '0 KB'
      });

      // Plus besoin de traitement - on stocke directement le base64
      return this.productsService.create(productData);
    } catch (error) {
      console.error('Erreur création produit:', error);
      throw error;
    }
  }

  @Get()
  async findAll(
    @Query('category') categoryId?: number,
    @Query('search') search?: string
  ): Promise<Product[]> {
    return this.productsService.findAll(categoryId, search);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Product | null> {
    return this.productsService.findOne(id);
  }

  @UseGuards(AdminGuard)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() productData: Partial<Product>
  ): Promise<Product | null> {
    try {
      console.log('Mise à jour produit, données reçues:', {
        id: id,
        name: productData.name,
        hasImage: !!productData.imageUrl,
        imageSize: productData.imageUrl ? `${(productData.imageUrl.length / 1024).toFixed(1)} KB` : '0 KB'
      });

      // Plus besoin de traitement - on stocke directement le base64
      return this.productsService.update(id, productData);
    } catch (error) {
      console.error('Erreur mise à jour produit:', error);
      throw error;
    }
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productsService.remove(id);
  }
}
