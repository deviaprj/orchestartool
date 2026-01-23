import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Start seeding database...')

  // Clear existing data
  await prisma.review.deleteMany()
  await prisma.message.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.service.deleteMany()
  await prisma.verification.deleteMany()
  await prisma.category.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.user.deleteMany()

  // Hash password for test users
  const hashedPassword = await bcrypt.hash('password123', 10)

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Bricolage',
        slug: 'bricolage',
        icon: 'Hammer',
        description: 'Travaux de bricolage et petits travaux'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Jardinage',
        slug: 'jardinage',
        icon: 'TreeDeciduous',
        description: 'Entretien de jardin et espaces verts'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Ménage',
        slug: 'menage',
        icon: 'Sparkles',
        description: 'Ménage et nettoyage'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Déménagement',
        slug: 'demenagement',
        icon: 'Package',
        description: 'Aide au déménagement'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Informatique',
        slug: 'informatique',
        icon: 'Monitor',
        description: 'Dépannage et assistance informatique'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Cours particuliers',
        slug: 'cours-particuliers',
        icon: 'GraduationCap',
        description: 'Cours et soutien scolaire'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Animaux',
        slug: 'animaux',
        icon: 'Dog',
        description: 'Garde et promenade d\'animaux'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Aide à domicile',
        slug: 'aide-a-domicile',
        icon: 'Home',
        description: 'Services à la personne'
      }
    })
  ])

  console.log('✅ Categories created')

  // Create providers
  const provider1 = await prisma.user.create({
    data: {
      email: 'jean.dupont@example.com',
      password: hashedPassword,
      role: 'PROVIDER',
      emailVerified: true,
      profile: {
        create: {
          firstName: 'Jean',
          lastName: 'Dupont',
          phone: '+33612345678',
          bio: 'Bricoleur professionnel avec 10 ans d\'expérience. Travail soigné et rapide garanti !',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jean',
          address: '15 Rue de la République, 75011 Paris',
          city: 'Paris',
          postalCode: '75011',
          latitude: 48.8566,
          longitude: 2.3522,
          rating: 4.8,
          totalReviews: 47
        }
      }
    }
  })

  const provider2 = await prisma.user.create({
    data: {
      email: 'marie.martin@example.com',
      password: hashedPassword,
      role: 'PROVIDER',
      emailVerified: true,
      profile: {
        create: {
          firstName: 'Marie',
          lastName: 'Martin',
          phone: '+33623456789',
          bio: 'Passionnée de jardinage, je vous aide à créer et entretenir votre jardin de rêve.',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie',
          address: '42 Avenue des Champs, 69002 Lyon',
          city: 'Lyon',
          postalCode: '69002',
          latitude: 45.7640,
          longitude: 4.8357,
          rating: 5.0,
          totalReviews: 32
        }
      }
    }
  })

  const provider3 = await prisma.user.create({
    data: {
      email: 'pierre.bernard@example.com',
      password: hashedPassword,
      role: 'PROVIDER',
      emailVerified: true,
      profile: {
        create: {
          firstName: 'Pierre',
          lastName: 'Bernard',
          phone: '+33634567890',
          bio: 'Expert en dépannage informatique. Intervention rapide à domicile.',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pierre',
          address: '8 Rue Victor Hugo, 31000 Toulouse',
          city: 'Toulouse',
          postalCode: '31000',
          latitude: 43.6047,
          longitude: 1.4442,
          rating: 4.6,
          totalReviews: 28
        }
      }
    }
  })

  console.log('✅ Providers created')

  // Create clients
  const client1 = await prisma.user.create({
    data: {
      email: 'client@example.com',
      password: hashedPassword,
      role: 'CLIENT',
      emailVerified: true,
      profile: {
        create: {
          firstName: 'Sophie',
          lastName: 'Dubois',
          phone: '+33645678901',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
          address: '23 Boulevard Saint-Germain, 75005 Paris',
          city: 'Paris',
          postalCode: '75005',
          latitude: 48.8529,
          longitude: 2.3469
        }
      }
    }
  })

  const client2 = await prisma.user.create({
    data: {
      email: 'client2@example.com',
      password: hashedPassword,
      role: 'CLIENT',
      emailVerified: true,
      profile: {
        create: {
          firstName: 'Thomas',
          lastName: 'Rousseau',
          phone: '+33656789012',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas',
          address: '67 Rue de la Paix, 69003 Lyon',
          city: 'Lyon',
          postalCode: '69003',
          latitude: 45.7579,
          longitude: 4.8510
        }
      }
    }
  })

  console.log('✅ Clients created')

  // Create services
  await prisma.service.create({
    data: {
      providerId: provider1.id,
      categoryId: categories[0].id, // Bricolage
      title: 'Montage de meubles IKEA et autres',
      description: 'Je monte vos meubles en kit rapidement et efficacement. Que ce soit des meubles IKEA, Conforama ou autre, je maîtrise tous les types d\'assemblage. Outillage professionnel fourni.',
      images: [
        'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800',
        'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800'
      ],
      priceType: 'RANGE',
      priceMin: 30,
      priceMax: 80,
      priceUnit: 'heure',
      available: true,
      serviceRadius: 15
    }
  })

  await prisma.service.create({
    data: {
      providerId: provider1.id,
      categoryId: categories[0].id, // Bricolage
      title: 'Petits travaux de plomberie',
      description: 'Dépannage plomberie : réparation robinet, remplacement joint, débouchage, installation WC, etc.',
      images: [
        'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800'
      ],
      priceType: 'RANGE',
      priceMin: 50,
      priceMax: 100,
      priceUnit: 'intervention',
      available: true,
      serviceRadius: 10
    }
  })

  await prisma.service.create({
    data: {
      providerId: provider2.id,
      categoryId: categories[1].id, // Jardinage
      title: 'Tonte de pelouse et entretien jardin',
      description: 'Service complet d\'entretien de jardin : tonte, taille de haies, désherbage, ramassage feuilles. Équipement professionnel. Devis gratuit.',
      images: [
        'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800',
        'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=800'
      ],
      priceType: 'RANGE',
      priceMin: 25,
      priceMax: 50,
      priceUnit: 'heure',
      available: true,
      serviceRadius: 20
    }
  })

  await prisma.service.create({
    data: {
      providerId: provider3.id,
      categoryId: categories[4].id, // Informatique
      title: 'Dépannage informatique à domicile',
      description: 'Assistance et réparation ordinateur : virus, lenteur, installation logiciel, récupération données, configuration WiFi, etc. Intervention rapide.',
      images: [
        'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800'
      ],
      priceType: 'FIXED',
      priceFixed: 60,
      priceUnit: 'intervention',
      available: true,
      serviceRadius: 12
    }
  })

  console.log('✅ Services created')

  // Create a booking
  const service = await prisma.service.findFirst({
    where: { providerId: provider1.id }
  })

  if (service) {
    const booking = await prisma.booking.create({
      data: {
        serviceId: service.id,
        clientId: client1.id,
        providerId: provider1.id,
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 jours
        message: 'Bonjour, j\'aurais besoin de monter une armoire PAX 3 portes. Merci !',
        status: 'ACCEPTED',
        paymentStatus: 'PAID',
        price: 80,
        platformFee: 12,
        totalPrice: 92
      }
    })

    // Create review for the booking
    await prisma.review.create({
      data: {
        bookingId: booking.id,
        clientId: client1.id,
        rating: 5,
        comment: 'Travail impeccable ! Jean est très professionnel et rapide. Je recommande vivement.'
      }
    })
  }

  console.log('✅ Booking and review created')

  // Create some messages
  const service2 = await prisma.service.findFirst({
    where: { providerId: provider2.id }
  })

  if (service2) {
    await prisma.message.createMany({
      data: [
        {
          senderId: client2.id,
          receiverId: provider2.id,
          content: 'Bonjour, êtes-vous disponible ce samedi pour tondre ma pelouse ?',
          read: true
        },
        {
          senderId: provider2.id,
          receiverId: client2.id,
          content: 'Bonjour ! Oui je suis disponible samedi matin. Quelle est la surface approximative ?',
          read: true
        },
        {
          senderId: client2.id,
          receiverId: provider2.id,
          content: 'Environ 200m². C\'est possible ?',
          read: false
        }
      ]
    })
  }

  console.log('✅ Messages created')

  console.log('✨ Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
