import type { Metadata } from 'next'

import { SEO } from '@/libs/SEO'

import TLDSDetail from '@/views/app/tlds/TLDSDetail'

// Metadata
export const generateMetadata = async ({ params }: { params: { lang: string } }): Promise<Metadata> => {
  const Title = await SEO(params.lang === 'en' ? 'en-US' : 'vi-VN')

  return {
    title: (params.lang === 'en' ? 'Top-Level Domain Detail' : 'Chi tiết Đuôi Tên Miền') + " - " + (Title?.translations?.[0]?.title),
  }
}

const TLDSDetailPage = () => {
  return (
    <TLDSDetail />
  )
}

export default TLDSDetailPage
