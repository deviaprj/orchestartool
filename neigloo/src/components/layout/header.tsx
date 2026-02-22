'use client'

import Link from 'next/link'
import { Search, Menu, User, LogIn, MessageSquare, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function Header() {
  // TODO: Get from auth context
  const isAuthenticated = false
  const user: { avatar?: string } | null = null

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <span className="font-bold text-xl text-gray-900 hidden sm:block">
              Neigloo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/services"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Trouver un service
            </Link>
            <Link
              href="/become-provider"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Devenir prestataire
            </Link>
            <Link
              href="/how-it-works"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Comment ça marche
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <MessageSquare className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <Bell className="h-5 w-5" />
                </Button>
                <Link href="/dashboard">
                  <Avatar>
                    <AvatarImage src={user?.avatar || undefined} />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    <LogIn className="h-4 w-4 mr-2" />
                    Connexion
                  </Button>
                </Link>
                <Link href="/register" className="hidden sm:block">
                  <Button size="sm">S'inscrire</Button>
                </Link>
              </>
            )}

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
