'use client'

import { useRef, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { Button, Card, CardContent } from '@mui/material'

import { createItem } from '@directus/sdk'

import { useDictionary } from '@/contexts/dictionaryContext'
import { useDirectus } from '@/contexts/directusProvider'
import ProjectForm, { ProjectFormData, ProjectFormHandle } from '@/components/projects/ProjectForm'
import CustomDialog, { CustomDialogData } from '@/components/CustomDialog'

const ProjectCreate = () => {
  const { dictionary } = useDictionary()
  const { directusRequest } = useDirectus()
  const { lang: locale } = useParams()
  const router = useRouter()
  const projectFormRef = useRef<ProjectFormHandle>(null)

  const [dialogData, setDialogData] = useState<CustomDialogData>({
    isOpen: false,
    title: '',
    contentText: '',
    actions: []
  })

  const onCloseDialog = () => {
    setDialogData({
      isOpen: false,
      title: '',
      contentText: '',
      actions: []
    })
  }

  const onPressBack = () => {
    if (projectFormRef?.current?.isDirty) {
      setDialogData({
        isOpen: true,
        title: dictionary.create_project,
        contentText: dictionary.discard_all_your_change,
        actions: [
          {
            label: dictionary.stay_here,
            buttonProps: {
              onClick: onCloseDialog,
              color: 'secondary'
            }
          },
          {
            label: dictionary.go_back,
            buttonProps: {
              onClick: () => {
                onCloseDialog()
                router.back()
              }
            }
          }
        ]
      })
    } else {
      router.back()
    }
  }

  const onPressSubmit = async () => {
    if (projectFormRef?.current?.isDirty) {
      projectFormRef?.current?.submit()
    }
  }

  const onSubmit = async (values: ProjectFormData) => {
    try {
      const {
        team_id,
        name,
        status,
        description,
        date_start: dateStart,
        date_end: dateEnd,
        dependency_project_id,
      } = values

      // Check date_start < date_end
      const date_start = dateStart.toISOString()
      const date_end = dateEnd.toISOString()

      if (date_start >= date_end) {
        showError(dictionary.date_start_must_be_earlier_than_date_end)

        return
      }

      const createProjectAPI = await directusRequest(
        createItem('projects', {
          team_id,
          name,
          status,
          ...(!!description && { description }),
          date_start,
          date_end,
          ...(!!dependency_project_id && { dependency_project_id }),
        })
      )

      if (createProjectAPI && createProjectAPI.id) {
        setDialogData({
          isOpen: true,
          title: dictionary.create_project_success,
          contentText: dictionary.do_you_want_to_create_new_one,
          actions: [
            {
              label: dictionary.create_new,
              buttonProps: {
                onClick: () => {
                  onCloseDialog()
                  projectFormRef?.current?.clearForm()
                }
              }
            },
            {
              label: dictionary.go_back,
              buttonProps: {
                onClick: () => {
                  onCloseDialog()
                  router.back()
                }
              }
            }
          ]
        })
      } else {
        showError(dictionary.create_failed + ' ' + dictionary.please_try_again_later)
      }
    } catch (err) {
      console.log('--- ERROR create Project:', err)
      showError(err?.[0]?.message ?? dictionary.create_failed + ' ' + dictionary.please_try_again_later)
    }
  }

  const showError = (err: string) => {
    setDialogData({
      isOpen: true,
      title: dictionary.create_project_error,
      contentText: err,
      actions: [
        {
          label: dictionary.ok,
          buttonProps: {
            onClick: onCloseDialog
          }
        }
      ]
    })
  }

  return (
    <>
      <Card>
        <CardContent className='flex flex-col gap-4'>
          <div className='flex justify-between'>
            <Button variant='contained' color='secondary' onClick={onPressBack}>
              {dictionary.go_back}
            </Button>
            <Button variant='contained' onClick={onPressSubmit}>
              {dictionary.create}
            </Button>
          </div>
          <ProjectForm ref={projectFormRef} onSubmit={onSubmit} />
        </CardContent>
      </Card>
      <CustomDialog dialogData={dialogData} onCloseDialog={onCloseDialog} />
    </>
  )
}

export default ProjectCreate
