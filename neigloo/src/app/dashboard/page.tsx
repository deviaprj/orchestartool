'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatPrice, formatDate } from '@/lib/utils'
import { Calendar, Clock, CheckCircle, XCircle, Star } from 'lucide-react'
import Link from 'next/link'

interface Booking {
  id: string
  scheduledDate: string
  status: string
  paymentStatus: string
  price: number
  service: {
    id: string
    title: string
  }
  client: {
    profile: {
      firstName: string
      lastName: string
    }
  }
  provider: {
    profile: {
      firstName: string
      lastName: string
    }
  }
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'bookings')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchBookings()
    }
  }, [session])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const role = session?.user?.role === 'PROVIDER' ? 'provider' : 'client'
      const response = await fetch(`/api/bookings?role=${role}`)
      const data = await response.json()
      setBookings(data || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        fetchBookings()
      }
    } catch (error) {
      console.error('Error updating booking:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      PENDING: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
      CONFIRMED: { label: 'Confirmé', className: 'bg-blue-100 text-blue-800' },
      COMPLETED: { label: 'Terminé', className: 'bg-green-100 text-green-800' },
      CANCELLED: { label: 'Annulé', className: 'bg-red-100 text-red-800' },
    }

    const variant = variants[status] || variants.PENDING
    return (
      <Badge className={variant.className}>
        {variant.label}
      </Badge>
    )
  }

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center">Chargement...</p>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const isProvider = session.user.role === 'PROVIDER'

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Bonjour, {session.user.profile?.firstName}
        </h1>
        <p className="text-gray-600">
          {isProvider
            ? 'Gérez vos services et réservations'
            : 'Gérez vos réservations et favoris'}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="bookings">Réservations</TabsTrigger>
          {isProvider && <TabsTrigger value="services">Mes services</TabsTrigger>}
          <TabsTrigger value="profile">Profil</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="mt-6">
          {bookings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Aucune réservation</p>
                {!isProvider && (
                  <Link href="/services">
                    <Button>Explorer les services</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="mb-2">
                          {booking.service.title}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          {isProvider
                            ? `Client: ${booking.client.profile.firstName} ${booking.client.profile.lastName}`
                            : `Prestataire: ${booking.provider.profile.firstName} ${booking.provider.profile.lastName}`}
                        </p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{formatDate(booking.scheduledDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold">
                          {formatPrice(booking.price)}
                        </span>
                      </div>
                    </div>

                    {isProvider && booking.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accepter
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Refuser
                        </Button>
                      </div>
                    )}

                    {booking.status === 'CONFIRMED' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}
                      >
                        Marquer comme terminé
                      </Button>
                    )}

                    {!isProvider && booking.status === 'COMPLETED' && (
                      <Link href={`/reviews/new?bookingId=${booking.id}`}>
                        <Button size="sm">
                          <Star className="h-4 w-4 mr-1" />
                          Laisser un avis
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {isProvider && (
          <TabsContent value="services" className="mt-6">
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-600 mb-4">
                  Créez et gérez vos services
                </p>
                <Link href="/services/new">
                  <Button>Créer un service</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations du profil</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Nom complet</p>
                  <p className="text-lg">
                    {session.user.profile?.firstName} {session.user.profile?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-lg">{session.user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Type de compte</p>
                  <Badge>
                    {isProvider ? 'Prestataire' : 'Client'}
                  </Badge>
                </div>
                {session.user.profile?.phoneNumber && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Téléphone</p>
                    <p className="text-lg">{session.user.profile.phoneNumber}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
