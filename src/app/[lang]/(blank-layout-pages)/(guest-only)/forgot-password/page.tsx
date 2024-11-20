// Next Imports
import type { Metadata } from 'next'

// Component Imports
import ForgotPassword from '@views/auth/ForgotPassword'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { SEO } from '@/libs/SEO'

// Metadata
export const generateMetadata = async ({ params }: { params: { lang: string } }): Metadata => {
  const Title = await SEO(params.lang === 'en' ? 'en-US' : 'vi-VN')

  return {
    title: (params.lang === 'en' ? 'Forgot Password' : 'Quên mật khẩu') + " - " + (Title?.translations?.[0]?.title),
    description: params.lang === 'en' ? 'Reset your password' : 'Đặt lại mật khẩu của bạn'
  }
}

const ForgotPasswordPage = () => {
  const mode = getServerMode()

  return <ForgotPassword mode={mode} />
}

export default ForgotPasswordPage
