// Next Imports
import type { Metadata } from 'next'

import Projects from '@/views/app/projects/Projects'

import { SEO } from '@/libs/SEO'

// Metadata
export const generateMetadata = async ({ params }: { params: { lang: string } }): Metadata => {
  const Title = await SEO(params.lang === 'en' ? 'en-US' : 'vi-VN')

  return {
    title: (params.lang === 'en' ? 'Projects' : 'Dự Án') + " - " + (Title?.translations?.[0]?.title),
  }
}


const ProjectsPage = () => {
  return <Projects />
}

export default ProjectsPage
