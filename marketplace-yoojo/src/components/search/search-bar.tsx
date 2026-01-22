'use client'

import { Search, MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function SearchBar() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-2 flex flex-col md:flex-row gap-2">
        {/* Service search */}
        <div className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r pb-2 md:pb-0">
          <Search className="h-5 w-5 text-gray-400 mr-2" />
          <Input
            type="text"
            placeholder="Quel service recherchez-vous ?"
            className="border-0 focus-visible:ring-0 px-0"
          />
        </div>

        {/* Location search */}
        <div className="flex-1 flex items-center px-4">
          <MapPin className="h-5 w-5 text-gray-400 mr-2" />
          <Input
            type="text"
            placeholder="Où ?"
            className="border-0 focus-visible:ring-0 px-0"
          />
        </div>

        {/* Search button */}
        <Button size="lg" className="w-full md:w-auto">
          Rechercher
        </Button>
      </div>
    </div>
  )
}
