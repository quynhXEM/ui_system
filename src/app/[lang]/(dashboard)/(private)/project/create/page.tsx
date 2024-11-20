// Next Imports
import type { Metadata } from 'next'

import ProjectCreate from '@/views/app/projects/ProjectCreate'

import { SEO } from '@/libs/SEO'

// Metadata
export const generateMetadata = async ({ params }: { params: { lang: string } }): Metadata => {
  const Title = await SEO(params.lang === 'en' ? 'en-US' : 'vi-VN')

  return {
    title: (params.lang === 'en' ? 'Create Project' : 'Tạo Dự án') + " - " + (Title?.translations?.[0]?.title),
    description: params.lang === 'en' ? 'Create a new Project' : 'Tạo Dự án mới'
  }
}


const ProjectCreatePage = () => {
  return <ProjectCreate />
}

export default ProjectCreatePage
