import { Controller, Post, Get, Put, Delete, Body, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CartItemsService } from './cart-items.service';

@Controller('cart-items')
@UseGuards(JwtAuthGuard) // Protéger tous les endpoints du panier
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Post()
  async addItem(
    @Request() req,
    @Body() body: { 
      cartId: number; 
      productId: number; 
      quantity: number; 
      unitPrice: number 
    }
  ) {
    // L'utilisateur connecté est disponible dans req.user
    return this.cartItemsService.addItem(
      body.cartId, 
      body.productId, 
      body.quantity, 
      body.unitPrice
    );
  }

  @Get('cart/:cartId')
  async getCartItems(@Param('cartId', ParseIntPipe) cartId: number, @Request() req) {
    // Vérifier que l'utilisateur accède à son propre panier
    return this.cartItemsService.getCartItems(cartId);
  }

  @Put(':id')
  async updateQuantity(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { quantity: number },
    @Request() req
  ) {
    return this.cartItemsService.updateQuantity(id, body.quantity);
  }

  @Delete(':id')
  async removeItem(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.cartItemsService.removeItem(id);
  }
}