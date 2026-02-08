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

      // Retirer userEmail des données (utilisé uniquement pour l'authentification)
      const { userEmail, ...dataToCreate } = productData as any;

      return this.productsService.create(dataToCreate);
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
        price: productData.price,
        priceType: typeof productData.price,
        stock: productData.stock,
        categoryId: productData.categoryId,
        hasImage: !!productData.imageUrl,
        imageSize: productData.imageUrl ? `${(productData.imageUrl.length / 1024).toFixed(1)} KB` : '0 KB'
      });

      // Retirer userEmail des données (utilisé uniquement pour l'authentification)
      const { userEmail, ...dataToUpdate } = productData as any;

      // Valider et convertir le prix si nécessaire
      if (dataToUpdate.price !== undefined) {
        const price = typeof dataToUpdate.price === 'string' 
          ? parseFloat(dataToUpdate.price) 
          : dataToUpdate.price;
        
        if (isNaN(price)) {
          throw new Error('Prix invalide');
        }
        dataToUpdate.price = price;
      }

      // Valider et convertir le stock si nécessaire
      if (dataToUpdate.stock !== undefined) {
        const stock = typeof dataToUpdate.stock === 'string' 
          ? parseInt(dataToUpdate.stock) 
          : dataToUpdate.stock;
        
        if (isNaN(stock)) {
          throw new Error('Stock invalide');
        }
        dataToUpdate.stock = stock;
      }

      return this.productsService.update(id, dataToUpdate);
    } catch (error) {
      console.error('Erreur mise à jour produit:', error);
      console.error('Stack trace:', error.stack);
      throw error;
    }
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productsService.remove(id);
  }
}
