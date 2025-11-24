# 🚀 Démarrage Rapide - Creativ Connect

## Option 1 : PostgreSQL Local (Recommandé pour développement)

### Installer PostgreSQL sur Windows

1. **Télécharger PostgreSQL** :

   - Allez sur : https://www.postgresql.org/download/windows/
   - Téléchargez le "Installer" (ex: postgresql-16.x-windows-x64.exe)

2. **Installer** :

   - Lancez l'installateur
   - **Important** : Notez le mot de passe que vous définissez pour l'utilisateur `postgres`
   - Port par défaut : `5432`

3. **Créer la base de données** :

   - Ouvrez "pgAdmin" (installé avec PostgreSQL)
   - Ou utilisez la ligne de commande :

   ```bash
   # Trouvez le chemin de psql (généralement dans C:\Program Files\PostgreSQL\16\bin\)
   "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres
   # Puis dans psql :
   CREATE DATABASE eztwitch;
   \q
   ```

4. **Mettre à jour `.env`** :
   ```env
   DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@localhost:5432/eztwitch?schema=public"
   ```

## Option 2 : Base de données en ligne (Plus rapide pour tester)

### Utiliser Supabase (Gratuit)

1. **Créer un compte** : https://supabase.com
2. **Créer un nouveau projet**
3. **Copier la connection string** :
   - Allez dans Settings > Database
   - Copiez "Connection string" (URI)
4. **Mettre à jour `.env`** :
   ```env
   DATABASE_URL="postgresql://postgres:[VOTRE-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```

## Une fois PostgreSQL configuré :

```bash
# 1. Générer le client Prisma
npm run db:generate

# 2. Créer les tables
npm run db:push

# 3. Lancer le serveur
npm run dev
```

Le site sera sur : **http://localhost:3000**

## ✅ Vérification rapide

Si vous voyez cette erreur :

```
Can't reach database server
```

➡️ Vérifiez que :

- PostgreSQL est démarré (Services Windows > PostgreSQL)
- Le mot de passe dans `.env` est correct
- La base de données `eztwitch` existe
