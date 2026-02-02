import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './cart-item.entity';

@Injectable()
export class CartItemsService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemsRepository: Repository<CartItem>,
  ) {}

  async addItem(cartId: number, productId: number, quantity: number, unitPrice: number): Promise<CartItem> {
    // Vérifier si l'article existe déjà dans le panier
    const existingItem = await this.cartItemsRepository.findOne({
      where: { cartId, productId }
    });

    if (existingItem) {
      // Mettre à jour la quantité
      existingItem.quantity += quantity;
      existingItem.totalPrice = existingItem.quantity * existingItem.unitPrice;
      return this.cartItemsRepository.save(existingItem);
    } else {
      // Créer un nouvel article
      const cartItem = this.cartItemsRepository.create({
        cartId,
        productId,
        quantity,
        unitPrice,
        totalPrice: quantity * unitPrice
      });
      return this.cartItemsRepository.save(cartItem);
    }
  }

  async updateQuantity(id: number, quantity: number): Promise<CartItem | null> {
    const cartItem = await this.cartItemsRepository.findOne({ where: { id } });
    if (cartItem) {
      cartItem.quantity = quantity;
      cartItem.totalPrice = quantity * cartItem.unitPrice;
      return this.cartItemsRepository.save(cartItem);
    }
    return null;
  }

  async removeItem(id: number): Promise<void> {
    await this.cartItemsRepository.delete(id);
  }

  async getCartItems(cartId: number): Promise<CartItem[]> {
    return this.cartItemsRepository.find({
      where: { cartId },
      relations: ['product']
    });
  }
}