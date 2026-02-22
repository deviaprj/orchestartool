'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Star, Search } from 'lucide-react'
import Link from 'next/link'

interface Service {
  id: string
  title: string
  description: string
  price: number
  priceUnit: string
  images: string[]
  category: {
    id: string
    name: string
    icon: string
  }
  provider: {
    profile: {
      firstName: string
      lastName: string
      avatar: string | null
      rating: number | null
      city: string | null
    }
  }
  reviews: Array<{ rating: number }>
}

export default function ServicesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: searchParams.search || '',
    category: searchParams.category || '',
    city: searchParams.city || '',
  })

  useEffect(() => {
    fetchServices()
  }, [searchParams])

  const fetchServices = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchParams.search) params.append('search', searchParams.search)
      if (searchParams.category) params.append('categoryId', searchParams.category)
      if (searchParams.city) params.append('city', searchParams.city)

      const response = await fetch(`/api/services?${params.toString()}`)
      const data = await response.json()
      setServices(data.services || [])
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.category) params.append('category', filters.category)
    if (filters.city) params.append('city', filters.city)

    router.push(`/services?${params.toString()}`)
  }

  const calculateAvgRating = (reviews: Array<{ rating: number }>) => {
    if (reviews.length === 0) return 0
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Rechercher un service</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search">Service</Label>
              <Input
                id="search"
                placeholder="Quel service recherchez-vous ?"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="city">Localisation</Label>
              <Input
                id="city"
                placeholder="Ville"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Chargement...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun service trouvé</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-gray-600">{services.length} service(s) trouvé(s)</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link key={service.id} href={`/services/${service.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                    {service.images[0] ? (
                      <img
                        src={service.images[0]}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        {service.category.icon}
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <Badge className="mb-2">{service.category.name}</Badge>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                        {service.provider.profile.firstName[0]}
                        {service.provider.profile.lastName[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {service.provider.profile.firstName} {service.provider.profile.lastName}
                        </p>
                        {service.provider.profile.city && (
                          <p className="text-xs text-gray-500 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {service.provider.profile.city}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {calculateAvgRating(service.reviews).toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({service.reviews.length})
                        </span>
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        {service.price}€
                        <span className="text-sm font-normal text-gray-500">
                          /{service.priceUnit === 'HOUR' ? 'h' : service.priceUnit === 'DAY' ? 'j' : ''}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
