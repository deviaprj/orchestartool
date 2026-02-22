/**
 * Environment variable validation.
 *
 * Validates required env vars at module load time so the application
 * fails fast with a clear message rather than crashing deep inside
 * a request handler.
 *
 * Add optional vars with a default value; required vars will throw
 * if absent.
 */

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}\n` +
      `Copy .env.example to .env and fill in the value.`,
    )
  }
  return value
}

function optionalEnv(name: string, fallback: string): string {
  return process.env[name] ?? fallback
}

// ---------------------------------------------------------------------------
// Validated environment object
// ---------------------------------------------------------------------------

export const env = {
  // Required
  databaseUrl:    requireEnv('DATABASE_URL'),
  nextAuthSecret: requireEnv('NEXTAUTH_SECRET'),

  // Optional with sensible defaults
  nextAuthUrl:         optionalEnv('NEXTAUTH_URL', 'http://localhost:3000'),
  platformFeePercent:  parseInt(optionalEnv('PLATFORM_FEE_PERCENTAGE', '15'), 10),
  nodeEnv:             optionalEnv('NODE_ENV', 'development'),
  dbLogQueries:        optionalEnv('DB_LOG_QUERIES', 'false') === 'true',

  // Payment (optional; gated at runtime when actually used)
  stripeSecretKey:      process.env.STRIPE_SECRET_KEY,
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  stripeWebhookSecret:  process.env.STRIPE_WEBHOOK_SECRET,

  // Email
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  emailFrom:      optionalEnv('EMAIL_FROM', 'noreply@example.com'),
} as const
