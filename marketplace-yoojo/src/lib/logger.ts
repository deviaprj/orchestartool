/**
 * Structured logger utility.
 *
 * Outputs JSON lines in production for easy log aggregation and
 * human-friendly coloured text in development.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: string
  [key: string]: unknown
}

const isDev = process.env.NODE_ENV !== 'production'

function write(level: LogLevel, message: string, meta?: Record<string, unknown>, context?: string) {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(context ? { context } : {}),
    ...meta,
  }

  if (isDev) {
    const prefix = context ? `[${context}] ` : ''
    const text = `${entry.timestamp} ${level.toUpperCase().padEnd(5)} ${prefix}${message}`
    if (level === 'error') {
      console.error(text, meta ?? '')
    } else if (level === 'warn') {
      console.warn(text, meta ?? '')
    } else {
      console.log(text, meta ?? '')
    }
  } else {
    // Structured JSON output for production log aggregators
    console.log(JSON.stringify(entry))
  }
}

function createLogger(context?: string) {
  return {
    debug: (message: string, meta?: Record<string, unknown>) => write('debug', message, meta, context),
    info:  (message: string, meta?: Record<string, unknown>) => write('info',  message, meta, context),
    warn:  (message: string, meta?: Record<string, unknown>) => write('warn',  message, meta, context),
    error: (message: string, meta?: Record<string, unknown>) => write('error', message, meta, context),
  }
}

/** Default application-wide logger */
export const logger = createLogger('app')

/** Create a context-scoped logger (e.g. for a specific API route or module) */
export { createLogger }
