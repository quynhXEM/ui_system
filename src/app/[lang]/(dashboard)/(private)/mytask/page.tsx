import { Metadata } from 'next'

import MyTask from '@/views/app/mytask/MyTask'

import { SEO } from '@/libs/SEO'


// Metadata
export const generateMetadata = async ({ params }: { params: { lang: string } }): Metadata => {
  const Title = await SEO(params.lang === 'en' ? 'en-US' : 'vi-VN')

  return {
    title: (params.lang === 'en' ? 'My Task' : 'Nhiệm Vụ Của Tôi') + " - " + (Title?.translations?.[0]?.title),
    description: Title?.translations?.[0]?.description
  }
}

const MyTaskPage = () => {
  return <MyTask />
}

export default MyTaskPage
