import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { createLogger } from './logger'

const log = createLogger('api')

// ---------------------------------------------------------------------------
// Typed application errors
// ---------------------------------------------------------------------------

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(404, 'NOT_FOUND', `${resource} not found`)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(401, 'UNAUTHORIZED', message)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(403, 'FORBIDDEN', message)
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(400, 'VALIDATION_ERROR', message)
  }
}

// ---------------------------------------------------------------------------
// Centralised API error response helper
// ---------------------------------------------------------------------------

/**
 * Convert any thrown value into a typed NextResponse.
 * Use this at the bottom of every catch block in API routes.
 */
export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: 'Validation failed', details: error.issues },
      { status: 400 },
    )
  }

  if (error instanceof AppError) {
    if (error.statusCode >= 500) {
      log.error(error.message, { code: error.code, stack: error.stack })
    }
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode },
    )
  }

  // Unknown / unexpected errors
  const message = error instanceof Error ? error.message : 'Internal server error'
  log.error('Unhandled API error', { message, stack: error instanceof Error ? error.stack : undefined })

  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 },
  )
}
