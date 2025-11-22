# 🌱 Guide du Seed - Données de Test

## 📋 Description

Le script de seed crée des données de test pour faciliter le développement et les tests de l'application EZTWITCH.

## 🚀 Utilisation

### Installer les dépendances (si nécessaire)
```bash
npm install
```

### Exécuter le seed
```bash
npm run db:seed
```

## 📊 Données Créées

### 👥 Utilisateurs (4)
- **Alex Martin** - Motion designer
  - Email: `alex@example.com`
  - Password: `password123`
  - Compétences: After Effects, Cinema 4D, Premiere Pro
  - Liens sociaux: Behance, Instagram

- **Sophie Dubois** - Graphiste
  - Email: `sophie@example.com`
  - Password: `password123`
  - Compétences: Photoshop, Illustrator, InDesign

- **Thomas Leroy** - Sound designer
  - Email: `thomas@example.com`
  - Password: `password123`
  - Compétences: Pro Tools, Ableton Live

- **Emma Bernard** - Monteuse vidéo
  - Email: `emma@example.com`
  - Password: `password123`
  - Compétences: Premiere Pro, DaVinci Resolve

### 💼 Annonces (4)
- Motion Designer pour campagne publicitaire (Freelance, 5000€)
- Graphiste pour rebranding startup (Collaboration, 8000€)
- Sound Designer pour jeu vidéo (Job, 3500€)
- Monteur vidéo pour chaîne YouTube (Freelance, 150€)

### 📦 Ressources (4)
- Pack de transitions After Effects (Gratuit, 245 téléchargements)
- LUTs Cinematic Pro (29.99€, 189 téléchargements)
- Presets Photoshop - Vintage Collection (Gratuit, 312 téléchargements)
- Pack de sons ambiants - Nature (19.99€, 156 téléchargements)

### 📝 Posts (3)
- "Conseils pour débuter en motion design" (2 likes, 1 commentaire)
- "Tutoriel : Créer un logo animé" (2 likes)
- "Quel logiciel pour débuter en montage vidéo ?" (2 commentaires)

### 🎨 Portfolio
- 2 projets portfolio pour Alex et Sophie

### 🔔 Notifications
- 2 notifications d'exemple

## ⚠️ Important

Le script **supprime toutes les données existantes** avant de créer les nouvelles données de test. 

Si vous avez des données importantes, faites une sauvegarde avant d'exécuter le seed !

## 🔄 Réinitialiser les Données

Pour réinitialiser complètement les données :
```bash
npm run db:seed
```

## 🔑 Connexion

Tous les comptes utilisent le même mot de passe : `password123`

Vous pouvez vous connecter avec n'importe quel compte de test pour explorer l'application.

