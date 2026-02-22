import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import { z } from 'zod'

// GET /api/services - List/search services
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('categoryId')
    const search = searchParams.get('search')
    const city = searchParams.get('city')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    const skip = (page - 1) * limit

    const where: any = {
      available: true,
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (city) {
      where.provider = {
        profile: {
          city: { contains: city, mode: 'insensitive' },
        },
      }
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        include: {
          category: true,
          provider: {
            include: {
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true,
                  rating: true,
                  city: true,
                },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.service.count({ where }),
    ])

    return NextResponse.json({
      services,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des services' },
      { status: 500 }
    )
  }
}

const createServiceSchema = z.object({
  title: z.string().min(5, 'Le titre doit contenir au moins 5 caractères'),
  description: z.string().min(20, 'La description doit contenir au moins 20 caractères'),
  categoryId: z.string(),
  price: z.number().min(0, 'Le prix doit être positif'),
  priceUnit: z.enum(['HOUR', 'DAY', 'FIXED']),
  images: z.array(z.string()).optional(),
  availability: z.string().optional(),
})

// POST /api/services - Create a new service
export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'PROVIDER') {
      return NextResponse.json(
        { error: 'Seuls les prestataires peuvent créer des services' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const validatedData = createServiceSchema.parse(body)

    const service = await prisma.service.create({
      data: {
        ...validatedData,
        providerId: session.user.id,
        available: true,
      },
      include: {
        category: true,
        provider: {
          include: {
            profile: true,
          },
        },
      },
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du service' },
      { status: 500 }
    )
  }
}
