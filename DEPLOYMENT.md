# Guide de Déploiement - EZTWITCH

Ce guide vous accompagne dans le déploiement de l'application EZTWITCH sur différentes plateformes.

## 📋 Préparation

### 1. Variables d'environnement requises

Créez un fichier `.env` avec les variables suivantes :

```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="https://votre-domaine.com"
NEXTAUTH_SECRET="votre-secret-key-genere-aleatoirement"

# Optionnel : OAuth Providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Optionnel : Upload de fichiers (Cloudinary)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

### 2. Générer NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## 🚀 Déploiement sur Vercel (Recommandé)

Vercel est la plateforme idéale pour Next.js avec déploiement automatique.

### Étapes

1. **Créer un compte Vercel** : [vercel.com](https://vercel.com)

2. **Connecter votre repository GitHub/GitLab**

3. **Configurer le projet** :
   - Framework Preset : Next.js
   - Build Command : `npm run build` (automatique)
   - Output Directory : `.next` (automatique)
   - Install Command : `npm install`

4. **Ajouter les variables d'environnement** dans les paramètres du projet :
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (votre URL Vercel)
   - `NEXTAUTH_SECRET`

5. **Configurer PostgreSQL** :
   - Utilisez Vercel Postgres ou une base externe (Supabase, Neon, etc.)
   - Ajoutez l'URL dans `DATABASE_URL`

6. **Déployer** : Vercel déploie automatiquement à chaque push

7. **Exécuter les migrations** :
   ```bash
   # Via Vercel CLI
   vercel env pull
   npx prisma db push
   ```

## 🐳 Déploiement sur Render

Render offre un hébergement simple avec base de données PostgreSQL intégrée.

### Étapes

1. **Créer un compte Render** : [render.com](https://render.com)

2. **Créer une base de données PostgreSQL** :
   - New > PostgreSQL
   - Notez l'URL de connexion interne

3. **Créer un Web Service** :
   - New > Web Service
   - Connecter votre repository
   - Configuration :
     - **Name** : eztwitch
     - **Environment** : Node
     - **Build Command** : `npm install && npm run build`
     - **Start Command** : `npm start`
     - **Plan** : Free ou Starter

4. **Variables d'environnement** :
   - `DATABASE_URL` : URL interne de votre base PostgreSQL
   - `NEXTAUTH_URL` : URL de votre service Render
   - `NEXTAUTH_SECRET` : Secret généré

5. **Déployer** et exécuter les migrations :
   ```bash
   # Via SSH ou Shell
   npm run db:push
   ```

## 🏠 Déploiement sur Hostinger

Hostinger nécessite une configuration manuelle via SSH.

### Prérequis

- Accès SSH à votre serveur
- Node.js 18+ installé
- PostgreSQL configuré
- PM2 ou un gestionnaire de processus

### Étapes

1. **Se connecter en SSH** :
   ```bash
   ssh user@votre-serveur.com
   ```

2. **Cloner le repository** :
   ```bash
   cd /home/user/public_html
   git clone <votre-repo> eztwitch
   cd eztwitch
   ```

3. **Installer les dépendances** :
   ```bash
   npm install --production
   ```

4. **Configurer les variables d'environnement** :
   ```bash
   nano .env
   # Ajoutez toutes les variables nécessaires
   ```

5. **Build l'application** :
   ```bash
   npm run build
   ```

6. **Initialiser la base de données** :
   ```bash
   npm run db:push
   ```

7. **Démarrer avec PM2** :
   ```bash
   npm install -g pm2
   pm2 start npm --name "eztwitch" -- start
   pm2 save
   pm2 startup
   ```

8. **Configurer Nginx** (reverse proxy) :
   ```nginx
   server {
       listen 80;
       server_name votre-domaine.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🗄️ Configuration de la Base de Données

### Créer la base de données

```sql
CREATE DATABASE eztwitch;
```

### Exécuter les migrations

```bash
# Option 1 : Push direct (développement)
npm run db:push

# Option 2 : Migrations (production)
npm run db:migrate
```

### Vérifier la connexion

```bash
npm run db:studio
# Ouvre Prisma Studio sur http://localhost:5555
```

## 🔒 Sécurité en Production

1. **HTTPS** : Assurez-vous que votre site utilise HTTPS
2. **Secrets** : Ne commitez jamais les fichiers `.env`
3. **Rate Limiting** : Configurez un rate limiter pour les API
4. **CORS** : Configurez CORS si nécessaire
5. **Firewall** : Limitez l'accès à la base de données

## 📊 Monitoring

### Vercel Analytics

Vercel propose des analytics intégrés. Activez-les dans les paramètres du projet.

### Logs

- **Vercel** : Logs disponibles dans le dashboard
- **Render** : Logs dans la section Logs du service
- **Hostinger** : Logs via PM2 : `pm2 logs eztwitch`

## 🔄 Mises à jour

### Vercel
Les mises à jour sont automatiques à chaque push sur la branche principale.

### Render
Les mises à jour sont automatiques. Pour forcer un redéploiement :
```bash
render redeploy
```

### Hostinger
```bash
cd /home/user/public_html/eztwitch
git pull
npm install --production
npm run build
pm2 restart eztwitch
```

## 🐛 Dépannage

### Erreur de connexion à la base de données

- Vérifiez que `DATABASE_URL` est correct
- Vérifiez que la base de données est accessible
- Vérifiez les règles de firewall

### Erreur NextAuth

- Vérifiez que `NEXTAUTH_URL` correspond à votre domaine
- Vérifiez que `NEXTAUTH_SECRET` est défini
- Vérifiez les cookies dans les paramètres du navigateur

### Build échoue

- Vérifiez que toutes les dépendances sont installées
- Vérifiez les erreurs TypeScript : `npm run lint`
- Vérifiez les logs de build

## 📞 Support

Pour toute question, consultez :
- Documentation Next.js : [nextjs.org/docs](https://nextjs.org/docs)
- Documentation Prisma : [prisma.io/docs](https://www.prisma.io/docs)
- Issues GitHub du projet

