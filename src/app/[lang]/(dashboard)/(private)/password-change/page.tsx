import { Metadata } from 'next'

import PasswordChangePage from '@/views/app/change-password/PasswordChangePage'

import { SEO } from '@/libs/SEO'

// Metadata
export const generateMetadata = async ({ params }: { params: { lang: string } }): Metadata => {
  const Title = await SEO(params.lang === 'en' ? 'en-US' : 'vi-VN')

  return {
    title: (params.lang === 'en' ? 'Change Password' : 'Thay Đổi Mật Khẩu') + " - " + (Title?.translations?.[0]?.title),
  }
}

export default function Page() {
  return <PasswordChangePage />
}
