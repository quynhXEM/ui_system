// Next Imports
import type { Metadata } from 'next'

// Component Imports
import Register from '@views/auth/Register'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { SEO } from '@/libs/SEO'

// Metadata
export const generateMetadata = async ({ params }: { params: { lang: string } }): Metadata => {
  const Title = await SEO(params.lang === 'en' ? 'en-US' : 'vi-VN')

  return {
    title: (params.lang === 'en' ? 'Register' : 'Đăng ký') + " - " + (Title?.translations?.[0]?.title),
    description: params.lang === 'en' ? 'Create a new account' : 'Tạo tài khoản mới'
  }
}

const RegisterPage = () => {
  const mode = getServerMode()

  return <Register mode={mode} />
}

export default RegisterPage
