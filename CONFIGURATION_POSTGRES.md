# 🔧 Configuration PostgreSQL pour Creativ Connect

## ❌ Problème actuel

Les identifiants PostgreSQL dans votre `.env` ne fonctionnent pas.

## ✅ Solutions

### Solution 1 : Installer PostgreSQL (Recommandé)

1. **Télécharger** :

   - https://www.postgresql.org/download/windows/
   - Choisissez "Download the installer"

2. **Installer** :

   - Suivez l'assistant d'installation
   - **IMPORTANT** : Notez le mot de passe que vous définissez pour `postgres`
   - Port par défaut : `5432` (gardez-le)

3. **Créer la base de données** :

   **Méthode A - Via pgAdmin** (Interface graphique) :

   - Ouvrez pgAdmin 4
   - Connectez-vous avec votre mot de passe
   - Clic droit sur "Databases" > Create > Database
   - Nom : `creativ_connect`
   - Cliquez "Save"

   **Méthode B - Via ligne de commande** :

   ```powershell
   # Trouvez psql (généralement ici) :
   & "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres
   # Entrez votre mot de passe
   # Puis :
   CREATE DATABASE creativ_connect;
   \q
   ```

4. **Mettre à jour `.env`** :
   ```env
   DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@localhost:5432/creativ_connect?schema=public"
   ```
   Remplacez `VOTRE_MOT_DE_PASSE` par le mot de passe que vous avez défini.

### Solution 2 : Utiliser Supabase (Gratuit, en ligne)

1. **Créer un compte** : https://supabase.com
2. **Créer un projet** :
   - New Project
   - Choisissez un nom et un mot de passe
   - Région : Europe (ou celle la plus proche)
3. **Récupérer la connection string** :
   - Settings (⚙️) > Database
   - Section "Connection string"
   - Copiez "URI" (pas "Session mode")
   - Format : `postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
4. **Mettre à jour `.env`** :
   ```env
   DATABASE_URL="postgresql://postgres:[VOTRE-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```
   Remplacez `[VOTRE-PASSWORD]` et `[PROJECT-REF]` par vos valeurs.

### Solution 3 : Utiliser Neon (Alternative gratuite)

1. **Créer un compte** : https://neon.tech
2. **Créer un projet**
3. **Copier la connection string**
4. **Mettre à jour `.env`**

## 🚀 Après configuration

Une fois PostgreSQL configuré et `.env` mis à jour :

```bash
# Créer les tables
npm run db:push

# Lancer le serveur
npm run dev
```

## 🔍 Vérifier la connexion

Pour tester si PostgreSQL fonctionne :

```powershell
# Si PostgreSQL est installé localement :
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d eztwitch
```

Si ça fonctionne, vous êtes connecté ! Tapez `\q` pour quitter.

## ⚠️ Erreurs courantes

### "Authentication failed"

➡️ Le mot de passe dans `.env` est incorrect

### "Database does not exist"

➡️ Créez la base avec : `CREATE DATABASE eztwitch;`

### "Can't reach database server"

➡️ PostgreSQL n'est pas démarré :

- Services Windows > PostgreSQL > Démarrer
