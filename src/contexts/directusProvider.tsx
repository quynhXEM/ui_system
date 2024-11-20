'use client'

import { createContext, PropsWithChildren, useContext } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { authentication, createDirectus, refresh, rest, withToken } from '@directus/sdk'

import { getSession, useSession } from 'next-auth/react'

import { ofetch } from 'ofetch'

import directusNonInterception from '@/libs/directus'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import { useCurrentSession } from '@/libs/useCurrentSession'

type DirectusContextProps = {
  directusRequest: (options: any) => Promise<any>
}

const DirectusContext = createContext<DirectusContextProps | null>(null)

export const DirectusProvider = ({ children }: PropsWithChildren) => {
  const { update } = useSession()
  const { lang: locale } = useParams()
  const router = useRouter()

  // const session = useCurrentSession().session

  const session = null

  const apiFetch = ofetch.create({
    onRequestError({ error }) {
      return Promise.reject(error)
    },
    async onResponseError({ response }) {
      switch (response.status) {
        case 401:
        case 403:
          const refreshAPI = await directusNonInterception.request(refresh('json', session?.user?.refresh_token ?? ''))

          update({ ...session, user: { ...refreshAPI, tokenExpire: Date.now() + refreshAPI?.expires - 15000 } })

          break
      }

      return Promise.reject(response)
    }
  })

  const directus = createDirectus(process.env.NEXT_PUBLIC_API_URL || '', { globals: { fetch: apiFetch } })
    .with(authentication('json'))
    .with(rest())

  const directusRequest = async (options: any) => {
    // const session = await getSession()

    // if (!session) {
    //   router.replace(getLocalizedUrl('/home', locale as Locale))
    // }

    // const result = await directus?.request(withToken(session?.user?.access_token ?? '', options))

    return null
  }

  return <DirectusContext.Provider value={{ directusRequest }}>{children}</DirectusContext.Provider>
}

export const useDirectus = () => {
  const context = useContext(DirectusContext)

  if (!context) {
    throw new Error('useDictionary must be used within a DictionaryProvider')
  }

  return context
}
