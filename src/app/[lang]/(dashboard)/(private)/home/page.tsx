// import { Metadata } from 'next'

// import { SEO } from '@/libs/SEO'

// Metadata
// export const generateMetadata = async ({ params }: { params: { lang: string } }): Metadata => {
//   const Title = await SEO(params.lang === 'en' ? 'en-US' : 'vi-VN')

//   return {
//     title: (params.lang === 'en' ? 'Home' : 'Trang Chủ') + ' - ' + Title?.translations?.[0]?.title
//   }
// }

export default function Page() {
  return <>Đây là trang home</>
}
