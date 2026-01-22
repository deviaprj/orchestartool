import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createBookingSchema = z.object({
  serviceId: z.string(),
  scheduledDate: z.string().transform((str) => new Date(str)),
  message: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = createBookingSchema.parse(body)

    // Get service details
    const service = await prisma.service.findUnique({
      where: { id: validatedData.serviceId },
      include: { provider: true },
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service non trouvé' },
        { status: 404 }
      )
    }

    // Prevent self-booking
    if (service.providerId === session.user.id) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas réserver votre propre service' },
        { status: 400 }
      )
    }

    // Create booking
    const servicePrice = service.priceFixed || service.priceMin || 0
    const platformFee = servicePrice * 0.15 // 15% platform fee
    const totalPrice = servicePrice + platformFee

    const booking = await prisma.booking.create({
      data: {
        clientId: session.user.id,
        providerId: service.providerId,
        serviceId: validatedData.serviceId,
        scheduledDate: validatedData.scheduledDate,
        price: servicePrice,
        platformFee,
        totalPrice,
        status: 'PENDING',
        paymentStatus: 'PENDING',
      },
      include: {
        service: true,
        client: {
          include: {
            profile: true,
          },
        },
        provider: {
          include: {
            profile: true,
          },
        },
      },
    })

    // Create initial message if provided
    if (validatedData.message) {
      await prisma.message.create({
        data: {
          senderId: session.user.id,
          receiverId: service.providerId,
          content: validatedData.message,
        },
      })
    }

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la réservation' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const role = searchParams.get('role') // 'client' or 'provider'

    const where =
      role === 'provider'
        ? { providerId: session.user.id }
        : { clientId: session.user.id }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        service: true,
        client: {
          include: {
            profile: true,
          },
        },
        provider: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des réservations' },
      { status: 500 }
    )
  }
}
