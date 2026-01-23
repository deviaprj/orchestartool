import { SearchBar } from '@/components/search/search-bar'
import { CategoryGrid } from '@/components/home/category-grid'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Star, Shield, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Réservez le prestataire idéal pour vos services à domicile
            </h1>
            <p className="text-xl text-blue-100">
              Bricolage, jardinage, ménage, cours particuliers... Trouvez des professionnels de confiance près de chez vous
            </p>
          </div>
          <SearchBar />
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            Parcourir les catégories
          </h2>
          <CategoryGrid />
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            Comment ça marche ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Décrivez votre besoin</h3>
                <p className="text-gray-600">
                  Indiquez le service dont vous avez besoin et votre localisation
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Choisissez votre prestataire</h3>
                <p className="text-gray-600">
                  Comparez les profils, avis et tarifs pour faire votre choix
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Réservez en ligne</h3>
                <p className="text-gray-600">
                  Payez en toute sécurité et profitez de votre service
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Paiement sécurisé</h3>
              <p className="text-sm text-gray-600">Protection de vos données</p>
            </div>
            <div className="text-center">
              <Star className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Avis vérifiés</h3>
              <p className="text-sm text-gray-600">Notations authentiques</p>
            </div>
            <div className="text-center">
              <Clock className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Réservation rapide</h3>
              <p className="text-sm text-gray-600">En quelques clics</p>
            </div>
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Service garanti</h3>
              <p className="text-sm text-gray-600">Satisfaction client</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Vous êtes un professionnel ?
          </h2>
          <p className="text-xl mb-6 text-blue-100">
            Rejoignez notre communauté de prestataires et développez votre activité
          </p>
          <Link href="/register?role=provider">
            <Button size="lg" variant="secondary">
              Devenir prestataire
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
