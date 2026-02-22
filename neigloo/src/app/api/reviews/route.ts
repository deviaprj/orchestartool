import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createReviewSchema = z.object({
  bookingId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'Le commentaire doit contenir au moins 10 caractères'),
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
    const validatedData = createReviewSchema.parse(body)

    // Get booking
    const booking = await prisma.booking.findUnique({
      where: { id: validatedData.bookingId },
      include: { service: true },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      )
    }

    // Check if user is the client
    if (booking.clientId !== session.user.id) {
      return NextResponse.json(
        { error: 'Seul le client peut laisser un avis' },
        { status: 403 }
      )
    }

    // Check if booking is completed
    if (booking.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'La réservation doit être terminée pour laisser un avis' },
        { status: 400 }
      )
    }

    // Check if review already exists
    const existingReview = await prisma.review.findFirst({
      where: {
        bookingId: validatedData.bookingId,
      },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'Vous avez déjà laissé un avis pour cette réservation' },
        { status: 400 }
      )
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        clientId: session.user.id,
        bookingId: validatedData.bookingId,
        rating: validatedData.rating,
        comment: validatedData.comment,
      },
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
    })

    // Update provider rating
    const providerReviews = await prisma.review.findMany({
      where: { booking: { providerId: booking.providerId } },
      select: { rating: true },
    })

    const avgRating =
      providerReviews.reduce((sum, r) => sum + r.rating, 0) /
      providerReviews.length

    await prisma.profile.updateMany({
      where: { userId: booking.providerId },
      data: { rating: avgRating },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'avis' },
      { status: 500 }
    )
  }
}
