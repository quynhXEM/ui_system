// Next Imports
import type { Metadata } from 'next'

import Login from '@views/auth/Login'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { SEO } from '@/libs/SEO'

// Metadata
export const generateMetadata = async ({ params }: { params: { lang: string } }): Metadata => {
  const Title = await SEO(params.lang === 'en' ? 'en-US' : 'vi-VN')

  return {
    title: (Title?.translations?.[0]?.title) + " - " + (Title?.translations?.[0]?.slogan),
    description: Title?.translations?.[0]?.description
  }
}

const LoginPage = () => {
  const mode = getServerMode()

  return <Login mode={mode} />
}

export default LoginPage
