import Link from 'next/link'
import { useParams } from 'next/navigation'

import { Card, CardContent, Typography } from '@mui/material'

import moment from 'moment'

import { ProjectItemType } from '@/types/projectTypes'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import OptionMenu from '@/@core/components/option-menu'
import { useDictionary } from '@/contexts/dictionaryContext'
import ProjectStatusChip from './ProjectStatusChip'

type ProjectItemProps = {
  projectData: ProjectItemType,
  onDeleteProject: (id: string, name: string) => void
}

const ProjectItem = ({ projectData, onDeleteProject }: ProjectItemProps) => {
  const { id, name, date_start, date_end, tasks, status, team_id, team_name, description } = projectData
  const { lang: locale } = useParams()
  const { dictionary } = useDictionary()

  return (
    <Card>
      <CardContent className='flex flex-col gap-3'>
        <div className='flex items-center justify-between'>
          <Link href={getLocalizedUrl(`/project/${projectData.id}`, locale as Locale)}>
            <Typography variant='h5'>{name}</Typography>
          </Link>
          <OptionMenu
            iconClassName='text-textDisabled'
            options={[
              {
                text: dictionary.delete_project,
                menuItemProps: { className: 'text-error hover:bg-[var(--mui-palette-error-lightOpacity)]', onClick: () => onDeleteProject(id, name) }
              }
            ]}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <div className='flex'>
            <ProjectStatusChip status={status} />
          </div>
          <Typography className='font-medium' color='text.primary'>
            {dictionary.team_id}: {team_name || team_id}
          </Typography>
          {!!date_start && (
            <div className='flex gap-2'>
              <Typography className='font-medium' color='text.primary'>
                {dictionary.date_start}:
              </Typography>
              <Typography>
                {moment(date_start)
                  .toDate()
                  .toLocaleDateString(locale === 'en' ? 'en-us' : 'vi-vn')}
              </Typography>
            </div>
          )}
          {!!date_end && (
            <div className='flex gap-2'>
              <Typography className='font-medium' color='text.primary'>
                {dictionary.date_end}:
              </Typography>
              <Typography>
                {moment(date_end)
                  .toDate()
                  .toLocaleDateString(locale === 'en' ? 'en-us' : 'vi-vn')}
              </Typography>
            </div>
          )}
          {!!description && <Typography>{description}</Typography>}
          <Typography className='font-medium' color='text.primary'>
            {tasks.length} {dictionary.tasks}
          </Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProjectItem
