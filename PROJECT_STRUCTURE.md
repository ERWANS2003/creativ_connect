# Structure du Projet EZTWITCH

## 📁 Organisation des Fichiers

### Configuration
- `package.json` - Dépendances et scripts npm
- `tsconfig.json` - Configuration TypeScript
- `next.config.js` - Configuration Next.js
- `tailwind.config.ts` - Configuration Tailwind CSS
- `postcss.config.js` - Configuration PostCSS
- `.eslintrc.json` - Configuration ESLint
- `.gitignore` - Fichiers ignorés par Git

### Base de Données
- `prisma/schema.prisma` - Schéma Prisma avec tous les modèles

### Application

#### Pages (`app/`)
- `page.tsx` - Page d'accueil
- `layout.tsx` - Layout principal avec Header/Footer
- `providers.tsx` - Providers React (SessionProvider)
- `globals.css` - Styles globaux
- `not-found.tsx` - Page 404

#### Authentification (`app/auth/`)
- `signin/page.tsx` - Page de connexion
- `signup/page.tsx` - Page d'inscription

#### Annonces (`app/jobs/`)
- `page.tsx` - Liste des annonces avec filtres
- `new/page.tsx` - Formulaire de création d'annonce
- `[id]/page.tsx` - Détails d'une annonce

#### Ressources (`app/resources/`)
- `page.tsx` - Liste des ressources avec filtres
- `new/page.tsx` - Formulaire de partage de ressource
- `[id]/page.tsx` - Détails d'une ressource

#### Communauté (`app/community/`)
- `page.tsx` - Liste des posts
- `new/page.tsx` - Formulaire de création de post
- `[id]/page.tsx` - Détails d'un post avec commentaires

#### Dashboard (`app/dashboard/`)
- `page.tsx` - Tableau de bord utilisateur

#### Profil (`app/profile/[id]/`)
- `page.tsx` - Page de profil utilisateur

#### Notifications (`app/notifications/`)
- `page.tsx` - Liste des notifications

#### API Routes (`app/api/`)
- `auth/[...nextauth]/route.ts` - Configuration NextAuth
- `auth/signup/route.ts` - Inscription
- `jobs/route.ts` - CRUD des annonces
- `resources/route.ts` - CRUD des ressources
- `posts/route.ts` - CRUD des posts
- `posts/[id]/comments/route.ts` - Commentaires sur les posts
- `notifications/route.ts` - Gestion des notifications

### Composants (`components/`)

#### UI (`components/ui/`)
Composants réutilisables basés sur Radix UI :
- `button.tsx` - Boutons
- `card.tsx` - Cartes
- `input.tsx` - Champs de saisie
- `textarea.tsx` - Zones de texte
- `label.tsx` - Labels
- `select.tsx` - Sélecteurs
- `avatar.tsx` - Avatars
- `badge.tsx` - Badges
- `dropdown-menu.tsx` - Menus déroulants

#### Layout (`components/layout/`)
- `Header.tsx` - En-tête avec navigation
- `Footer.tsx` - Pied de page

#### Communauté (`components/community/`)
- `CommentForm.tsx` - Formulaire de commentaire

### Utilitaires (`lib/`)
- `auth.ts` - Configuration NextAuth
- `prisma.ts` - Client Prisma
- `utils.ts` - Fonctions utilitaires (cn, formatDate, etc.)
- `notifications.ts` - Helpers pour les notifications

### Types (`types/`)
- `next-auth.d.ts` - Types TypeScript pour NextAuth

### Documentation
- `README.md` - Documentation principale
- `DEPLOYMENT.md` - Guide de déploiement détaillé
- `PROJECT_STRUCTURE.md` - Ce fichier

## 🗄️ Modèles de Données

### User
- Informations utilisateur, authentification
- Relations : jobs, resources, posts, comments, skills, portfolio, etc.

### Job
- Annonces (jobs, collaborations, freelance)
- Champs : titre, description, type, catégorie, budget, localisation

### Resource
- Ressources partagées (templates, presets, LUTs, etc.)
- Champs : titre, description, type, fichier, prix, téléchargements

### Post
- Posts du forum communautaire
- Relations : auteur, commentaires, likes

### Comment
- Commentaires sur les posts
- Relations : post, auteur

### Skill
- Compétences des utilisateurs
- Catégories : VIDEO_EDITING, MOTION_DESIGN, etc.

### PortfolioItem
- Projets du portfolio utilisateur
- Champs : titre, description, image, URL

### SocialLink
- Liens sociaux des utilisateurs
- Plateformes : Behance, Dribbble, Instagram, etc.

### Notification
- Notifications utilisateur
- Types : job, resource, comment, post

## 🎨 Design System

### Couleurs
Les couleurs sont définies dans `app/globals.css` avec des variables CSS :
- Primary : Bleu (#3b82f6)
- Secondary : Gris clair
- Muted : Gris pour les textes secondaires
- Destructive : Rouge pour les erreurs

### Composants UI
Tous les composants utilisent Tailwind CSS et suivent le design system shadcn/ui.

## 🔐 Sécurité

- Authentification avec NextAuth.js
- Mots de passe hashés avec bcrypt
- Sessions JWT
- Protection des routes API avec vérification de session
- Validation des données côté serveur

## 📝 Fonctionnalités Implémentées

✅ Authentification (inscription/connexion)
✅ Publication d'annonces avec filtres
✅ Partage de ressources (gratuites/payantes)
✅ Forum avec posts et commentaires
✅ Profils utilisateurs avec portfolios
✅ Dashboard utilisateur
✅ Système de notifications
✅ Design responsive et moderne

## 🚀 Prochaines Étapes

Pour améliorer le projet, vous pourriez ajouter :
- Système de likes sur les posts
- Recherche avancée
- Upload de fichiers (Cloudinary/S3)
- Système de paiement (Stripe)
- Messagerie privée
- OAuth (Google, GitHub)
- Système de favoris
- Badges et réputation

