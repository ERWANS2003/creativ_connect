# EZTWITCH - Communauté de Créateurs

Plateforme complète pour monteurs vidéo, motion designers, graphistes, designers 3D et sound designers.

## 🚀 Fonctionnalités

- **Annonces** : Publication et recherche de jobs, collaborations et missions freelance
- **Ressources** : Partage de templates, presets, LUTs, packs son et modèles 3D (gratuits ou payants)
- **Communauté** : Forum avec posts et commentaires pour échanger conseils et tutoriels
- **Profils** : Présentation des compétences, portfolios et liens sociaux
- **Dashboard** : Interface de gestion pour publier du contenu et gérer son profil
- **Notifications** : Système de notifications pour les interactions

## 🛠️ Stack Technique

- **Framework** : Next.js 14 (App Router) avec TypeScript
- **Base de données** : PostgreSQL avec Prisma ORM
- **Authentification** : NextAuth.js
- **UI** : Tailwind CSS + Radix UI
- **Déploiement** : Compatible Vercel, Render, Hostinger

## 📋 Prérequis

- Node.js 18+ 
- PostgreSQL 14+
- npm ou yarn

## 🔧 Installation

1. **Cloner le projet**
```bash
git clone <votre-repo>
cd eztwitch
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer la base de données**

Créez un fichier `.env` à la racine du projet :
```env
DATABASE_URL="postgresql://user:password@localhost:5432/eztwitch?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-key-genere-aleatoirement"
```

Générez un secret pour NextAuth :
```bash
openssl rand -base64 32
```

4. **Initialiser la base de données**
```bash
# Générer le client Prisma
npm run db:generate

# Créer les tables dans la base de données
npm run db:push

# Ou utiliser les migrations
npm run db:migrate
```

5. **Lancer le serveur de développement**
```bash
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
eztwitch/
├── app/                    # Pages Next.js (App Router)
│   ├── api/               # API Routes
│   ├── auth/              # Pages d'authentification
│   ├── jobs/              # Pages des annonces
│   ├── resources/         # Pages des ressources
│   ├── community/         # Pages du forum
│   ├── dashboard/         # Dashboard utilisateur
│   └── profile/           # Pages de profil
├── components/            # Composants React
│   ├── ui/               # Composants UI réutilisables
│   └── layout/           # Composants de layout
├── lib/                   # Utilitaires et configurations
│   ├── auth.ts           # Configuration NextAuth
│   ├── prisma.ts         # Client Prisma
│   └── utils.ts           # Fonctions utilitaires
├── prisma/                # Schéma Prisma
│   └── schema.prisma     # Modèles de données
└── public/                # Fichiers statiques
```

## 🗄️ Modèles de Données

- **User** : Utilisateurs avec authentification
- **Job** : Annonces (jobs, collaborations, freelance)
- **Resource** : Ressources partagées (templates, presets, etc.)
- **Post** : Posts du forum
- **Comment** : Commentaires sur les posts
- **Skill** : Compétences des utilisateurs
- **PortfolioItem** : Projets du portfolio
- **SocialLink** : Liens sociaux
- **Notification** : Notifications utilisateur

## 🚀 Déploiement

### Vercel (Recommandé)

1. **Connecter votre repository GitHub à Vercel**

2. **Configurer les variables d'environnement** dans Vercel :
   - `DATABASE_URL` : URL de votre base PostgreSQL
   - `NEXTAUTH_URL` : URL de votre site (ex: https://eztwitch.vercel.app)
   - `NEXTAUTH_SECRET` : Secret généré

3. **Déployer** : Vercel détecte automatiquement Next.js et déploie

### Render

1. **Créer une base de données PostgreSQL** sur Render

2. **Créer un nouveau Web Service** :
   - Connecter votre repository
   - Build Command : `npm install && npm run build`
   - Start Command : `npm start`
   - Environment : Node

3. **Ajouter les variables d'environnement** :
   - `DATABASE_URL` : URL de votre base Render
   - `NEXTAUTH_URL` : URL de votre service
   - `NEXTAUTH_SECRET` : Secret généré

4. **Déployer** et exécuter les migrations :
   ```bash
   npm run db:push
   ```

### Hostinger

1. **Configurer PostgreSQL** dans votre hébergement Hostinger

2. **Uploader les fichiers** via FTP ou SSH

3. **Installer les dépendances** :
   ```bash
   npm install --production
   ```

4. **Configurer les variables d'environnement** dans le panneau Hostinger

5. **Build et démarrer** :
   ```bash
   npm run build
   npm start
   ```

6. **Exécuter les migrations** :
   ```bash
   npm run db:push
   ```

## 🔐 Sécurité

- Les mots de passe sont hashés avec bcrypt
- Les sessions utilisent JWT
- Protection CSRF intégrée dans NextAuth
- Validation des données avec Zod (à implémenter pour les formulaires)

## 📝 Scripts Disponibles

- `npm run dev` : Serveur de développement
- `npm run build` : Build de production
- `npm run start` : Serveur de production
- `npm run lint` : Linter ESLint
- `npm run db:generate` : Générer le client Prisma
- `npm run db:push` : Pousser le schéma vers la DB
- `npm run db:migrate` : Créer une migration
- `npm run db:studio` : Ouvrir Prisma Studio

## 🎨 Personnalisation

Le design utilise Tailwind CSS avec des variables CSS personnalisables dans `app/globals.css`. Vous pouvez modifier les couleurs et le thème en ajustant les variables `--primary`, `--secondary`, etc.

## 🔮 Fonctionnalités Futures

- Système de paiement pour les ressources payantes
- Recherche avancée avec filtres
- Système de favoris
- Messagerie privée
- Système de badges et réputation
- Intégration OAuth (Google, GitHub)
- Upload de fichiers avec Cloudinary/S3

## 📄 Licence

Ce projet est sous licence MIT.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📧 Contact

Pour toute question, contactez : contact@eztwitch.com

