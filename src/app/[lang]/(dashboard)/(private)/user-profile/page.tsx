// Next Imports
import type { Metadata } from 'next'

import UserProfile from '@/views/app/user/UserProfile'
import { SEO } from '@/libs/SEO'

// Metadata
export const generateMetadata = async ({ params }: { params: { lang: string } }): Metadata => {
  const Title = await SEO(params.lang === 'en' ? 'en-US' : 'vi-VN')

  return {
    title: (params.lang === 'en' ? 'User Profile' : 'Hồ sơ cá nhân') + " - " + (Title?.translations?.[0]?.title),
    description: params.lang === 'en' ? 'User Profile' : 'Thông tin cá nhân'
  }
}

const UserProfilePage = () => {
  return <UserProfile />
}

export default UserProfilePage
