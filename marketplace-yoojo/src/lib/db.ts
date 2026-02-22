import { PrismaClient } from '@prisma/client'
import { createLogger } from './logger'

const log = createLogger('prisma')

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// In development, also print queries when DB_LOG_QUERIES=true
const logConfig =
  process.env.DB_LOG_QUERIES === 'true'
    ? (['query', 'warn', 'error'] as const)
    : (['warn', 'error'] as const)

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: logConfig.map((level) => ({ emit: 'stdout', level } as const)),
  })

// Log a startup message so operators know Prisma is initialised
log.info('Prisma client initialised', { logLevel: logConfig.join(',') })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
