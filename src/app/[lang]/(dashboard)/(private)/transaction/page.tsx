import Transaction from '@/views/app/transaction/Transaction'

import { SEO } from '@/libs/SEO'

// Metadata
export const generateMetadata = async ({ params }: { params: { lang: string } }): Metadata => {
  const Title = await SEO(params.lang === 'en' ? 'en-US' : 'vi-VN')

  return {
    title: (params.lang === 'en' ? 'Transaction' : 'Lịch Sử Giao Dịch') + " - " + (Title?.translations?.[0]?.title),
  }
}

const Page = () => {
  return <Transaction />
}

export default Page
