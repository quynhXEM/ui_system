// import type { Metadata } from 'next'

// import { SEO } from '@/libs/SEO'
import TLDS from '@/views/app/tlds/TLDS'

// // Metadata
// export const generateMetadata = async ({ params }: { params: { lang: string } }): Promise<Metadata> => {
//   const Title = await SEO(params.lang === 'en' ? 'en-US' : 'vi-VN')

//   return {
//     title: (params.lang === 'en' ? 'Top-Level Domain' : 'Đuôi Tên Miền') + " - " + (Title?.translations?.[0]?.title),
//   }
// }

const TLDSPage = () => {
  return <TLDS />
}

export default TLDSPage
