# 🏠 Marketplace Yoojo Clone

Plateforme marketplace de services à domicile - Clone inspiré de Yoojo.fr

## 📋 Description

Application web complète permettant de mettre en relation clients et prestataires de services à domicile (bricolage, jardinage, ménage, cours particuliers, etc.).

## 🚀 Technologies

### Frontend
- **Next.js 14** (App Router) - Framework React avec SSR/SSG
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utility-first  
- **Radix UI** - Composants UI accessibles
- **Zustand** - State management

### Backend
- **Next.js API Routes** - API RESTful intégrée
- **Prisma** - ORM TypeScript
- **PostgreSQL** - Base de données relationnelle
- **NextAuth.js** - Authentification
- **bcryptjs** - Hash des mots de passe

### Intégrations
- **Stripe** - Paiements sécurisés
- **Google Maps API** - Géolocalisation et recherche
- **SendGrid** - Envoi d'emails
- **Socket.io** - Messagerie temps réel

## 📦 Installation

### Prérequis

- Node.js 18+
- PostgreSQL 14+
- npm

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone [url-repo]
cd marketplace-yoojo
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```

Éditer `.env` et renseigner:
- `DATABASE_URL` - URL de connexion PostgreSQL
- `NEXTAUTH_SECRET` - Clé secrète
- Autres clés API (Stripe, Google Maps, SendGrid) - optionnel pour dev

4. **Créer la base de données**
```bash
createdb marketplace_yoojo_dev
```

5. **Générer le client Prisma et créer les tables**
```bash
npm run db:generate
npm run db:push
```

6. **Peupler la base avec des données de test**
```bash
npm run db:seed
```

7. **Lancer le serveur de développement**
```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 🧪 Comptes de test

**Prestataires:**
- Email: `jean.dupont@example.com` | Password: `password123`
- Email: `marie.martin@example.com` | Password: `password123`

**Clients:**
- Email: `client@example.com` | Password: `password123`

## 📁 Structure du projet

```
marketplace-yoojo/
├── prisma/
│   ├── schema.prisma      # Schéma de base de données
│   └── seed.ts            # Données de test
├── src/
│   ├── app/               # Routes Next.js
│   ├── components/        # Composants React
│   └── lib/               # Utilitaires
└── public/                # Assets statiques
```

## 🎯 Fonctionnalités

- [x] Authentification
- [x] Profils utilisateurs
- [x] Services & catégories
- [x] Recherche géolocalisée
- [x] Réservations
- [x] Paiements Stripe
- [x] Reviews
- [x] Messagerie

## 🛠️ Scripts disponibles

```bash
npm run dev          # Mode développement
npm run build        # Build production
npm run lint         # Linter

# Prisma
npm run db:generate  # Générer client
npm run db:push      # Sync schéma
npm run db:seed      # Peupler DB
npm run db:studio    # Prisma Studio UI
```

## 🔐 Sécurité

- Mots de passe hashés (bcrypt)
- JWT tokens
- Input validation (Zod)
- Protection SQL injection (Prisma)

## 📄 License

MIT

---

**Statut**: 🚧 En développement (MVP 48h)
**Version**: 0.1.0
