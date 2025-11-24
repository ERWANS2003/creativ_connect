# 🔧 Dépannage - Problème d'Inscription

## ❌ Problème Identifié

L'inscription échoue car la base de données PostgreSQL n'est pas accessible.

## ✅ Solutions

### Solution 1 : Configurer PostgreSQL Local

1. **Vérifier que PostgreSQL est démarré** :

   ```powershell
   Get-Service -Name "*postgres*"
   ```

2. **Vérifier les identifiants** :

   - Ouvrez pgAdmin ou connectez-vous avec psql
   - Testez la connexion avec votre mot de passe

3. **Mettre à jour `.env`** :

   ```env
   DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@localhost:5432/creativ_connect?schema=public"
   ```

   Remplacez `VOTRE_MOT_DE_PASSE` par votre vrai mot de passe PostgreSQL.

4. **Créer la base de données** (si elle n'existe pas) :

   ```sql
   CREATE DATABASE creativ_connect;
   ```

5. **Appliquer les migrations** :
   ```bash
   npm run db:push
   ```

### Solution 2 : Utiliser Supabase (Recommandé)

1. **Créer un compte** : https://supabase.com

2. **Créer un nouveau projet**

3. **Récupérer la connection string** :

   - Settings > Database
   - Copiez "Connection string" (URI)

4. **Mettre à jour `.env`** :

   ```env
   DATABASE_URL="postgresql://postgres:[VOTRE-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```

5. **Appliquer les migrations** :

   ```bash
   npm run db:push
   ```

   Ou exécutez manuellement le SQL dans Supabase SQL Editor :

   - Ouvrez `prisma/migrations/20251121213446_init/migration.sql`
   - Copiez le contenu
   - Exécutez dans Supabase SQL Editor

## 🔍 Vérifications

### Vérifier la connexion

```bash
# Testez avec psql (si installé)
psql "postgresql://postgres:password@localhost:5432/creativ_connect"
```

### Vérifier que les tables existent

Une fois connecté, vérifiez :

```sql
\dt
```

Vous devriez voir les tables : users, posts, jobs, resources, etc.

### Vérifier les logs du serveur

Regardez la console du serveur Next.js pour voir les erreurs détaillées.

## 🚨 Erreurs Courantes

### "Authentication failed"

➡️ Le mot de passe dans `.env` est incorrect

### "Can't reach database server"

➡️ PostgreSQL n'est pas démarré ou l'URL est incorrecte

### "Table does not exist"

➡️ Les migrations n'ont pas été appliquées. Exécutez `npm run db:push`

### "Email already exists"

➡️ L'email est déjà utilisé (c'est normal, essayez un autre email)

## 📝 Après Configuration

Une fois la base de données configurée :

1. **Appliquer les migrations** :

   ```bash
   npm run db:push
   ```

2. **Redémarrer le serveur** :

   ```bash
   npm run dev
   ```

3. **Tester l'inscription** :
   - Allez sur http://localhost:3000/auth/signup
   - Remplissez le formulaire
   - Vous devriez être redirigé vers la page de connexion

## 💡 Astuce

Pour tester rapidement, utilisez **Supabase** (gratuit) - c'est plus simple que de configurer PostgreSQL localement !
