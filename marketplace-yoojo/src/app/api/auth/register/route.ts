import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { createLogger } from '@/lib/logger'
import { handleApiError } from '@/lib/errors'

const log = createLogger('api/auth/register')

const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  role: z.enum(['CLIENT', 'PROVIDER']),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  bio: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Validate input
    const validatedData = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte avec cet email existe déjà' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    // Create user with profile
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
        profile: {
          create: {
            firstName: validatedData.firstName || undefined,
            lastName: validatedData.lastName || undefined,
            ...(validatedData.phoneNumber && { phone: validatedData.phoneNumber }),
            ...(validatedData.address && { address: validatedData.address }),
            ...(validatedData.city && { city: validatedData.city }),
            ...(validatedData.zipCode && { postalCode: validatedData.zipCode }),
            ...(validatedData.bio && { bio: validatedData.bio }),
          },
        },
      },
      include: {
        profile: true,
      },
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    log.info('User registered', { userId: userWithoutPassword.id, role: validatedData.role })
    return NextResponse.json(
      {
        message: 'Compte créé avec succès',
        user: userWithoutPassword,
      },
      { status: 201 }
    )
  } catch (error) {
    return handleApiError(error)
  }
}
