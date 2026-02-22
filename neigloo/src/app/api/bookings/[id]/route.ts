import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import { BookingStatus } from '@prisma/client'

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { id } = await context.params
    const body = await req.json()
    const { status } = body

    if (!status || !['CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide' },
        { status: 400 }
      )
    }

    // Get booking
    const booking = await prisma.booking.findUnique({
      where: { id },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      )
    }

    // Check authorization
    const isProvider = booking.providerId === session.user.id
    const isClient = booking.clientId === session.user.id

    if (!isProvider && !isClient) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    // Validate status transitions
    if (status === 'CONFIRMED' && !isProvider) {
      return NextResponse.json(
        { error: 'Seul le prestataire peut confirmer' },
        { status: 403 }
      )
    }

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: status as BookingStatus },
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

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la réservation' },
      { status: 500 }
    )
  }
}
