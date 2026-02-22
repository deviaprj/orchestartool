import { auth } from '@/lib/auth-helpers'

export { auth as middleware }

export const config = {
  matcher: ['/dashboard/:path*', '/services/new', '/bookings/:path*', '/profile/edit'],
}
