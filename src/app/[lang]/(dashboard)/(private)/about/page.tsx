
import { Metadata } from 'next'

import { SEO } from '@/libs/SEO'

// Metadata
export const generateMetadata = async ({ params }: { params: { lang: string } }): Metadata => {
  const Title = await SEO(params.lang === 'en' ? 'en-US' : 'vi-VN')

  return {
    title: (params.lang === 'en' ? 'About' : 'Về Chúng Tôi') + " - " + (Title?.translations?.[0]?.title),
  }
}

export default function Page() {
  return <h1>About page!</h1>
}
