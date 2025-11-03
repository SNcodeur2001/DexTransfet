# DEXCHANGE API

Une API NestJS complète pour gérer des transferts d'argent avec Prisma ORM et PostgreSQL serverless.

## 🚀 Fonctionnalités

- ✅ Création de transferts d'argent
- ✅ Liste des transferts avec filtres et pagination cursor-based
- ✅ Détail d'un transfert
- ✅ Simulation de traitement (PENDING → PROCESSING → SUCCESS/FAILED)
- ✅ Annulation de transferts
- ✅ Authentification par API Key
- ✅ Audit logs complets
- ✅ Documentation Swagger
- ✅ Tests unitaires

## 🛠️ Stack technique

- **Framework**: NestJS + TypeScript
- **ORM**: Prisma
- **Base de données**: PostgreSQL (serverless: Supabase, Neon, Render, Railway)
- **Validation**: Class-validator + class-transformer
- **Documentation**: Swagger/OpenAPI
- **Tests**: Jest

## 📋 Prérequis

- Node.js 18+
- npm ou yarn
- PostgreSQL (local ou serverless)

## 🚀 Installation et configuration

### Option A: Développement local

#### 1. Cloner et installer les dépendances

```bash
npm install
```

#### 2. Configuration de la base de données

##### PostgreSQL serverless (recommandé)

Créez un compte sur [Supabase](https://supabase.com), [Neon](https://neon.tech), ou [Render PostgreSQL](https://render.com).

Copiez le fichier d'exemple d'environnement :

```bash
cp .env.example .env
```

Modifiez `.env` avec votre URL de base de données :

```bash
DATABASE_URL="postgresql://user:password@host:port/dbname?schema=public"
API_KEY="votre-cle-api-personnalisee"
PORT=3000
```

##### PostgreSQL local avec Docker

```bash
# Démarrer PostgreSQL
docker-compose up postgres -d

# URL de base de données locale
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dexchange"
```

#### 3. Migration de la base de données

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate dev

# (Optionnel) Alimenter la base avec des données de test
npm run db:seed
```

#### 4. Démarrer l'application

```bash
# Mode développement
npm run start:dev

# Production
npm run build
npm run start:prod
```

### Option B: Docker (recommandé pour production)

#### Démarrage complet avec Docker Compose

```bash
# Construire et démarrer tous les services
docker-compose up --build

# Ou en arrière-plan
docker-compose up -d --build
```

#### Services démarrés :
- **PostgreSQL** : `localhost:5432`
- **DEXCHANGE API** : `localhost:3000`
- **Swagger Docs** : `http://localhost:3000/docs`

#### Arrêter les services

```bash
docker-compose down
```

#### Logs des services

```bash
# Logs de l'API
docker-compose logs dexchange-api

# Logs de la base de données
docker-compose logs postgres

# Tous les logs
docker-compose logs
```

L'API sera disponible sur `http://localhost:3000`

## 📚 Documentation API

Accédez à la documentation Swagger sur : `http://localhost:3000/docs`

### Authentification

Toutes les requêtes nécessitent un header `x-api-key` avec une clé valide.

```bash
curl -H "x-api-key: dev-api-key-1234" http://localhost:3000/transfers
```

## 🔗 Endpoints principaux

### Créer un transfert

```bash
POST /transfers
Content-Type: application/json
x-api-key: dev-api-key-1234

{
  "amount": 12500,
  "currency": "XOF",
  "channel": "WAVE",
  "recipient": {
    "phone": "+221770000000",
    "name": "Jane Doe"
  },
  "metadata": {
    "orderId": "ABC-123"
  }
}
```

### Lister les transferts

```bash
GET /transfers?status=PENDING&limit=10&cursor=transfer-id
```

### Traiter un transfert

```bash
POST /transfers/{id}/process
```

### Annuler un transfert

```bash
POST /transfers/{id}/cancel
```

## 🧮 Règles métier

### Calcul des frais

- **Taux**: 0.8% du montant
- **Arrondi**: Au supérieur
- **Minimum**: 100 XOF
- **Maximum**: 1500 XOF

Exemples :
- 10 000 XOF → 80 XOF de frais
- 1 000 XOF → 100 XOF de frais (minimum)
- 200 000 XOF → 1500 XOF de frais (maximum)

### Flux d'état

```
PENDING → PROCESSING → SUCCESS | FAILED
```

- Seuls les transferts `PENDING` peuvent être traités ou annulés
- Le traitement simule un délai de 2-3 secondes
- 70% de chance de succès, 30% d'échec

### Références

Format : `TRF-YYYYMMDD-XXXX` (ex: `TRF-20241101-ABCD`)

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests avec couverture
npm run test:cov

# Tests en mode watch
npm run test:watch
```

## 📁 Structure du projet

```
src/
├── app.module.ts                 # Module principal
├── main.ts                       # Point d'entrée
├── common/
│   ├── guards/api-key.guard.ts   # Guard d'authentification
│   └── decorators/
├── config/
│   └── prisma.service.ts         # Service Prisma
├── audit/
│   ├── audit.service.ts          # Service d'audit
│   └── entities/audit.entity.ts  # Entité audit
└── transfers/
    ├── dto/                      # Data Transfer Objects
    ├── entities/                 # Entités
    ├── transfers.controller.ts   # Contrôleur REST
    ├── transfers.service.ts      # Logique métier
    ├── transfers.repository.ts   # Accès données
    ├── provider.simulator.ts     # Simulateur fournisseur
    └── transfers.module.ts       # Module

Docker/
├── Dockerfile                    # Image multi-stage optimisée
├── docker-compose.yml            # Orchestration complète
├── .dockerignore                 # Optimisation build
```

## 🔒 Sécurité

- Authentification obligatoire via API Key
- Validation stricte des données d'entrée
- Audit complet de toutes les actions
- Gestion des erreurs appropriée

## 📊 Base de données

### Schéma Prisma

```prisma
model Transfer {
  id           String   @id @default(uuid())
  reference    String   @unique
  amount       Int
  fees         Int
  total        Int
  currency     String
  channel      String
  status       String
  recipient    Json
  metadata     Json?
  providerRef  String?
  errorCode    String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  audits       Audit[]
}

model Audit {
  id          String   @id @default(uuid())
  action      String
  transferId  String?
  details     Json?
  createdAt   DateTime @default(now())
  transfer    Transfer? @relation(fields: [transferId], references: [id])
}

model ApiKey {
  id        String   @id @default(uuid())
  key       String   @unique
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
}
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT.
# DexTransfet
