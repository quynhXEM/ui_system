'use client'

import { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

import { deleteItem, readItems } from '@directus/sdk'

import { Box, Button, Card, CardContent, Grid, IconButton, InputAdornment } from '@mui/material'

import { useSession } from 'next-auth/react'

import ProjectItem from '@components/projects/ProjectItem'

import { useDirectus } from '@/contexts/directusProvider'
import { useDictionary } from '@/contexts/dictionaryContext'
import { ProjectItemType } from '@/types/projectTypes'
import CustomTextField from '@/@core/components/mui/TextField'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import { TeamItemType } from '@/types/teamTypes'
import CustomDialog, { CustomDialogData } from '@/components/CustomDialog'

const Projects = () => {
  const { data: session } = useSession()
  const { dictionary } = useDictionary()
  const { directusRequest } = useDirectus()
  const [data, setData] = useState<ProjectItemType[]>([])
  const [searchText, setSearchText] = useState('')
  const { lang: locale } = useParams()

  const [dialogData, setDialogData] = useState<CustomDialogData>({
    isOpen: false,
    title: '',
    contentText: '',
    actions: []
  })

  useEffect(() => {
    getProjectsData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onCloseDialog = () => {
    setDialogData({
      isOpen: false,
      title: '',
      contentText: '',
      actions: []
    })
  }

  const getProjectsData = async () => {
    const projects = await directusRequest(
      readItems('projects', { filter: { user_created: { _eq: session?.user?.id } } })
    )

    const teams = await directusRequest(readItems('teams'))

    if (projects && Array.isArray(projects)) {
      const _projects = projects.map(proj => ({
        ...proj,
        team_name: teams?.find((team: TeamItemType) => team.id === proj.team_id)?.name ?? ''
      }))

      setData(_projects)
    }
  }

  const getDisplayProject = () => {
    if (!searchText) return data

    return data.filter(data => data.name?.toLowerCase()?.includes(searchText.trim().toLowerCase()))
  }

  const onDeleteProject = (id: string, name: string) => {
    setDialogData({
      isOpen: true,
      title: dictionary.delete_project,
      contentText: dictionary.do_you_want_to_delete_project + " " + name + "?",
      actions: [
        {
          label: dictionary.cancel,
          buttonProps: {
            onClick: onCloseDialog,
            color: "secondary"
          },
        },
        {
          label: dictionary.delete,
          buttonProps: {
            color: 'error',
            onClick: async () => {
              onCloseDialog()
              await directusRequest(deleteItem('projects', id))
              await getProjectsData()
            },
          },
        }
      ]
    })
  }

  return (

    <>
      <Card>
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <CustomTextField
                fullWidth
                value={searchText}
                onChange={e => {
                  setSearchText(e.target.value)
                }}
                placeholder={dictionary.search + '...'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      {!!searchText && (
                        <IconButton edge='end' onClick={() => setSearchText('')} onMouseDown={e => e.preventDefault()}>
                          <i className='tabler-x' />
                        </IconButton>
                      )}
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={4} className='flex md:justify-end'>
              <Button variant='contained' href={getLocalizedUrl('/project/create', locale as Locale)}>
                {dictionary.create_project}
              </Button>
            </Grid>
            {getDisplayProject().map(project => (
              <Grid key={project.id} item xs={12} sm={6} md={4}>
                <ProjectItem projectData={project} onDeleteProject={onDeleteProject} />
              </Grid>
            ))}
            {!getDisplayProject().length && (
              <div className='flex justify-center w-full mt-6'>{dictionary.no_project}</div>
            )}
          </Grid>
        </CardContent>
      </Card>
      <CustomDialog dialogData={dialogData} onCloseDialog={onCloseDialog} />
    </>
  )
}

export default Projects
