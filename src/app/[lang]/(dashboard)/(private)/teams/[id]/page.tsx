import React from 'react'

import { Metadata } from 'next'

import TeamDetailPage from '@/views/app/teams/teamdetail/TeamDetailPage'

import { SEO } from '@/libs/SEO'

// Metadata
export const generateMetadata = async ({ params }: { params: { lang: string } }): Metadata => {
  const Title = await SEO(params.lang === 'en' ? 'en-US' : 'vi-VN')

  return {
    title: (params.lang === 'en' ? 'Team Informations' : 'Thông Tin Đội Nhóm') + " - " + (Title?.translations?.[0]?.title),
  }
}


type Prop = {
  params: {
    id: string
  }
}

const page = ({ params }: Prop) => {
  return <TeamDetailPage id={params.id} />
}

export default page
