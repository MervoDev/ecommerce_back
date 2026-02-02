import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './products.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  // MÉTHODE CORRIGÉE pour gérer les images base64
  async saveBase64Image(base64String: string): Promise<string> {
    try {
      console.log('Début sauvegarde image base64...');
      
      // Extraire le type d'image et les données
      const matches = base64String.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
      if (!matches) {
        console.error('Format base64 invalide');
        throw new Error('Format base64 invalide');
      }

      const imageType = matches[1].toLowerCase(); // jpg, png, etc.
      const imageData = matches[2];

      console.log(`Type d'image détecté: ${imageType}`);

      // Créer le dossier uploads s'il n'existe pas
      const uploadsDir = path.join(process.cwd(), 'uploads');
      console.log(`Dossier uploads: ${uploadsDir}`);
      
      if (!fs.existsSync(uploadsDir)) {
        console.log('Création du dossier uploads...');
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Générer un nom de fichier unique
      const fileName = `product_${Date.now()}_${Math.random().toString(36).substring(7)}.${imageType}`;
      const filePath = path.join(uploadsDir, fileName);
      
      console.log(`Sauvegarde vers: ${filePath}`);

      // Sauvegarder le fichier
      fs.writeFileSync(filePath, imageData, 'base64');
      
      console.log('Image sauvegardée avec succès !');

      // Retourner l'URL relative
      return `/uploads/${fileName}`;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'image:', error);
      // Retourner l'URL base64 originale en cas d'erreur
      return base64String;
    }
  }

  async create(productData: Partial<Product>): Promise<Product> {
    const product = this.productsRepository.create(productData);
    return this.productsRepository.save(product);
  }

  async findAll(categoryId?: number, search?: string): Promise<Product[]> {
    const query = this.productsRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.isActive = :isActive', { isActive: true });

    if (categoryId) {
      query.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    if (search) {
      query.andWhere('(product.name ILIKE :search OR product.description ILIKE :search)', { search: `%${search}%` });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Product | null> {
    return this.productsRepository.findOne({
      where: { id },
      relations: ['category']
    });
  }

  async update(id: number, productData: Partial<Product>): Promise<Product | null> {
    await this.productsRepository.update(id, productData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }
}
