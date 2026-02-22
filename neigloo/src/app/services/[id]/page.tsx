import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Star, MapPin, Clock, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatPrice, formatDate, getInitials } from '@/lib/utils'
import Link from 'next/link'

async function getService(id: string) {
  const service = await prisma.service.findUnique({
    where: {
      id,
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
    notFound()
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

  const reviews = bookings.filter((b) => b.review).map((b) => b.review!)

  return { ...service, reviews }
}

export default async function ServiceDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const service = await getService(params.id)

  const avgRating =
    service.reviews.length > 0
      ? service.reviews.reduce((sum, r) => sum + r.rating, 0) / service.reviews.length
      : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
            {service.images[0] ? (
              <img
                src={service.images[0]}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">
                {service.category.icon}
              </div>
            )}
          </div>

          {/* Title & Category */}
          <div>
            <Badge className="mb-2">{service.category.name}</Badge>
            <h1 className="text-3xl font-bold mb-2">{service.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{avgRating.toFixed(1)}</span>
                <span>({service.reviews.length} avis)</span>
              </div>
              {service.provider.profile?.city && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{service.provider.profile.city}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{service.description}</p>
            </CardContent>
          </Card>

          {/* Reviews */}
          {service.reviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Avis clients ({service.reviews.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {service.reviews.map((review) => (
                  <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={review.client.profile?.avatar || undefined} />
                        <AvatarFallback>
                          {getInitials(
                            review.client.profile?.firstName || '',
                            review.client.profile?.lastName || ''
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">
                            {review.client.profile?.firstName}{' '}
                            {review.client.profile?.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Booking Card */}
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-4">
                {formatPrice(service.priceFixed || service.priceMin || 0)}
                <span className="text-lg font-normal text-gray-600">
                  {service.priceUnit ? `/${service.priceUnit}` : ''}
                </span>
              </div>
              <Link href={`/bookings/new?serviceId=${service.id}`}>
                <Button className="w-full" size="lg">
                  Réserver ce service
                </Button>
              </Link>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span>Paiement sécurisé</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>Réponse rapide</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Provider Card */}
          <Card>
            <CardHeader>
              <CardTitle>À propos du prestataire</CardTitle>
            </CardHeader>
            <CardContent>
              {service.provider.profile && (
                <>
                  <Link href={`/profile/${service.provider.id}`}>
                    <div className="flex items-center gap-3 mb-4 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={service.provider.profile.avatar || undefined} />
                        <AvatarFallback className="text-lg">
                          {getInitials(
                            service.provider.profile.firstName || '',
                            service.provider.profile.lastName || ''
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">
                          {service.provider.profile.firstName}{' '}
                          {service.provider.profile.lastName}
                        </p>
                        {service.provider.profile.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">
                              {service.provider.profile.rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                  {service.provider.profile.bio && (
                    <p className="text-sm text-gray-600 mb-4">
                      {service.provider.profile.bio}
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
