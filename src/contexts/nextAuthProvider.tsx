'use client'

import { useCallback, useEffect, useState } from 'react'

import { usePathname } from 'next/navigation'

import { SessionProvider } from 'next-auth/react'
import type { SessionProviderProps } from 'next-auth/react'

import { Session } from 'next-auth'

import { DirectusProvider } from './directusProvider'
import { useCurrentSession } from '@/libs/useCurrentSession'

export const NextAuthProvider = ({ children, ...rest }: SessionProviderProps) => {
  const [session, setSession] = useState<Session | null>(null)
  const pathName = usePathname()
  const sessionData = useCurrentSession().session

  const fetchSession = useCallback(async () => {
    try {
      setSession(sessionData)
    } catch (error) {
      setSession(null)

      if (process.env.NODE_ENV === 'development') {
        console.error(error)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchSession().finally()
  }, [fetchSession, pathName])

  return (
    <SessionProvider {...rest} session={session}>
      <DirectusProvider>{children}</DirectusProvider>
    </SessionProvider>
  )
}
