import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const service = await prisma.service.findUnique({
      where: {
        id,
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

    if (!service) {
      return NextResponse.json(
        { error: 'Service non trouvé' },
        { status: 404 }
      )
    }

    // Get reviews separately through bookings
    const bookings = await prisma.booking.findMany({
      where: {
        serviceId: id,
        status: 'COMPLETED',
      },
      include: {
        review: {
          include: {
            client: {
              include: {
                profile: {
                  select: {
                    firstName: true,
                    lastName: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    const reviews = bookings
      .filter((b) => b.review)
      .map((b) => ({ ...b.review, createdAt: b.review!.createdAt }))

    return NextResponse.json({ ...service, reviews })
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du service' },
      { status: 500 }
    )
  }
}
