import 'next-auth'
import { UserRole } from '@prisma/client'

declare module 'next-auth' {
  interface User {
    id: string
    email: string
    role: UserRole
    profile?: {
      firstName: string
      lastName: string
      phoneNumber?: string
      avatar?: string
    }
  }

  interface Session {
    user: {
      id: string
      email: string
      role: UserRole
      profile?: {
        firstName: string
        lastName: string
        phoneNumber?: string
        avatar?: string
      }
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
    profile?: {
      firstName: string
      lastName: string
      phoneNumber?: string
      avatar?: string
    }
  }
}
