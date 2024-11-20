// Next Imports
import type { Metadata } from 'next'

import ProjectDetail from '@/views/app/projects/ProjectDetail'

import { SEO } from '@/libs/SEO'

// Metadata
export const generateMetadata = async ({ params }: { params: { lang: string } }): Metadata => {
  const Title = await SEO(params.lang === 'en' ? 'en-US' : 'vi-VN')

  return {
    title: (params.lang === 'en' ? 'Project Detail' : 'Chi tiết Dự án') + " - " + (Title?.translations?.[0]?.title),
    description: params.lang === 'en' ? 'All information about project' : 'Thông tin về dự án'
  }
}


const ProjectDetailPage = () => {
  return <ProjectDetail />
}

export default ProjectDetailPage
