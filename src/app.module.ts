import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule, } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/users.entity';
import { Product } from './products/products.entity';
import { Category } from './categories/categories.entity';
import { Order } from './orders/orders.entity';
import { OrderItem } from './orders/order-items.entity';
import { Cart } from './cart/cart.entity';
import { CartItem } from './cart-items/cart-item.entity';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CartsModule, } from './cart/cart.module';
import { CartItemsModule } from './cart-items/cart-items.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Product, Category, Order, OrderItem, Cart, CartItem],
        synchronize: true, 
        logging: true,
        ssl: false, // Pas de SSL pour PostgreSQL local
      }),
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    CartsModule,
    CartItemsModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
