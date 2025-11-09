import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

import { IRON_SESSION_COOKIE_NAME } from './constants'
import { SessionData } from './types'

const IRON_SESSION_PASSWORD = process.env.IRON_SESSION_PASSWORD!

if (!IRON_SESSION_PASSWORD) {
  throw new Error('IRON_SESSION_PASSWORD is not set')
} else if (IRON_SESSION_PASSWORD.length < 32) {
  throw new Error('IRON_SESSION_PASSWORD must be at least 32 characters long')
}

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), {
    password: IRON_SESSION_PASSWORD,
    cookieName: IRON_SESSION_COOKIE_NAME,
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  })
}

export function checkAuth(session: Awaited<ReturnType<typeof getSession>>) {
  return !!session.nullifierHashV4
}
