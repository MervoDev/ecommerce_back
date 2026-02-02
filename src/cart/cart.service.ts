import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  async create(userId: number): Promise<Cart> {
    const cart = this.cartRepository.create({ userId });
    return this.cartRepository.save(cart);
  }

  async findAll(): Promise<Cart[]> {
    return this.cartRepository.find({
      relations: ['user']
    });
  }

  async findOne(id: number): Promise<Cart | null> {
    return this.cartRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product']
    });
  }

  async findByUser(userId: number): Promise<Cart | null> {
    return this.cartRepository.findOne({
      where: { userId },
      relations: ['user', 'items', 'items.product']
    });
  }

  async updateTotal(id: number, totalAmount: number): Promise<Cart | null> {
    await this.cartRepository.update(id, { totalAmount });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.cartRepository.delete(id);
  }
}
