import { Metadata } from 'next'

import TeamPage from '@/views/app/teams/TeamPage'

import { SEO } from '@/libs/SEO'

// Metadata
export const generateMetadata = async ({ params }: { params: { lang: string } }): Metadata => {
  const Title = await SEO(params.lang === 'en' ? 'en-US' : 'vi-VN')

  return {
    title: (params.lang === 'en' ? 'Teams' : 'Đội nhóm') + " - " + (Title?.translations?.[0]?.title),
  }
}

export default function Page() {
  return <TeamPage />
}
