'use client'

import Link from 'next/link'
import { 
  Hammer, 
  TreeDeciduous, 
  Sparkles, 
  Package, 
  Monitor,
  GraduationCap,
  Dog,
  Home
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const categories = [
  { name: 'Bricolage', icon: Hammer, slug: 'bricolage', color: 'bg-blue-100 text-blue-600' },
  { name: 'Jardinage', icon: TreeDeciduous, slug: 'jardinage', color: 'bg-green-100 text-green-600' },
  { name: 'Ménage', icon: Sparkles, slug: 'menage', color: 'bg-purple-100 text-purple-600' },
  { name: 'Déménagement', icon: Package, slug: 'demenagement', color: 'bg-orange-100 text-orange-600' },
  { name: 'Informatique', icon: Monitor, slug: 'informatique', color: 'bg-indigo-100 text-indigo-600' },
  { name: 'Cours', icon: GraduationCap, slug: 'cours-particuliers', color: 'bg-pink-100 text-pink-600' },
  { name: 'Animaux', icon: Dog, slug: 'animaux', color: 'bg-amber-100 text-amber-600' },
  { name: 'Aide à domicile', icon: Home, slug: 'aide-a-domicile', color: 'bg-teal-100 text-teal-600' },
]

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((category) => {
        const Icon = category.icon
        return (
          <Link key={category.slug} href={`/services?category=${category.slug}`}>
            <Card className="hover:shadow-md transition cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mb-3`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-gray-900">{category.name}</h3>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
