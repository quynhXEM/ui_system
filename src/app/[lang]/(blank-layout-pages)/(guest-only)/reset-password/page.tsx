// Next Imports
import type { Metadata } from 'next'

// Component Imports
import ResetPassword from '@/views/auth/ResetPassword'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { SEO } from '@/libs/SEO'

// Metadata
export const generateMetadata = async ({ params }: { params: { lang: string } }): Metadata => {
  const Title = await SEO(params.lang === 'en' ? 'en-US' : 'vi-VN')

  return {
    title: (params.lang === 'en' ? 'Reset Password' : 'Đặt lại mật khẩu') + " - " + (Title?.translations?.[0]?.title),
    description: params.lang === 'en' ? 'Reset your password' : 'Đặt lại mật khẩu của bạn'
  }
}

const ResetPasswordPage = () => {
  const mode = getServerMode()

  return <ResetPassword mode={mode} />
}

export default ResetPasswordPage
