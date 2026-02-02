import { Controller, Post, Get, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './cart.entity';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async create(@Body() cartData: { userId: number }): Promise<Cart> {
    return this.cartService.create(cartData.userId);
  }

  @Get()
  async findAll(): Promise<Cart[]> {
    return this.cartService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Cart | null> {
    return this.cartService.findOne(id);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId', ParseIntPipe) userId: number): Promise<Cart | null> {
    return this.cartService.findByUser(userId);
  }

  @Put(':id/total')
  async updateTotal(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: { totalAmount: number }
  ): Promise<Cart | null> {
    return this.cartService.updateTotal(id, data.totalAmount);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.cartService.remove(id);
  }
}
