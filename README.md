# E-Commerce Backend (NestJS)

## Installation

```bash
npm install
```

## Configuration

Créer un fichier `.env` :
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=123456
DB_NAME=ecommerce
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h
```

## Prérequis
- PostgreSQL installé et en cours d'exécution
- Base de données `ecommerce` créée

## Démarrage

```bash
npm run start:dev
```

L'API sera disponible sur `http://localhost:3000`

## Endpoints principaux
- `GET /products` - Liste des produits
- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion
- `GET /categories` - Liste des catégories

## Technologies
- NestJS
- TypeORM
- PostgreSQL
- bcrypt pour l'authentification