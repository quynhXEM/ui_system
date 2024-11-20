import { Metadata } from 'next'

import FinancailReportPage from '@/views/app/financial-report/FinancailReportPage'

import { SEO } from '@/libs/SEO'

// Metadata
export const generateMetadata = async ({ params }: { params: { lang: string } }): Metadata => {
  const Title = await SEO(params.lang === 'en' ? 'en-US' : 'vi-VN')

  return {
    title: (params.lang === 'en' ? 'Financial Report' : 'Báo Cáo Tài Chính') + " - " + (Title?.translations?.[0]?.title),
  }
}

export default function Page() {
  return <FinancailReportPage />
}
