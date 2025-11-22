# Guide de Démarrage Local - EZTWITCH

## 📋 Prérequis

- ✅ Node.js 18+ (vous avez v22.17.0)
- ✅ npm (vous avez 11.6.3)
- ⚠️ PostgreSQL installé et démarré

## 🚀 Étapes de Configuration

### 1. Installer les dépendances (✅ FAIT)
```bash
npm install
```

### 2. Créer le fichier `.env`

Créez un fichier `.env` à la racine du projet avec le contenu suivant :

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/eztwitch?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="9eyI6MHOmMAgV4XDd0JwaMd5iVHhtYps/XwvhjrETQg="
```

**⚠️ Important :** 
- Remplacez `postgres:postgres` par votre nom d'utilisateur et mot de passe PostgreSQL
- Si votre PostgreSQL utilise un autre port, modifiez `5432`

### 3. Configurer PostgreSQL

#### Option A : PostgreSQL déjà installé

1. **Créer la base de données** :
```sql
CREATE DATABASE eztwitch;
```

Ou via la ligne de commande :
```bash
psql -U postgres
CREATE DATABASE eztwitch;
\q
```

#### Option B : Installer PostgreSQL

- **Windows** : Téléchargez depuis [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
- **Mac** : `brew install postgresql@14`
- **Linux** : `sudo apt-get install postgresql postgresql-contrib`

### 4. Générer le client Prisma (✅ FAIT)
```bash
npm run db:generate
```

### 5. Créer les tables dans la base de données
```bash
npm run db:push
```

Cette commande va créer toutes les tables nécessaires dans votre base PostgreSQL.

### 6. Lancer le serveur de développement
```bash
npm run dev
```

Le site sera accessible sur : **http://localhost:3000**

## 🔧 Commandes Utiles

### Voir la base de données (Prisma Studio)
```bash
npm run db:studio
```
Ouvre une interface graphique pour visualiser et modifier les données.

### Créer une migration
```bash
npm run db:migrate
```

### Build pour la production
```bash
npm run build
npm start
```

## 🐛 Dépannage

### Erreur : "Can't reach database server"

**Solution :**
1. Vérifiez que PostgreSQL est démarré
2. Vérifiez les identifiants dans `.env`
3. Testez la connexion :
```bash
psql -U postgres -d eztwitch
```

### Erreur : "Database does not exist"

**Solution :**
Créez la base de données :
```sql
CREATE DATABASE eztwitch;
```

### Erreur : "NEXTAUTH_SECRET is not set"

**Solution :**
Vérifiez que le fichier `.env` existe et contient `NEXTAUTH_SECRET`

### Erreur de port déjà utilisé

**Solution :**
Changez le port dans `package.json` :
```json
"dev": "next dev -p 3001"
```

## 📝 Première Utilisation

1. **Accéder au site** : http://localhost:3000
2. **Créer un compte** : Cliquez sur "Inscription"
3. **Se connecter** : Utilisez vos identifiants
4. **Explorer** : Naviguez dans les sections Annonces, Ressources, Communauté

## ✅ Checklist de Vérification

- [ ] Node.js installé
- [ ] npm install exécuté
- [ ] Fichier `.env` créé avec les bonnes valeurs
- [ ] PostgreSQL installé et démarré
- [ ] Base de données `eztwitch` créée
- [ ] `npm run db:generate` exécuté
- [ ] `npm run db:push` exécuté
- [ ] `npm run dev` lancé
- [ ] Site accessible sur http://localhost:3000

## 🎉 C'est prêt !

Une fois toutes ces étapes complétées, votre site EZTWITCH sera opérationnel en local.

