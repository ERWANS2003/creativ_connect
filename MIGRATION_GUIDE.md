# 📋 Guide des Migrations Prisma

## ✅ Migration Créée

La migration initiale a été créée dans :
```
prisma/migrations/20251121213446_init/migration.sql
```

## 🚀 Appliquer la Migration

### Option 1 : Si la base de données est accessible

```bash
# Appliquer la migration
npx prisma migrate deploy
```

Ou pour le développement :
```bash
npx prisma migrate dev
```

### Option 2 : Utiliser db:push (plus simple, sans fichiers de migration)

```bash
npm run db:push
```

Cette commande synchronise directement le schéma avec la base de données sans créer de fichiers de migration.

### Option 3 : Exécuter le SQL manuellement

Si vous avez accès à votre base de données PostgreSQL (via pgAdmin, psql, ou Supabase SQL Editor) :

1. Ouvrez le fichier `prisma/migrations/20251121213446_init/migration.sql`
2. Copiez tout le contenu
3. Exécutez-le dans votre interface SQL

## 📝 Structure de la Migration

La migration crée :

### Enums
- `UserRole` : USER, ADMIN, MODERATOR
- `JobType` : JOB, COLLABORATION, FREELANCE
- `ResourceType` : TEMPLATE, PRESET, LUT, SOUND_PACK, MODEL_3D, OTHER
- `SkillCategory` : VIDEO_EDITING, MOTION_DESIGN, GRAPHIC_DESIGN, DESIGN_3D, SOUND_DESIGN, OTHER

### Tables
1. **users** - Utilisateurs
2. **accounts** - Comptes OAuth (NextAuth)
3. **sessions** - Sessions utilisateur (NextAuth)
4. **verification_tokens** - Tokens de vérification (NextAuth)
5. **posts** - Posts du forum
6. **post_likes** - Likes sur les posts
7. **comments** - Commentaires sur les posts
8. **jobs** - Annonces
9. **resources** - Ressources partagées
10. **skills** - Compétences utilisateurs
11. **social_links** - Liens sociaux
12. **portfolio_items** - Projets portfolio
13. **notifications** - Notifications utilisateur

### Index et Contraintes
- Index uniques sur les emails, tokens, etc.
- Foreign keys avec cascade delete
- Contraintes de clés primaires

## 🔍 Vérifier l'État des Migrations

```bash
npx prisma migrate status
```

## 🔄 Créer de Nouvelles Migrations

Après avoir modifié `schema.prisma` :

```bash
npx prisma migrate dev --name nom_de_la_migration
```

## ⚠️ Résolution de Problèmes

### Erreur : "Can't reach database server"
- Vérifiez que votre `DATABASE_URL` dans `.env` est correcte
- Vérifiez que PostgreSQL/Supabase est accessible
- Testez la connexion : `psql $DATABASE_URL`

### Erreur : "Migration already applied"
- La migration a déjà été appliquée
- Utilisez `npx prisma migrate status` pour vérifier

### Erreur : "Table already exists"
- Les tables existent déjà
- Utilisez `npx prisma db push --force-reset` pour réinitialiser (⚠️ supprime les données)

## 📚 Documentation Prisma

- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Migration Guide](https://www.prisma.io/docs/guides/migrate)

