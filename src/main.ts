import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Activer CORS pour permettre les requêtes du frontend
  app.enableCors({
    origin: [
      'http://localhost:5173', // Vite
      'http://localhost:5174', // Vite (port alternatif)
      'http://localhost:5175', // Vite (port alternatif)
      'http://localhost:3001', // React
      'http://localhost:3000', // Next.js
      'http://localhost:8080', // Vu
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5175',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:8080',
      'https://ecommerce-front-uqsm.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // NOUVEAU : Augmenter la limite de taille des requêtes pour les images
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Servir les fichiers statiques depuis le dossier uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(process.env.PORT || 3000);
  console.log('Server started on http://localhost:3000');
}
bootstrap();
