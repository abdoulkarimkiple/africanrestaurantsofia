# AfricanRestaurantSofia

Site web de commande en ligne pour un restaurant africain premium base a New York, fonctionne en ghost kitchen.

## Objectif

Permettre aux clients de commander en ligne et permettre a l'administrateur de gerer les plats, categories, commandes, clients, paiements et parametres du restaurant.

## Stack

Frontend:

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Axios
- Zustand
- TanStack Query

Backend:

- NestJS
- TypeScript

Les integrations PostgreSQL, Prisma, JWT, Passport, Swagger, Docker, Nginx et deploiement seront ajoutees dans les prochaines etapes validees.

## Structure

```text
AfricanRestaurantSofia/
  frontend/          Application React + Vite
  backend/           API NestJS
  database/          Scripts SQL, migrations et seeds
  nginx/             Configuration Nginx
  docker/            Dockerfiles
  docs/              Documentation projet
  .github/           Workflows GitHub
  scripts/           Scripts utilitaires
  .env.example       Exemple de variables d'environnement
  docker-compose.yml Orchestration locale, configuree a l'etape Docker
  README.md          Documentation principale
  .gitignore         Fichiers ignores par Git
```

## Installation locale

```bash
cp .env.example .env

cd frontend
npm install

cd ../backend
npm install
```

## Demarrage en developpement

Frontend:

```bash
cd frontend
npm run dev
```

Backend:

```bash
cd backend
npm run start:dev
```

## Verification

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Backend:

```bash
cd backend
npm run lint
npm run test
npm run build
```

## Prisma et base de donnees

Demarrer PostgreSQL avec Docker:

```bash
docker compose up -d database
```

Configurer l'environnement Prisma local:

```bash
cp backend/.env.example backend/.env
```

Generer Prisma Client:

```bash
cd backend
npm run prisma:generate
```

Appliquer les migrations:

```bash
cd backend
npm run prisma:migrate -- --name init
```

Executer le seed:

```bash
cd backend
npm run db:seed
```
