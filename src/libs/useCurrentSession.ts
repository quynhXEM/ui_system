import { useState, useEffect, useCallback } from 'react'

import { usePathname } from 'next/navigation'

import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'

import { SESSION_STATUS } from '@/utils/getStatus'

// This hook doesn't rely on the session provider
export const useCurrentSession = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<string>('unauthenticated')
  const pathName = usePathname()

  const retrieveSession = useCallback(async () => {
    // try {
    //   setStatus(SESSION_STATUS.LOADING)
    //   const sessionData = await getSession()

    //   if (sessionData) {
    //     setSession(sessionData)
    //     setStatus(SESSION_STATUS.AUTHEN)

    //     return
    //   }

    //   setStatus(SESSION_STATUS.UN_AUTH)
    // } catch (error) {
    //   setStatus(SESSION_STATUS.UN_AUTH)
    //   setSession(null)
    // }

    setSession(null)
    setStatus(SESSION_STATUS.AUTHEN)
  }, [])

  useEffect(() => {
    retrieveSession()

    // use the pathname to force a re-render when the user navigates to a new page
  }, [retrieveSession, pathName])

  return { session, status }
}
