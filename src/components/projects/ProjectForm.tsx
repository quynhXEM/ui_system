import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import Image from 'next/image'

import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, pipe, nonEmpty, date } from 'valibot'
import type { InferInput } from 'valibot'

import {
  Grid,
  MenuItem,
  Typography
} from '@mui/material'

import { readItems } from '@directus/sdk'

import moment from 'moment'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import CustomTextField from '@/@core/components/mui/TextField'
import { useDictionary } from '@/contexts/dictionaryContext'
import { useDirectus } from '@/contexts/directusProvider'
import { ProjectStatus } from '@/data/items/project'
import { TeamItemType } from '@/types/teamTypes'
import { ProjectItemType } from '@/types/projectTypes'

export type ProjectFormData = InferInput<typeof schema>

const schema = object({
  team_id: pipe(string(), nonEmpty('required')),
  status: pipe(string(), nonEmpty('required')),
  name: pipe(string(), nonEmpty('required')),
  description: string(),
  date_start: date(),
  date_end: date(),
  dependency_project_id: string(),
})

export type ProjectFormHandle = {
  submit: () => void
  clearForm: () => void
  isDirty: boolean
  getDirtyFields: () => any
}
type ProjectFormProps = {
  onSubmit: (values: ProjectFormData) => void
  initFormData?: ProjectFormData | null
  currentProject?: string
}

const ProjectForm = forwardRef<ProjectFormHandle, ProjectFormProps>(function ProjectForm(
  { onSubmit, initFormData, currentProject },
  ref
) {
  const { dictionary } = useDictionary()
  const { directusRequest } = useDirectus()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, dirtyFields, isDirty }
  } = useForm<ProjectFormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      team_id: initFormData?.team_id ?? '',
      status: initFormData?.status ?? ProjectStatus[0].label,
      name: initFormData?.name ?? '',
      description: initFormData?.description ?? '',
      date_start: initFormData?.date_start ? moment(initFormData?.date_start).toDate() : new Date(),
      date_end: initFormData?.date_end ? moment(initFormData?.date_end).toDate() : new Date(),
      dependency_project_id: initFormData?.dependency_project_id ?? '',
    }
  })

  const [teamList, setTeamList] = useState<TeamItemType[]>([])
  const [projectList, setProjectList] = useState<ProjectItemType[]>([])

  useEffect(() => {
    getTeams()
    getProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useImperativeHandle(ref, () => {
    return {
      submit() {
        handleSubmit(onSubmit)()
      },
      clearForm() {
        reset()
      },
      isDirty,
      getDirtyFields() {
        return dirtyFields
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty])

  const getTeams = async () => {
    const teams = await directusRequest(readItems('teams'))

    if (teams && Array.isArray(teams)) {
      setTeamList(teams)
    }
  }

  const getProjects = async () => {
    const projects = await directusRequest(
      readItems('projects', {
        filter: {
          id: {
            _neq: currentProject
          }
        }
      })
    )

    if (projects && Array.isArray(projects)) {
      setProjectList(projects)
    }
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Controller
          name='team_id'
          control={control}
          render={({ field }) => (
            <div className='flex flex-col'>
              <Typography className='font-medium'>{dictionary.team_id}</Typography>
              <CustomTextField
                {...field}
                defaultValue=""
                select
                fullWidth
                placeholder={dictionary.select_team}
                onChange={e => {
                  field.onChange(e.target.value)
                }}
                disabled={isSubmitting}
                {...(errors.name && {
                  error: true,
                  helperText:
                    errors?.team_id?.message && dictionary?.[errors.team_id.message as keyof typeof dictionary]
                })}
              >
                {teamList.map(team => (
                  <MenuItem key={team.id} value={team.id}>
                    <div className='flex flex-row gap-2 items-center'>
                      <Image
                        alt='logo'
                        src={`${process.env.NEXT_PUBLIC_API_URL}/assets/${team.logo || team.icon}`}
                        priority
                        width={10}
                        height={10}
                        className='w-5 h-5'
                      />
                      <Typography>{team.name}</Typography>
                    </div>
                  </MenuItem>
                ))}
              </CustomTextField>
            </div>
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name='status'
          control={control}
          render={({ field }) => (
            <div className='flex flex-col'>
              <Typography className='font-medium'>{dictionary.status}</Typography>
              <CustomTextField
                {...field}
                select
                fullWidth
                placeholder={dictionary.status}
                onChange={e => {
                  field.onChange(e.target.value)
                }}
                disabled={isSubmitting}
              >
                {ProjectStatus.map(status => (
                  <MenuItem key={status.label} value={status.label}>
                    <div className='flex flex-row gap-2 items-center'>
                      <div className='h-2 w-2 rounded-full' style={{ backgroundColor: status.color }} />
                      <Typography>{dictionary[status.label as keyof typeof dictionary]}</Typography>
                    </div>
                  </MenuItem>
                ))}
              </CustomTextField>
            </div>
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name='name'
          control={control}
          render={({ field }) => (
            <div className='flex flex-col'>
              <Typography className='font-medium'>{dictionary.name}</Typography>
              <CustomTextField
                {...field}
                fullWidth
                placeholder={dictionary.enter_name}
                onChange={e => {
                  field.onChange(e.target.value)
                }}
                {...(errors.name && {
                  error: true,
                  helperText: errors?.name?.message && dictionary?.[errors.name.message as keyof typeof dictionary]
                })}
                disabled={isSubmitting}
              />
            </div>
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name='description'
          control={control}
          render={({ field }) => (
            <div className='flex flex-col'>
              <Typography className='font-medium'>{dictionary.desciption}</Typography>
              <CustomTextField
                {...field}
                fullWidth
                multiline
                rows={6}
                placeholder={dictionary.enter_description}
                onChange={e => {
                  field.onChange(e.target.value)
                }}
                {...(errors.description && {
                  error: true,
                  helperText:
                    errors?.description?.message && dictionary?.[errors.description.message as keyof typeof dictionary]
                })}
                disabled={isSubmitting}
              />
            </div>
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name='date_start'
          control={control}
          render={({ field: { value, onChange } }) => (
            <div className='flex flex-col'>
              <Typography className='font-medium'>{dictionary.date_start}</Typography>
              <AppReactDatepicker
                selected={value}
                placeholderText={dictionary.date_start}
                dateFormat={'dd-MM-yyyy HH:mm:ss'}
                onChange={(date: Date | null) => onChange(date)}
                customInput={<CustomTextField fullWidth />}
                showTimeInput
              />
            </div>
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name='date_end'
          control={control}
          render={({ field: { value, onChange } }) => (
            <div className='flex flex-col'>
              <Typography className='font-medium'>{dictionary.date_end}</Typography>
              <AppReactDatepicker
                selected={value}
                placeholderText={dictionary.date_end}
                dateFormat={'dd-MM-yyyy HH:mm:ss'}
                onChange={(date: Date | null) => onChange(date)}
                customInput={<CustomTextField fullWidth />}
                showTimeInput
              />
            </div>
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name='dependency_project_id'
          control={control}
          render={({ field }) => (
            <div className='flex flex-col'>
              <Typography className='font-medium'>{dictionary.dependency_project_id}</Typography>
              <CustomTextField
                {...field}
                defaultValue=""
                select
                fullWidth
                placeholder={dictionary.select_dependency_project_id}
                onChange={e => {
                  field.onChange(e.target.value)
                }}
                disabled={isSubmitting}
              >
                <MenuItem value={''}>{dictionary.no_dependent_project}</MenuItem>
                {projectList.map(project => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </div>
          )}
        />
      </Grid>
    </Grid>
  )
})

export default ProjectForm
