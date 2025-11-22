import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seed...')

  // Nettoyer les données existantes (optionnel)
  console.log('🧹 Nettoyage des données existantes...')
  await prisma.notification.deleteMany()
  await prisma.portfolioItem.deleteMany()
  await prisma.socialLink.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.postLike.deleteMany()
  await prisma.post.deleteMany()
  await prisma.resource.deleteMany()
  await prisma.job.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  // Créer des utilisateurs
  console.log('👥 Création des utilisateurs...')
  const hashedPassword = await bcrypt.hash('password123', 10)

  const user1 = await prisma.user.create({
    data: {
      name: 'Alex Martin',
      email: 'alex@example.com',
      password: hashedPassword,
      bio: 'Motion designer passionné avec 5 ans d\'expérience. Spécialisé en After Effects et Cinema 4D.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      skills: {
        create: [
          { name: 'After Effects', category: 'MOTION_DESIGN', level: 'expert' },
          { name: 'Cinema 4D', category: 'DESIGN_3D', level: 'advanced' },
          { name: 'Premiere Pro', category: 'VIDEO_EDITING', level: 'intermediate' },
        ],
      },
      socialLinks: {
        create: [
          { platform: 'Behance', url: 'https://behance.net/alexmartin' },
          { platform: 'Instagram', url: 'https://instagram.com/alexmartin' },
        ],
      },
    },
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'Sophie Dubois',
      email: 'sophie@example.com',
      password: hashedPassword,
      bio: 'Graphiste freelance spécialisée en branding et identité visuelle.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
      skills: {
        create: [
          { name: 'Photoshop', category: 'GRAPHIC_DESIGN', level: 'expert' },
          { name: 'Illustrator', category: 'GRAPHIC_DESIGN', level: 'expert' },
          { name: 'InDesign', category: 'GRAPHIC_DESIGN', level: 'advanced' },
        ],
      },
    },
  })

  const user3 = await prisma.user.create({
    data: {
      name: 'Thomas Leroy',
      email: 'thomas@example.com',
      password: hashedPassword,
      bio: 'Sound designer et compositeur pour le cinéma et la publicité.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas',
      skills: {
        create: [
          { name: 'Pro Tools', category: 'SOUND_DESIGN', level: 'expert' },
          { name: 'Ableton Live', category: 'SOUND_DESIGN', level: 'advanced' },
        ],
      },
    },
  })

  const user4 = await prisma.user.create({
    data: {
      name: 'Emma Bernard',
      email: 'emma@example.com',
      password: hashedPassword,
      bio: 'Monteuse vidéo freelance, spécialisée en documentaires et reportages.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      skills: {
        create: [
          { name: 'Premiere Pro', category: 'VIDEO_EDITING', level: 'expert' },
          { name: 'DaVinci Resolve', category: 'VIDEO_EDITING', level: 'advanced' },
        ],
      },
    },
  })

  // Créer des annonces
  console.log('💼 Création des annonces...')
  const job1 = await prisma.job.create({
    data: {
      title: 'Motion Designer pour campagne publicitaire',
      description: 'Recherche motion designer expérimenté pour créer des animations pour une campagne publicitaire majeure. Projet de 3 mois, possibilité de télétravail.',
      type: 'FREELANCE',
      category: 'MOTION_DESIGN',
      level: 'senior',
      duration: '3 mois',
      budget: 5000,
      currency: 'EUR',
      location: 'Remote',
      authorId: user2.id,
    },
  })

  const job2 = await prisma.job.create({
    data: {
      title: 'Graphiste pour rebranding startup',
      description: 'Startup tech recherche graphiste pour refonte complète de son identité visuelle. Collaboration sur 6 mois avec équipe créative.',
      type: 'COLLABORATION',
      category: 'GRAPHIC_DESIGN',
      level: 'mid',
      duration: '6 mois',
      budget: 8000,
      currency: 'EUR',
      location: 'Paris',
      authorId: user1.id,
    },
  })

  const job3 = await prisma.job.create({
    data: {
      title: 'Sound Designer pour jeu vidéo',
      description: 'Studio de jeu vidéo indépendant recherche sound designer pour créer la bande sonore complète d\'un jeu d\'aventure. Projet passionnant avec grande liberté créative.',
      type: 'JOB',
      category: 'SOUND_DESIGN',
      level: 'mid',
      duration: 'CDI',
      budget: 3500,
      currency: 'EUR',
      location: 'Lyon',
      authorId: user3.id,
    },
  })

  const job4 = await prisma.job.create({
    data: {
      title: 'Monteur vidéo pour chaîne YouTube',
      description: 'Créateur de contenu recherche monteur vidéo pour éditer 2-3 vidéos par semaine. Style dynamique et moderne recherché.',
      type: 'FREELANCE',
      category: 'VIDEO_EDITING',
      level: 'junior',
      duration: 'Long terme',
      budget: 150,
      currency: 'EUR',
      location: 'Remote',
      authorId: user4.id,
    },
  })

  // Créer des ressources
  console.log('📦 Création des ressources...')
  const resource1 = await prisma.resource.create({
    data: {
      title: 'Pack de transitions After Effects',
      description: 'Collection de 20 transitions modernes et fluides pour After Effects. Compatible avec toutes les versions récentes.',
      type: 'TEMPLATE',
      category: 'MOTION_DESIGN',
      fileUrl: 'https://example.com/downloads/transitions-pack.zip',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      price: 0,
      currency: 'EUR',
      downloadCount: 245,
      authorId: user1.id,
    },
  })

  const resource2 = await prisma.resource.create({
    data: {
      title: 'LUTs Cinematic Pro',
      description: 'Pack de 15 LUTs professionnels pour donner un look cinématique à vos vidéos. Compatible Premiere Pro, DaVinci Resolve, Final Cut.',
      type: 'LUT',
      category: 'VIDEO_EDITING',
      fileUrl: 'https://example.com/downloads/cinematic-luts.zip',
      thumbnailUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800',
      price: 29.99,
      currency: 'EUR',
      downloadCount: 189,
      authorId: user4.id,
    },
  })

  const resource3 = await prisma.resource.create({
    data: {
      title: 'Presets Photoshop - Vintage Collection',
      description: '10 presets d\'actions Photoshop pour créer des effets vintage authentiques. Parfait pour les portraits et les paysages.',
      type: 'PRESET',
      category: 'GRAPHIC_DESIGN',
      fileUrl: 'https://example.com/downloads/vintage-presets.atn',
      thumbnailUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800',
      price: 0,
      currency: 'EUR',
      downloadCount: 312,
      authorId: user2.id,
    },
  })

  const resource4 = await prisma.resource.create({
    data: {
      title: 'Pack de sons ambiants - Nature',
      description: 'Collection de 30 sons ambiants de haute qualité (forêt, plage, montagne). Format WAV 24-bit, prêts à l\'emploi.',
      type: 'SOUND_PACK',
      category: 'SOUND_DESIGN',
      fileUrl: 'https://example.com/downloads/nature-sounds.zip',
      thumbnailUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      price: 19.99,
      currency: 'EUR',
      downloadCount: 156,
      authorId: user3.id,
    },
  })

  // Créer des posts
  console.log('📝 Création des posts...')
  const post1 = await prisma.post.create({
    data: {
      title: 'Conseils pour débuter en motion design',
      content: `Salut la communauté ! 👋

Je vois beaucoup de questions de débutants, alors je voulais partager quelques conseils qui m'ont aidé :

1. **Maîtrisez les bases d'After Effects** - Ne sautez pas les étapes fondamentales
2. **Inspirez-vous mais ne copiez pas** - Analysez les travaux des pros
3. **Créez régulièrement** - La pratique est la clé
4. **Partagez vos créations** - Le feedback est précieux

N'hésitez pas à poser vos questions ! 🎨`,
      authorId: user1.id,
      likes: {
        create: [
          { userId: user2.id },
          { userId: user3.id },
        ],
      },
      comments: {
        create: [
          {
            content: 'Super conseils ! Je débute et ça m\'aide beaucoup. Merci !',
            authorId: user4.id,
          },
        ],
      },
    },
  })

  const post2 = await prisma.post.create({
    data: {
      title: 'Tutoriel : Créer un logo animé',
      content: `Bonjour à tous !

J'ai créé un tutoriel complet pour animer un logo dans After Effects. Le tuto couvre :
- Préparation du fichier Illustrator
- Animation des éléments
- Timing et easing
- Export final

Le lien est dans mon profil Behance. Dites-moi ce que vous en pensez ! 🎬`,
      authorId: user1.id,
      likes: {
        create: [
          { userId: user2.id },
          { userId: user4.id },
        ],
      },
    },
  })

  const post3 = await prisma.post.create({
    data: {
      title: 'Quel logiciel pour débuter en montage vidéo ?',
      content: `Salut ! Je veux me lancer dans le montage vidéo mais je ne sais pas quel logiciel choisir. 

J'hésite entre Premiere Pro, DaVinci Resolve et Final Cut Pro. 

Quels sont vos retours d'expérience ? Lequel recommanderiez-vous pour un débutant ? Merci ! 🙏`,
      authorId: user4.id,
      comments: {
        create: [
          {
            content: 'Je recommande DaVinci Resolve pour commencer - c\'est gratuit et très puissant !',
            authorId: user1.id,
          },
          {
            content: 'Premiere Pro est plus intuitif pour débuter selon moi, mais c\'est payant.',
            authorId: user2.id,
          },
        ],
      },
    },
  })

  // Créer des portfolios
  console.log('🎨 Création des portfolios...')
  await prisma.portfolioItem.create({
    data: {
      title: 'Campagne publicitaire - Brand X',
      description: 'Animation complète pour une campagne publicitaire télévisée',
      imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200',
      projectUrl: 'https://behance.net/project1',
      userId: user1.id,
    },
  })

  await prisma.portfolioItem.create({
    data: {
      title: 'Identité visuelle - Restaurant Le Jardin',
      description: 'Refonte complète de l\'identité visuelle d\'un restaurant gastronomique',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200',
      projectUrl: 'https://behance.net/project2',
      userId: user2.id,
    },
  })

  // Créer des notifications
  console.log('🔔 Création des notifications...')
  await prisma.notification.create({
    data: {
      title: 'Nouveau commentaire',
      message: 'Sophie a commenté votre post "Conseils pour débuter en motion design"',
      type: 'comment',
      userId: user1.id,
    },
  })

  await prisma.notification.create({
    data: {
      title: 'Nouvelle ressource',
      message: 'Alex a partagé une nouvelle ressource : Pack de transitions After Effects',
      type: 'resource',
      userId: user2.id,
      read: true,
    },
  })

  console.log('✅ Seed terminé avec succès !')
  console.log(`📊 Données créées :`)
  console.log(`   - ${await prisma.user.count()} utilisateurs`)
  console.log(`   - ${await prisma.job.count()} annonces`)
  console.log(`   - ${await prisma.resource.count()} ressources`)
  console.log(`   - ${await prisma.post.count()} posts`)
  console.log(`   - ${await prisma.comment.count()} commentaires`)
  console.log(`   - ${await prisma.postLike.count()} likes`)
  console.log(`   - ${await prisma.portfolioItem.count()} projets portfolio`)
  console.log(`   - ${await prisma.notification.count()} notifications`)
  console.log('')
  console.log('🔑 Comptes de test :')
  console.log('   - alex@example.com / password123')
  console.log('   - sophie@example.com / password123')
  console.log('   - thomas@example.com / password123')
  console.log('   - emma@example.com / password123')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

