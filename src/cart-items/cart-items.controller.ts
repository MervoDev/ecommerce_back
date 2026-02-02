import { Controller, Post, Put, Delete, Get, Body, Param, ParseIntPipe } from '@nestjs/common';
import { CartItemsService } from './cart-items.service';

@Controller('cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Post()
  async addItem(@Body() body: { 
    cartId: number; 
    productId: number; 
    quantity: number; 
    unitPrice: number 
  }) {
    return this.cartItemsService.addItem(
      body.cartId, 
      body.productId, 
      body.quantity, 
      body.unitPrice
    );
  }

  @Get('cart/:cartId')
  async getCartItems(@Param('cartId', ParseIntPipe) cartId: number) {
    return this.cartItemsService.getCartItems(cartId);
  }

  @Put(':id')
  async updateQuantity(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { quantity: number }
  ) {
    return this.cartItemsService.updateQuantity(id, body.quantity);
  }

  @Delete(':id')
  async removeItem(@Param('id', ParseIntPipe) id: number) {
    return this.cartItemsService.removeItem(id);
  }
}